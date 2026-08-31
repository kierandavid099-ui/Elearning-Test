export function randomString(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export function uniqueName(base) {
    return `${base}-${randomString(5)}`
}

export function randomDigits(length = 8) {
    let result = ''
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10)
    }
    return result
}

// Nigerian-style 11-digit mobile number — the telephone field on the
// create-new-staff form requires exactly 11 digits.
export function randomPhone() {
    return `0${randomDigits(10)}`
}

export function randomEmail(base = 'autotest') {
    return `${base}.${randomString(6)}@example.com`
}

// yyyy-mm-dd, suitable for <input type="date"> — daysAhead keeps it clear of
// any "must be in the past"/"must be in the future" validation either way.
export function futureDateString(daysAhead = 30) {
    const date = new Date()
    date.setDate(date.getDate() + daysAhead)
    return date.toISOString().slice(0, 10)
}
