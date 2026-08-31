import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import EnrolledClassesPage from '../../page objects/enrolledClasses.page.js'
import { STUDENT_USER, STUDENT_DEPARTMENT_ID, ENROLL_CLASS_TO_APPROVE } from '../../helpers/testData.js'

// Doesn't click Save — the student is already Active/Declined in the seeded
// classes from the earlier manual enroll/approve/decline pass, so re-saving
// here would hit the same already-exists limitation as LECTURER_STAFF_NAME
// in testData.js. This suite only exercises the modal up to selecting a
// class, then closes it.

describe('REGRESSION (Student) — Enroll In Class', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(STUDENT_USER.email, STUDENT_USER.password)
        await EnrolledClassesPage.open()
    })

    it('REG-STU-ENR-001 | Enroll In Class button is visible and enabled', async () => {
        addFeature('Student Enrollment'); addSeverity('blocker')
        await expect(EnrolledClassesPage.enrollBtn).toBeDisplayed()
        await expect(EnrolledClassesPage.enrollBtn).not.toBeDisabled()
    })

    describe('Enroll In Class Modal', () => {

        before(async () => {
            await EnrolledClassesPage.openEnrollModal()
        })

        it('REG-STU-ENR-002 | Clicking Enroll In Class opens the modal', async () => {
            addFeature('Student Enrollment'); addSeverity('blocker')
            await expect(EnrolledClassesPage.enrollModal).toBeDisplayed()
        })

        it('REG-STU-ENR-003 | Department select is displayed', async () => {
            addFeature('Student Enrollment'); addSeverity('critical')
            await expect(EnrolledClassesPage.departmentSelect).toBeDisplayed()
        })

        it('REG-STU-ENR-004 | Selecting a department populates the Classes dropdown', async () => {
            addFeature('Student Enrollment'); addSeverity('critical')
            await EnrolledClassesPage.selectDepartment(STUDENT_DEPARTMENT_ID)
            const options = await EnrolledClassesPage.classSelect.$$('option')
            expect(options.length).toBeGreaterThan(1)
        })

        it('REG-STU-ENR-005 | Save button is present on the enroll modal', async () => {
            addFeature('Student Enrollment'); addSeverity('critical')
            await expect(EnrolledClassesPage.enrollSaveBtn).toBeDisplayed()
        })

        it('REG-STU-ENR-006 | Selecting a class does not error', async () => {
            addFeature('Student Enrollment'); addSeverity('critical')
            await EnrolledClassesPage.classSelect.selectByVisibleText(ENROLL_CLASS_TO_APPROVE)
            await expect(EnrolledClassesPage.enrollErrorDiv).not.toBeDisplayed()
        })

        it('REG-STU-ENR-007 | Closing without saving dismisses the modal', async () => {
            addFeature('Student Enrollment'); addSeverity('blocker')
            await EnrolledClassesPage.closeModal()
            await expect(EnrolledClassesPage.openModal).not.toBeDisplayed()
        })
    })
})
