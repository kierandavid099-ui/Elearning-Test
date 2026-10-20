import http from 'k6/http'
import { check, fail, sleep } from 'k6'
import { parseHTML } from 'k6/html'
import { BASE, API, login, apiHeaders, listModel, listCards, optionValues } from './lib/site.js'
import { ADMIN, PASSWORD, accounts } from './lib/accounts.js'
import { allureSummary } from './lib/allure.js'

// ─────────────────────────────────────────────────────────────────────────────
// ONE-OFF SETUP — CHANGES DATA. Signed in as the admin, creates the load-test
// accounts through the same API calls the admin screens make, then sets each
// one's password. Safe to re-run: an account that already exists is not
// created again, only its password is (re)set.
//
//   npm run stress:setup                                            all 85 accounts
//   k6 run -e LIMIT=1 test/specs/stress/setup-accounts.js           first account of each role
//   k6 run -e ROLES=student test/specs/stress/setup-accounts.js     one role only
//
// Leaves behind: up to 15 Course Admins, 20 Course Instructors, 50 Students.
// ─────────────────────────────────────────────────────────────────────────────

export const options = {
    scenarios: {
        // 85 accounts one at a time, gently paced.
        setup: { executor: 'shared-iterations', vus: 1, iterations: 1, maxDuration: '90m' },
    },
    // Every account must come out ready and able to sign in.
    thresholds: { checks: ['rate==1'] },
}

export function handleSummary(data) {
    return allureSummary(data, {
        suite: 'Account setup',
        parameters: { Roles: __ENV.ROLES || 'all', Limit: __ENV.LIMIT || 'none' },
    })
}

// Environmental Sciences — same department as the suite's STUDENT_USER.
const STUDENT_DEPARTMENT_ID = 'c86f7942-bd2f-4c8c-a163-60313e84029c'

const ROLES = {
    courseadmin: {
        label: 'Course Admin',
        page: `${BASE}/scola-elearning/managers`,
        createUrl: `${API}/managers`,
        lastName: 'CourseAdmin',
        phoneDigit: '1',
        // Reset-password links on these cards hold the manager id, not the user id.
        userId: (id, page) => staffUserId(`${API}/managers/${id}`, page),
        // Staff search doesn't match a full email, but does match the last name;
        // staff cards show the email.
        search: (a) => `CourseAdmin${pad(a.n)}`,
        cardText: (a) => a.email,
    },
    courseinstructor: {
        label: 'Course Instructor',
        page: `${BASE}/scola-elearning/lecturers`,
        createUrl: `${API}/lecturers`,
        lastName: 'CourseInstructor',
        phoneDigit: '2',
        userId: (id, page) => staffUserId(`${API}/lecturers/${id}`, page),
        search: (a) => `CourseInstructor${pad(a.n)}`,
        cardText: (a) => a.email,
    },
    student: {
        label: 'Student',
        page: `${BASE}/scola-elearning/students`,
        createUrl: `${API}/students`,
        lastName: 'Student',
        phoneDigit: '3',
        // Student cards already carry the user account id.
        userId: (id) => id,
        // Student search matches the email, but the cards show the
        // matriculation number instead.
        search: (a) => a.email,
        cardText: (a) => `(LOADTEST${pad(a.n)})`,
    },
}

const pad = (n, len = 2) => String(n).padStart(len, '0')

// The server is sometimes slow or drops connections (status 0 = timeout or
// no connection). Repeats a read up to 4 times, waiting longer each time.
function retry(request) {
    let res
    for (let attempt = 1; attempt <= 4; attempt++) {
        res = request()
        if (res.status !== 0 && res.status < 500) return res
        console.warn(`  retrying after ${res.status || res.error} (attempt ${attempt})`)
        sleep(5 * attempt)
    }
    return res
}

function staffUserId(url, page) {
    const res = retry(() => http.get(url, { headers: apiHeaders(page), tags: { name: 'staff record' } }))
    const user = res.status === 200 && res.json('data.staff.user')
    return user ? user.id : null
}

// Everything the create/reset calls need from the role's screen: the CSRF
// token, organization id, list model and the dropdown choices.
function loadForm(role) {
    const res = retry(() => http.get(role.page, { tags: { name: 'admin form page' } }))
    if (res.status !== 200) fail(`Could not open ${role.page} (${res.status || res.error})`)
    if (res.url.endsWith('/login')) fail(`Signed out while opening ${role.page}`)
    const doc = parseHTML(res.body)
    const org = res.body.match(/formData\.append\('organization_id', '([^']+)'\)/)
    if (!org || !listModel(res.body)) fail(`${role.page} loaded without its form script`)
    const departments = optionValues(doc, '#department_id')
    return {
        token: doc.find('input[name="_token"]').attr('value'),
        organizationId: org && org[1],
        model: listModel(res.body),
        department: departments.includes(STUDENT_DEPARTMENT_ID) ? STUDENT_DEPARTMENT_ID : departments[0],
        level: optionValues(doc, '#level_id')[0],
        admissionYear: optionValues(doc, '#admission_year')[0],
    }
}

// Searches the role's list for the account; returns the id on its card's
// Reset Password link, or null if the account isn't there. Stops the run if
// the search itself keeps failing, so "can't tell" is never read as "not there".
function find(role, form, account) {
    const term = role.search(account)
    const res = retry(() => listCards(role.page, form.model, { search: term, name: 'admin search' }))
    if (res.status !== 200) fail(`Search for ${term} failed (${res.status || res.error})`)
    const key = role.cardText(account).toLowerCase()
    const cards = parseHTML(res.json('cards_html') || '').find('.card').toArray()
        .filter((c) => c.text().toLowerCase().includes(key))
    if (cards.length > 1) fail(`Search for ${term} found ${cards.length} cards showing "${key}"`)
    return cards.length ? cards[0].find('.btn-edit-modify-user-password-reset-modal').attr('data-val') || null : null
}

// A new account can take a few seconds to show up in the list search.
function findAfterCreate(role, form, account) {
    for (let attempt = 0; attempt < 5; attempt++) {
        sleep(2)
        const id = find(role, form, account)
        if (id) return id
    }
    return null
}

// Counts the account as a failed check, so the summary can't show 100%.
function notReady(email, why) {
    check(false, { 'account ready': (v) => !!v })
    console.error(`✗ ${email}${why ? ` — ${why}` : ''}`)
}

// Returns 'created', 'exists' (email already taken) or null on failure.
function create(roleKey, role, form, account) {
    const fields = {
        _token: form.token,
        _method: 'POST',
        organization_id: form.organizationId,
        department_id: form.department,
        first_name: 'LoadTest',
        last_name: `${role.lastName}${pad(account.n)}`,
        email: account.email,
        // 11 digits, unique per role and number.
        telephone: `080${role.phoneDigit}00000${pad(account.n)}`,
    }
    if (roleKey !== 'student') {
        // The staff form always sends these, empty or not; the server
        // answers 500 if they're missing.
        Object.assign(fields, {
            middle_name: '',
            gender: '',
            job_title: '',
            national_id_number: '',
            name_title: '',
        })
    } else {
        Object.assign(fields, {
            level_id: form.level,
            admission_year: form.admissionYear,
            matriculation_number: `LOADTEST${pad(account.n)}`,
            date_of_birth: '2000-01-01',
            address_street: '1 Test Street',
            address_town: 'Test Town',
            address_state: 'Test State',
        })
    }
    const res = http.post(role.createUrl, fields, {
        headers: { ...apiHeaders(role.page), 'X-CSRF-TOKEN': form.token },
        tags: { name: 'create account' },
    })
    let body = {}
    try { body = res.json() } catch (e) { /* non-JSON error page */ }
    if (body.errors && /already been taken/.test(JSON.stringify(body.errors.email || ''))) return 'exists'
    // Status 0 is a timeout: the account may or may not have been made.
    if (res.status < 200 || res.status >= 300 || body.errors) {
        console.error(`  create failed (${res.status || res.error}): ${JSON.stringify(body.errors || body.message || (res.body || '').slice(0, 200))}`)
        return null
    }
    return 'created'
}

function resetPassword(role, form, userId) {
    const res = http.post(`${API}/reset-password/${userId}`, {
        _token: form.token,
        _method: 'PUT',
        id: userId,
        organization_id: form.organizationId,
        password: PASSWORD,
    }, {
        headers: { ...apiHeaders(role.page), 'X-CSRF-TOKEN': form.token },
        tags: { name: 'reset password' },
    })
    let body = {}
    try { body = res.json() } catch (e) { /* non-JSON error page */ }
    if (res.status === 0) { console.error(`  password reset timed out (${res.error})`); return false }
    // Already holding this password counts as done (same as the WDIO reset tests).
    // The message can come back in `message` or under `errors`, so check the whole body.
    if (/must be different from (the )?old password/i.test(res.body || '')) return true
    if (res.status >= 300 || body.errors) {
        console.error(`  password reset failed (${res.status}): ${JSON.stringify(body.errors || body.message)}`)
        return false
    }
    return true
}

export default function () {
    if (!login(ADMIN.email, ADMIN.password)) fail('Admin login failed')

    const limit = Number(__ENV.LIMIT) || Infinity
    const only = __ENV.ROLES ? __ENV.ROLES.split(',') : Object.keys(ROLES)
    const ready = []

    for (const roleKey of only) {
        const role = ROLES[roleKey]
        if (!role) fail(`Unknown role "${roleKey}" — use ${Object.keys(ROLES).join(', ')}`)
        const form = loadForm(role)
        console.log(`── ${role.label}s`)

        for (const account of accounts(roleKey).slice(0, limit)) {
            let cardId = find(role, form, account)
            let existed = !!cardId
            if (!existed) {
                const result = create(roleKey, role, form, account)
                // A timed-out create may still have gone through; search before giving up.
                cardId = findAfterCreate(role, form, account)
                if (!cardId) {
                    notReady(account.email, result === 'exists'
                        ? 'email already taken, but no record found in the list'
                        : result ? 'created but not found by search' : '')
                    continue
                }
                existed = result === 'exists'
            }
            const userId = role.userId(cardId, role.page)
            const ok = userId && resetPassword(role, form, userId)
            check(ok, { 'account ready': (v) => !!v })
            if (ok) ready.push(account)
            console.log(`${ok ? '✓' : '✗'} ${account.email}${existed ? ' (already existed)' : ' (created)'}${userId ? '' : ' — no user id'}`)
            sleep(1)
        }
    }

    // Prove each new account can actually sign in, each in its own cookie jar
    // so the admin session above is left alone.
    console.log('── Sign-in check')
    let signedIn = 0
    for (const account of ready) {
        if (login(account.email, account.password, { jar: new http.CookieJar() })) signedIn++
        else console.error(`✗ cannot sign in: ${account.email}`)
        sleep(0.5)
    }
    console.log(`${signedIn}/${ready.length} accounts ready and able to sign in`)
}
