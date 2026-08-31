export const ADMIN_USER = {
    email: process.env.SMOKE_ADMIN_EMAIL || 'Admin@nda.edu.ng',
    password: process.env.SMOKE_ADMIN_PASSWORD || 'password',
}

export const COURSE_ADMIN_USER = {
    email: process.env.SMOKE_COURSE_ADMIN_EMAIL || 'william.johnson@mail.ng',
    password: process.env.SMOKE_COURSE_ADMIN_PASSWORD || 'password',
}

export const COURSE_INSTRUCTOR_USER = {
    email: process.env.SMOKE_COURSE_INSTRUCTOR_EMAIL || 'zainab.usman@mail.ng',
    password: process.env.SMOKE_COURSE_INSTRUCTOR_PASSWORD || 'password',
}

export const STUDENT_USER = {
    email: process.env.SMOKE_STUDENT_EMAIL || 'liam.clark@mail.ng',
    password: process.env.SMOKE_STUDENT_PASSWORD || 'password',
}

// How the student's name renders in admin-facing lists (Enrollments, etc.).
export const STUDENT_FULL_NAME = 'Clark, Liam'

// Environmental Sciences — the department STUDENT_USER belongs to; selecting
// it in the Enroll In Class modal populates the Classes dropdown.
export const STUDENT_DEPARTMENT_ID = 'c86f7942-bd2f-4c8c-a163-60313e84029c'

// A class STUDENT_USER is already actively enrolled in — used to jump
// straight into the class workspace as a student.
export const STUDENT_ACTIVE_CLASS_ID = 'ed3b54e0-0656-4cf0-b21e-df1f2b10da85'

// Two classes used for the enroll -> Course Admin approve/decline round trip.
// Re-running once the student is already Active/Declined in these will hit
// the same already-exists limitation as LECTURER_STAFF_NAME above.
export const ENROLL_CLASS_TO_APPROVE = 'Giacomo Fletcher'
export const ENROLL_CLASS_TO_DECLINE = 'Glenna Fisher'

// A course class the instructor above is assigned to teach — used to jump
// straight into the class workspace instead of navigating via Assigned Classes.
export const INSTRUCTOR_CLASS_ID = 'aef3df5c-5963-43ad-bad8-28b010ce5bb5'

// Names must match an existing staff record the select2 picker can find.
export const MANAGER_STAFF_NAME = 'Helen'
export const LECTURER_STAFF_NAME = 'Cameron'

export const DISABLE_REASON = "I don't need a reason, dammit"
export const RESET_PASSWORD = 'Password'
