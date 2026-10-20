import http from 'k6/http'
import { check } from 'k6'
import { parseHTML } from 'k6/html'

export const BASE = 'https://nda.scola.ng'
export const API = `${BASE}/api/scola-elearning-api`

// The login form posts its CSRF token plus a hidden organization_id;
// leaving the latter out bounces you straight back to /login.
export function login(email, password, params = {}) {
    const page = http.get(`${BASE}/login`, { ...params, tags: { name: 'login page' } })
    const doc = parseHTML(page.body)
    const res = http.post(`${BASE}/login`, {
        _token: doc.find('input[name="_token"]').attr('value'),
        organization_id: doc.find('#organization_id').attr('value'),
        email,
        password,
    }, { ...params, tags: { name: 'login submit' } })
    // A good login lands on the dashboard; a bad one redirects back to /login.
    return check(res, { 'logged in': (r) => r.status === 200 && !r.url.endsWith('/login') })
}

export function signedOut(res) {
    return res.url.endsWith('/login')
}

// The JSON API only accepts session calls that look like they came from the
// page: XHR + Referer + the XSRF cookie echoed back as a header.
export function apiHeaders(referer, jar = http.cookieJar()) {
    const xsrf = (jar.cookiesForURL(BASE)['XSRF-TOKEN'] || [''])[0]
    return {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Referer: referer,
        Origin: BASE,
        'X-XSRF-TOKEN': decodeURIComponent(xsrf),
    }
}

// Each list screen loads its cards after the page itself, from the page's
// own URL plus ?query_model=<model> (read from the page's script).
export function listModel(html) {
    const m = html.match(/String\.raw`([^`]+)`/)
    return m ? m[1] : null
}

export function listCards(pageUrl, model, { search = '', jar, name } = {}) {
    let url = `${pageUrl}?query_model=${encodeURIComponent(model)}`
    if (search) url += `&st=${encodeURIComponent(search)}`
    const params = { headers: apiHeaders(pageUrl, jar), tags: { name: name || `${pageUrl.split('/').pop()} list` } }
    if (jar) params.jar = jar
    return http.get(url, params)
}

// Real (non-placeholder) <option> values of a <select>.
export function optionValues(doc, selector) {
    return doc.find(`${selector} option`).toArray()
        .map((o) => o.attr('value'))
        .filter((v) => v)
}
