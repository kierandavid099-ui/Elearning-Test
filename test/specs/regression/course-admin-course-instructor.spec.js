import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import CourseInstructorPage from '../../page objects/courseInstructor.page.js'
import { COURSE_ADMIN_USER, LECTURER_STAFF_NAME, DISABLE_REASON, RESET_PASSWORD } from '../../helpers/testData.js'
import { uniqueName } from '../../helpers/random.js'

// Mirrors regression/instructor.spec.js, but as a Course Admin rather than
// platform Admin — Course Instructor is in the Course Admin's own eLearning
// sidebar, and PersonModalPage gives it the same New/Edit/View/Reset
// Password/Disable flows the Admin's copy exercises.

describe('REGRESSION (Course Admin) — Course Instructor', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
        await CourseInstructorPage.open()
    })

    // ── New Instructor Modal ─────────────────────────────────────────────────

    describe('New Instructor Modal', () => {

        it('REG-CA-INS-001 | New Instructor button is visible and enabled', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('blocker')
            await expect(CourseInstructorPage.newBtn).toBeDisplayed()
            await expect(CourseInstructorPage.newBtn).not.toBeDisabled()
        })

        it('REG-CA-INS-002 | Clicking New Instructor opens the create modal', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('blocker')
            await CourseInstructorPage.openNewModal()
            await expect(CourseInstructorPage.modal).toBeDisplayed()
        })

        it('REG-CA-INS-003 | Staff select field is displayed', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.staffSelectContainer).toBeDisplayed()
        })

        it('REG-CA-INS-004 | Save button is present on the create modal', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.saveBtn).toBeDisplayed()
        })

        it('REG-CA-INS-005 | Searching the staff picker surfaces a matching option', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('critical')
            await CourseInstructorPage.staffSelectContainer.click()
            await CourseInstructorPage.staffSearchInput.setValue(LECTURER_STAFF_NAME)
            const option = CourseInstructorPage.staffOption(LECTURER_STAFF_NAME)
            await expect(option).toBeDisplayed()
            await option.click()
        })

        it('REG-CA-INS-006 | Saving with a selected staff member closes the modal', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('blocker')
            // Create a brand-new staff record with randomised details
            // instead of reusing the existing staff member REG-CA-INS-005
            // picked — that one may already be an instructor from a prior
            // run, which stops the modal closing for an unrelated (and
            // misleading) reason.
            await CourseInstructorPage.createNewStaff()
            await CourseInstructorPage.save()
            await expect(CourseInstructorPage.newBtn).toBeDisplayed()
        })
    })

    // ── Edit Instructor Modal ────────────────────────────────────────────────

    describe('Edit Instructor Modal', () => {

        before(async () => {
            await CourseInstructorPage.openEditModal()
        })

        it('REG-CA-INS-007 | Clicking edit opens the modal', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.modal).toBeDisplayed()
        })

        it('REG-CA-INS-008 | Middle name field is displayed', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.middleNameInput).toBeDisplayed()
        })

        it('REG-CA-INS-009 | Middle name field accepts a new value', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('critical')
            const newMiddleName = uniqueName('Jesse')
            await CourseInstructorPage.setMiddleName(newMiddleName)
            await expect(CourseInstructorPage.middleNameInput).toHaveValue(newMiddleName)
        })

        it('REG-CA-INS-010 | Saving the edit closes the modal', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('blocker')
            await CourseInstructorPage.save()
            await expect(CourseInstructorPage.newBtn).toBeDisplayed()
        })
    })

    // ── View Instructor Modal ────────────────────────────────────────────────

    describe('View Instructor Modal', () => {

        before(async () => {
            await CourseInstructorPage.openViewModal()
        })

        it('REG-CA-INS-011 | Clicking view opens the modal', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('normal')
            await expect(CourseInstructorPage.openModal).toBeDisplayed()
        })

        it('REG-CA-INS-012 | Closing the view modal dismisses it', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('normal')
            await CourseInstructorPage.closeModal()
            await expect(CourseInstructorPage.openModal).not.toBeDisplayed()
        })
    })

    // ── Reset Password Modal ─────────────────────────────────────────────────
    // Known bug in the site's password-reset flow (see project memory) — this
    // is expected to fail. Reporting the real result rather than skipping it.

    describe('Reset Password Modal', () => {

        before(async () => {
            await CourseInstructorPage.resetPasswordLink.waitForDisplayed({ timeout: 5000 })
            await CourseInstructorPage.resetPasswordLink.click()
        })

        it('REG-CA-INS-013 | Reset password link opens the modal', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.newPasswordInput).toBeDisplayed()
        })

        it('REG-CA-INS-014 | New password field accepts a value', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('critical')
            await CourseInstructorPage.newPasswordInput.setValue(RESET_PASSWORD)
            await expect(CourseInstructorPage.newPasswordInput).toHaveValue(RESET_PASSWORD)
        })

        it('REG-CA-INS-015 | Confirming the reset closes the modal', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('blocker')
            await CourseInstructorPage.resetConfirmBtn.click()
            await CourseInstructorPage.dismissSweetAlert()
            await expect(CourseInstructorPage.resetConfirmBtn).not.toBeDisplayed()
        })
    })

    // ── Disable Instructor Modal ─────────────────────────────────────────────

    describe('Disable Instructor Modal', () => {

        before(async () => {
            await CourseInstructorPage.disableBtn.waitForDisplayed({ timeout: 5000 })
            await CourseInstructorPage.disableBtn.click()
        })

        it('REG-CA-INS-016 | Disable action opens the reason modal', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.disableReasonInput).toBeDisplayed()
        })

        it('REG-CA-INS-017 | Reason field accepts a value', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('critical')
            await CourseInstructorPage.disableReasonInput.setValue(DISABLE_REASON)
            await expect(CourseInstructorPage.disableReasonInput).toHaveValue(DISABLE_REASON)
        })

        it('REG-CA-INS-018 | Confirming disables the account and closes the modal', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('blocker')
            await CourseInstructorPage.disableConfirmBtn.click()
            await CourseInstructorPage.dismissSweetAlert()
            await expect(CourseInstructorPage.disableConfirmBtn).not.toBeDisplayed()
        })
    })
})
