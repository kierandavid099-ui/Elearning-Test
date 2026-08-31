import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import EnrolledClassesPage from '../../page objects/enrolledClasses.page.js'
import EnrollmentsPage from '../../page objects/enrollments.page.js'
import {
    STUDENT_USER,
    STUDENT_FULL_NAME,
    STUDENT_DEPARTMENT_ID,
    COURSE_ADMIN_USER,
    ENROLL_CLASS_TO_APPROVE,
    ENROLL_CLASS_TO_DECLINE,
} from '../../helpers/testData.js'

// ─────────────────────────────────────────────────────────────────────────────
// E2E — Enrollment approval: the full cross-role loop the regression suite
// only inspects in isolated halves (student-enrollment.spec.js closes the
// modal instead of saving; course-admin-enrollments.spec.js only reads back
// the result of a manual pass done ahead of time). Here the Student actually
// submits a new enrollment, then the Course Admin approves it, and the
// result is verified back through the Course Admin's own Enrollments view.
//
// The target class is picked at runtime (excluding the two classes already
// used by the seeded ENROLL_CLASS_TO_APPROVE/DECLINE fixtures) so this can
// be re-run without hitting the "already enrolled" state those two are in.
// If every available class has already been consumed by earlier e2e runs,
// this will fail honestly at the enroll step rather than being reworked to
// force a pass — that's a real state-cleanup gap worth knowing about, not a
// test bug.
// ─────────────────────────────────────────────────────────────────────────────

describe('E2E — Enrollment Approval', () => {

    let targetClassName

    it('E2E-ENR-001 | Student can submit a new enrollment request', async () => {
        addFeature('Enrollment Approval'); addSeverity('blocker')

        await LoginPage.open()
        await LoginPage.login(STUDENT_USER.email, STUDENT_USER.password)
        await EnrolledClassesPage.open()
        await EnrolledClassesPage.openEnrollModal()
        await EnrolledClassesPage.selectDepartment(STUDENT_DEPARTMENT_ID)

        const options = await EnrolledClassesPage.classSelect.$$('option')
        const usedNames = [ENROLL_CLASS_TO_APPROVE, ENROLL_CLASS_TO_DECLINE]
        for (const option of options) {
            const value = await option.getAttribute('value')
            if (!value) continue
            const text = (await option.getText()).trim()
            if (!usedNames.includes(text)) {
                targetClassName = text
                break
            }
        }
        expect(targetClassName).toBeTruthy()

        await EnrolledClassesPage.classSelect.selectByVisibleText(targetClassName)
        await EnrolledClassesPage.enrollSaveBtn.click()
        await EnrolledClassesPage.enrollModal.waitForDisplayed({ reverse: true, timeout: 10000 })
    })

    it('E2E-ENR-002 | The new enrollment shows as Pending to the Course Admin', async () => {
        addFeature('Enrollment Approval'); addSeverity('critical')

        await LoginPage.open()
        await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
        await EnrollmentsPage.open()

        const status = await EnrollmentsPage.statusOf(STUDENT_FULL_NAME, targetClassName).getText()
        expect(status.trim()).toBe('Pending')
    })

    it('E2E-ENR-003 | Approving the enrollment flips its status to Active', async () => {
        addFeature('Enrollment Approval'); addSeverity('blocker')

        await EnrollmentsPage.approve(STUDENT_FULL_NAME, targetClassName)

        const status = await EnrollmentsPage.statusOf(STUDENT_FULL_NAME, targetClassName).getText()
        expect(status.trim()).toBe('Active')
    })
})
