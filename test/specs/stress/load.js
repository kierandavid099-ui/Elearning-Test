import http from 'k6/http'
import exec from 'k6/execution'
import { check, sleep } from 'k6'
import { BASE, login, signedOut, listModel, listCards } from './lib/site.js'
import { ADMIN, accounts } from './lib/accounts.js'
import { allureSummary } from './lib/allure.js'

// ─────────────────────────────────────────────────────────────────────────────
// READ-ONLY load test. Each virtual user signs in as one of its role's
// accounts and browses that role's screens (page + its card list) with a
// pause between pages, like a person would. The only POST is the login form.
// k6 clears cookies between iterations, so every iteration is a fresh session.
//
//   npm run stress                                        smoke: 1 VU per role, 1 minute
//   k6 run -e STUDENT_VUS=20 -e DURATION=5m test/specs/stress/load.js
//
// Results also go to allure-results (see lib/allure.js), one case per
// role threshold and per check.
//
// VUs per role: ADMIN_VUS, COURSE_ADMIN_VUS, COURSE_INSTRUCTOR_VUS, STUDENT_VUS
// (0 leaves a role out). When VUs outnumber a role's accounts, accounts are
// shared; all admin VUs share the single admin account.
// ─────────────────────────────────────────────────────────────────────────────

const DURATION = __ENV.DURATION || '1m'
const vus = (name) => Number(__ENV[name] ?? 1)

const ROLES = {
    admin: { vus: vus('ADMIN_VUS'), exec: 'admin' },
    courseAdmin: { vus: vus('COURSE_ADMIN_VUS'), exec: 'courseAdmin' },
    courseInstructor: { vus: vus('COURSE_INSTRUCTOR_VUS'), exec: 'courseInstructor' },
    student: { vus: vus('STUDENT_VUS'), exec: 'student' },
}

const running = Object.entries(ROLES).filter(([, r]) => r.vus > 0)

export const options = {
    scenarios: Object.fromEntries(running
        .map(([name, r]) => [name, { executor: 'constant-vus', vus: r.vus, duration: DURATION, exec: r.exec }])),
    // Per role, so each shows up separately in the summary and in Allure.
    // Response-time target is deliberately generous: even with 1 user per
    // role the server's p(95) was ~12s, so this only fails on a real slowdown.
    thresholds: Object.fromEntries(running.flatMap(([name]) => [
        [`http_req_failed{scenario:${name}}`, ['rate<0.01']],
        [`checks{scenario:${name}}`, ['rate>0.99']],
        [`http_req_duration{scenario:${name}}`, ['p(95)<30000']],
    ])),
}

export function handleSummary(data) {
    return allureSummary(data, {
        suite: 'Load test',
        parameters: { Duration: DURATION, ...Object.fromEntries(running.map(([name, r]) => [`${name} VUs`, r.vus])) },
    })
}

const PAGES = {
    admin: [
        '/scola-elearning/dashboard',
        '/scola-elearning/managers',
        '/scola-elearning/lecturers',
        '/scola-elearning/students',
        '/scola-elearning/website-content',
        '/scola-elearning/settings',
    ],
    courseAdmin: [
        '/scola-elearning/dashboard',
        '/scola-core/notifications',
        '/scola-elearning/announcements',
        '/scola-elearning/calendarEntries',
        '/scola-elearning/dashboard/archives',
        '/scola-elearning/lecturers',
        '/scola-elearning/students',
        '/scola-core/courses',
        '/scola-elearning/courseClasses',
        '/scola-core/credit_loads',
        '/scola-elearning/enrollments',
    ],
    courseInstructor: [
        '/scola-elearning/dashboard',
        '/scola-elearning/assignedClasses',
        '/scola-elearning/dashboard/archives',
    ],
    student: [
        '/scola-elearning/dashboard',
        '/scola-elearning/enrolled-classes',
        '/scola-elearning/dashboard/archives',
        '/scola-elearning/help',
    ],
}

// Short, common fragments so the search actually returns matches.
const SEARCH_TERMS = ['a', 'e', 'an', 'son', 'load']

// Think time between pages: 1–3s.
const think = () => sleep(1 + Math.random() * 2)

// Spread VUs over the role's accounts; extra VUs wrap round and share.
function accountFor(list) {
    return list[(exec.vu.idInTest - 1) % list.length]
}

function visit(path) {
    const url = `${BASE}${path}`
    const res = http.get(url, { tags: { name: path } })
    const ok = check(res, {
        'page loads': (r) => r.status === 200,
        'still signed in': (r) => !signedOut(r),
    })
    if (!ok) return
    // List screens fetch their cards straight after the page, as the browser does.
    const model = listModel(res.body)
    if (model) {
        const list = listCards(url, model, { name: `${path} list` })
        check(list, { 'list loads': (r) => r.status === 200 && r.json('cards_html') !== undefined })
    }
}

function searchStudents() {
    const url = `${BASE}/scola-elearning/students`
    const term = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)]
    const res = listCards(url, 'Hasob\\Scola\\Core\\Models\\Student', { search: term, name: 'students search' })
    check(res, { 'search responds': (r) => r.status === 200 && r.json('cards_html') !== undefined })
}

function session(account, pages, extra) {
    if (!login(account.email, account.password)) { think(); return }
    for (const path of pages) {
        think()
        visit(path)
    }
    if (extra) { think(); extra() }
    think()
}

export function admin() { session(ADMIN, PAGES.admin, searchStudents) }
export function courseAdmin() { session(accountFor(accounts('courseadmin')), PAGES.courseAdmin, searchStudents) }
export function courseInstructor() { session(accountFor(accounts('courseinstructor')), PAGES.courseInstructor) }
export function student() { session(accountFor(accounts('student')), PAGES.student) }
