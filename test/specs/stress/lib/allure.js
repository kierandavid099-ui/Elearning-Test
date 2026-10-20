import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js'

// Turns a k6 end-of-run summary into Allure results, written to the same
// allure-results folder the WDIO suites use, so `allure generate` shows the
// stress runs alongside smoke/regression/e2e. Each threshold and each check
// becomes one test case; the full k6 summary is attached to every one.
const RESULTS_DIR = __ENV.ALLURE_RESULTS || 'allure-results'

const METRIC_NAMES = {
    http_req_duration: 'Response time',
    http_req_failed: 'Failed requests',
    checks: 'Checks passing',
}

const ROLE_NAMES = {
    admin: 'Admin',
    courseAdmin: 'Course Admin',
    courseInstructor: 'Course Instructor',
    student: 'Student',
}

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
}

// "http_req_duration{scenario:student}" -> { metric, role: 'Student' }
function splitMetric(key) {
    const m = key.match(/^([^{]+)(?:\{scenario:([^}]+)\})?$/)
    return { metric: m[1], role: m[2] ? (ROLE_NAMES[m[2]] || m[2]) : null }
}

// The measured value a threshold was judged on, e.g. "p(95)<3000" -> values['p(95)'].
function measured(metric, values, expr) {
    const stat = expr.split(/[<>=!]/)[0].trim()
    const v = values[stat]
    if (v === undefined) return 'no data'
    if (metric === 'http_req_duration') return `${stat} = ${Math.round(v)} ms`
    if (stat === 'rate') return `${(v * 100).toFixed(2)}%`
    return `${stat} = ${v}`
}

function allChecks(group) {
    return group.checks.concat(...group.groups.map(allChecks))
}

// suite: e.g. 'Load test'; parameters: shown on each case (VUs, duration…).
export function allureSummary(data, { suite, parameters = {} }) {
    const stop = Date.now()
    const start = stop - Math.round(data.state.testRunDurationMs)
    const files = { stdout: textSummary(data, { indent: ' ', enableColors: true }) }

    const attachment = `${uuid()}-attachment.txt`
    files[`${RESULTS_DIR}/${attachment}`] = textSummary(data, { indent: ' ', enableColors: false })

    const cases = []
    for (const [key, m] of Object.entries(data.metrics)) {
        for (const [expr, t] of Object.entries(m.thresholds || {})) {
            const { metric, role } = splitMetric(key)
            const value = measured(metric, m.values, expr)
            cases.push({
                name: `${role ? `${role} — ` : ''}${METRIC_NAMES[metric] || metric}: ${expr}`,
                subSuite: role || 'Overall',
                ok: t.ok,
                message: `${t.ok ? 'Met' : 'Missed'} — measured ${value} (target ${expr})`,
            })
        }
    }
    for (const c of allChecks(data.root_group)) {
        cases.push({
            name: `Check: ${c.name}`,
            subSuite: 'Checks',
            ok: c.fails === 0,
            message: `${c.passes} passed, ${c.fails} failed`,
        })
    }

    for (const c of cases) {
        const id = uuid()
        files[`${RESULTS_DIR}/${id}-result.json`] = JSON.stringify({
            uuid: id,
            historyId: `k6:${suite}:${c.name}`,
            testCaseId: `k6:${suite}:${c.name}`,
            name: c.name,
            fullName: `Stress / ${suite} / ${c.subSuite} / ${c.name}`,
            status: c.ok ? 'passed' : 'failed',
            statusDetails: { message: c.message },
            stage: 'finished',
            start,
            stop,
            labels: [
                { name: 'parentSuite', value: 'Stress' },
                { name: 'suite', value: suite },
                { name: 'subSuite', value: c.subSuite },
                { name: 'feature', value: `Stress — ${suite}` },
                { name: 'severity', value: 'critical' },
                { name: 'framework', value: 'k6' },
            ],
            parameters: Object.entries(parameters).map(([name, value]) => ({ name, value: String(value) })),
            attachments: [{ name: 'k6 summary', source: attachment, type: 'text/plain' }],
            steps: [],
        })
    }
    return files
}
