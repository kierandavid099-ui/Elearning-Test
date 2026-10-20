// Load-test accounts. Every one shares the same password; the single admin
// is the real one used to create all the others.
export const PASSWORD = __ENV.LOAD_PASSWORD || 'password'

export const ADMIN = {
    email: __ENV.LOAD_ADMIN_EMAIL || 'Admin@nda.edu.ng',
    password: __ENV.LOAD_ADMIN_PASSWORD || 'password',
}

export const COUNTS = { courseadmin: 15, courseinstructor: 20, student: 50 }

const pad = (n) => String(n).padStart(2, '0')

// loadtest.student01@mail.ng ... loadtest.student50@mail.ng, etc.
export function accounts(role) {
    return Array.from({ length: COUNTS[role] }, (_, i) => ({
        n: i + 1,
        email: `loadtest.${role}${pad(i + 1)}@mail.ng`,
        password: PASSWORD,
    }))
}
