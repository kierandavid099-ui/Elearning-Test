import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import EnrolledClassesPage from '../../page objects/enrolledClasses.page.js'
import EnrollmentsPage from '../../page objects/enrollments.page.js'
import CourseClassesPage from '../../page objects/courseClasses.page.js'
import { uniqueName } from '../../helpers/random.js'
import {
    STUDENT_USER,
    STUDENT_FULL_NAME,
    STUDENT_DEPARTMENT_ID,
    COURSE_ADMIN_USER,
} from '../../helpers/testData.js'

// ─────────────────────────────────────────────────────────────────────────────
// E2E — Enrollment approval: the full cross-role loop the regression suite
// only inspects in isolated halves (student-enrollment.spec.js closes the
// modal instead of saving; course-admin-enrollments.spec.js only reads back
// the result of a manual pass done ahead of time). Here the Student actually
// submits a new enrollment, then the Course Admin approves it, and the
// result is verified back through the Course Admin's own Enrollments view.
//
// Every class already in STUDENT_DEPARTMENT_ID eventually becomes "already
// enrolled" for STUDENT_USER across repeated e2e runs, so picking from the
// existing list (as earlier versions of this spec did) runs out of room and
// fails at the enroll step with a server-side "already enrolled" error. To
// keep this re-runnable indefinitely, the Course Admin creates a brand-new
// class in that department first — guaranteeing a never-before-seen option
// is always available for the Student to enroll into.
// ─────────────────────────────────────────────────────────────────────────────

// Course Admin creates a fresh class in the Student's department, then the
// Student submits an enrollment request for it. Ends signed in as the Student.
async function createClassAndEnrollStudent(namePrefix) {
    const className = uniqueName(namePrefix)

    await LoginPage.open()
    await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
    await CourseClassesPage.open()
    await CourseClassesPage.create({
        code: uniqueName('EAC'),
        name: className,
        departmentId: STUDENT_DEPARTMENT_ID,
    })
    await LoginPage.logout()

    await LoginPage.open()
    await LoginPage.login(STUDENT_USER.email, STUDENT_USER.password)
    await EnrolledClassesPage.open()
    await EnrolledClassesPage.openEnrollModal()
    await EnrolledClassesPage.selectDepartment(STUDENT_DEPARTMENT_ID)

    await EnrolledClassesPage.classSelect.selectByVisibleText(className)
    await EnrolledClassesPage.enrollSaveBtn.click()
    await EnrolledClassesPage.enrollModal.waitForDisplayed({ reverse: true, timeout: 10000 })

    return className
}

describe('E2E — Enrollment Approval', () => {

    let targetClassName

    it('E2E-ENR-001 | Student can submit a new enrollment request', async () => {
        addFeature('Enrollment Approval'); addSeverity('blocker')

        targetClassName = await createClassAndEnrollStudent('Enrollment Approval Class')
    })

    it('E2E-ENR-002 | The new enrollment shows as Pending to the Course Admin', async () => {
        addFeature('Enrollment Approval'); addSeverity('critical')

        await LoginPage.logout()
        await LoginPage.open()
        await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
        await EnrollmentsPage.open()

        await EnrollmentsPage.findRow(STUDENT_FULL_NAME, targetClassName)
        const status = await EnrollmentsPage.statusOf(STUDENT_FULL_NAME, targetClassName).getText()
        expect(status.trim()).toBe('Pending')
    })

    it('E2E-ENR-003 | Approving the enrollment flips its status to Active', async () => {
        addFeature('Enrollment Approval'); addSeverity('blocker')

        await EnrollmentsPage.approve(STUDENT_FULL_NAME, targetClassName)

        await EnrollmentsPage.findRow(STUDENT_FULL_NAME, targetClassName)
        const status = await EnrollmentsPage.statusOf(STUDENT_FULL_NAME, targetClassName).getText()
        expect(status.trim()).toBe('Active')
    })

    // Approve and decline share confirmSweetAlert(), but only an end-to-end
    // decline proves the decline AJAX call itself persists. It needs its own
    // Pending enrollment, since ENR-003 already moved the first one to Active.
    it('E2E-ENR-004 | Declining a new enrollment flips its status to Declined', async () => {
        addFeature('Enrollment Approval'); addSeverity('critical')

        await LoginPage.logout()
        const declineClassName = await createClassAndEnrollStudent('Enrollment Decline Class')
        await LoginPage.logout()

        await LoginPage.open()
        await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
        await EnrollmentsPage.open()

        await EnrollmentsPage.findRow(STUDENT_FULL_NAME, declineClassName)
        const before = await EnrollmentsPage.statusOf(STUDENT_FULL_NAME, declineClassName).getText()
        expect(before.trim()).toBe('Pending')

        await EnrollmentsPage.decline(STUDENT_FULL_NAME, declineClassName)

        await EnrollmentsPage.findRow(STUDENT_FULL_NAME, declineClassName)
        const status = await EnrollmentsPage.statusOf(STUDENT_FULL_NAME, declineClassName).getText()
        expect(status.trim()).toBe('Declined')
    })
})
