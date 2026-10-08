import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import Sidebar from '../../page objects/sidebar.js'
import CourseInstructorPage from '../../page objects/courseInstructor.page.js'
import { ADMIN_USER, LECTURER_STAFF_NAME, DISABLE_REASON, RESET_PASSWORD } from '../../helpers/testData.js'
import { uniqueName } from '../../helpers/random.js'

describe('REGRESSION — Course Instructor', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await Sidebar.goToInstructors()
    })

    // ── New Instructor Modal ─────────────────────────────────────────────────

    describe('New Instructor Modal', () => {

        it('REG-INS-001 | New Instructor button is visible and enabled', async () => {
            addFeature('Course Instructor'); addSeverity('blocker')
            await expect(CourseInstructorPage.newBtn).toBeDisplayed()
            await expect(CourseInstructorPage.newBtn).not.toBeDisabled()
        })

        it('REG-INS-002 | Clicking New Instructor opens the create modal', async () => {
            addFeature('Course Instructor'); addSeverity('blocker')
            await CourseInstructorPage.openNewModal()
            await expect(CourseInstructorPage.modal).toBeDisplayed()
        })

        it('REG-INS-003 | Staff select field is displayed', async () => {
            addFeature('Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.staffSelectContainer).toBeDisplayed()
        })

        it('REG-INS-004 | Save button is present on the create modal', async () => {
             addFeature('Course Instructor'); addSeverity('critical')
             await expect(CourseInstructorPage.saveBtn).toBeDisplayed()
        })

        it('REG-INS-005 | Searching the staff picker surfaces a matching option', async () => {
            addFeature('Course Instructor'); addSeverity('critical')
            await CourseInstructorPage.staffSelectContainer.click()
            await CourseInstructorPage.staffSearchInput.setValue(LECTURER_STAFF_NAME)
            const option = CourseInstructorPage.staffOption(LECTURER_STAFF_NAME)
            await expect(option).toBeDisplayed()
            await option.click()
        })

        it('REG-INS-006 | Saving with a selected staff member closes the modal', async () => {
            addFeature('Course Instructor'); addSeverity('blocker')
            // Create a brand-new staff record with randomised details
            // instead of reusing the existing staff member REG-INS-005
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

        it('REG-INS-007 | Clicking edit opens the modal', async () => {
            addFeature('Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.modal).toBeDisplayed()
        })

        it('REG-INS-008 | Middle name field is displayed', async () => {
            addFeature('Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.middleNameInput).toBeDisplayed()
        })

        it('REG-INS-009 | Middle name field accepts a new value', async () => {
            addFeature('Course Instructor'); addSeverity('critical')
            const newMiddleName = uniqueName('Jesse')
            await CourseInstructorPage.setMiddleName(newMiddleName)
            await expect(CourseInstructorPage.middleNameInput).toHaveValue(newMiddleName)
        })

        it('REG-INS-010 | Saving the edit closes the modal', async () => {
            addFeature('Course Instructor'); addSeverity('blocker')
            await CourseInstructorPage.save()
            await expect(CourseInstructorPage.newBtn).toBeDisplayed()
        })
    })

    // ── View Instructor Modal ────────────────────────────────────────────────

    describe('View Instructor Modal', () => {

        before(async () => {
            await CourseInstructorPage.openViewModal()
        })

        it('REG-INS-011 | Clicking view opens the modal', async () => {
            addFeature('Course Instructor'); addSeverity('normal')
            await expect(CourseInstructorPage.openModal).toBeDisplayed()
        })

        it('REG-INS-012 | Closing the view modal dismisses it', async () => {
            addFeature('Course Instructor'); addSeverity('normal')
            await CourseInstructorPage.closeModal()
            await expect(CourseInstructorPage.openModal).not.toBeDisplayed()
        })
    })

    // ── Reset Password Modal ─────────────────────────────────────────────────

    describe('Reset Password Modal', () => {

        before(async () => {
            await CourseInstructorPage.openResetPasswordModal()
        })

        after(async () => {
            // Only a successful reset closes the modal by itself.
            if (await CourseInstructorPage.openModal.isDisplayed()) await CourseInstructorPage.closeModal()
        })

        it('REG-INS-013 | Reset password link opens the modal', async () => {
            addFeature('Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.newPasswordInput).toBeDisplayed()
        })

        it('REG-INS-014 | New password field accepts a value', async () => {
            addFeature('Course Instructor'); addSeverity('critical')
            await CourseInstructorPage.newPasswordInput.setValue(RESET_PASSWORD)
            await expect(CourseInstructorPage.newPasswordInput).toHaveValue(RESET_PASSWORD)
        })

        // Two outcomes count as a pass: the reset succeeds, or the site says
        // "must be different from old password" because the account already
        // holds RESET_PASSWORD from an earlier run. Both show the reset reached
        // the server. Anything else fails, including "User not found", which
        // means the modal hadn't finished loading (see openResetPasswordModal).
        it('REG-INS-015 | Clicking reset gets a response from the site', async () => {
            addFeature('Course Instructor'); addSeverity('blocker')
            await CourseInstructorPage.resetConfirmBtn.waitForClickable({ timeout: 5000 })
            await CourseInstructorPage.resetConfirmBtn.click()
            // Like Disable, a successful reset may just close the modal with
            // no alert, so the alert is optional. If one does appear, it has
            // to be one of the two outcomes above.
            const alerted = await CourseInstructorPage.sweetAlert.waitForDisplayed({ timeout: 10000 }).catch(() => false)
            if (alerted) {
                if (!(await CourseInstructorPage.sweetAlertSuccessIcon.isDisplayed())) {
                    await expect(CourseInstructorPage.sweetAlert).toHaveText(/must be different from old password/i)
                }
                await CourseInstructorPage.dismissSweetAlert()
            } else {
                await expect(CourseInstructorPage.resetConfirmBtn).not.toBeDisplayed({ wait: 10000 })
            }
        })
    })

    // ── Disable Instructor Modal ─────────────────────────────────────────────

    describe('Disable Instructor Modal', () => {

        before(async () => {
            await CourseInstructorPage.clickTrigger(CourseInstructorPage.disableBtn)
            // Like the reset modal, this one shows its fields before it has
            // loaded which user it's for; confirming too early is rejected.
            await CourseInstructorPage.disableReasonInput.waitForDisplayed({ timeout: 5000 })
            await browser.pause(3000)
        })

        it('REG-INS-016 | Disable action opens the reason modal', async () => {
            addFeature('Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.disableReasonInput).toBeDisplayed()
        })

        it('REG-INS-017 | Reason field accepts a value', async () => {
            addFeature('Course Instructor'); addSeverity('critical')
            await CourseInstructorPage.disableReasonInput.setValue(DISABLE_REASON)
            await expect(CourseInstructorPage.disableReasonInput).toHaveValue(DISABLE_REASON)
        })

        it('REG-INS-018 | Confirming disables the account and closes the modal', async () => {
            addFeature('Course Instructor'); addSeverity('blocker')
            await CourseInstructorPage.disableConfirmBtn.waitForClickable({ timeout: 5000 })
            await CourseInstructorPage.disableConfirmBtn.click()
            // Success may close the modal without any alert, so the alert is
            // optional. If the site rejected it, fail with its own message
            // rather than the vaguer "modal still displayed" below.
            const alerted = await CourseInstructorPage.sweetAlert.waitForDisplayed({ timeout: 10000 }).catch(() => false)
            if (alerted && !(await CourseInstructorPage.sweetAlertSuccessIcon.isDisplayed())) {
                throw new Error(`Disable was rejected: ${await CourseInstructorPage.sweetAlert.getText()}`)
            }
            await CourseInstructorPage.dismissSweetAlert()
            await expect(CourseInstructorPage.disableConfirmBtn).not.toBeDisplayed({ wait: 10000 })
        })
    })

    // ── Enable Instructor Modal ──────────────────────────────────────────────
    // Re-enables the account REG-INS-018 just disabled. Without this, every
    // regression run would permanently disable one more instructor account.

    describe('Enable Instructor Modal', () => {

        it('REG-INS-019 | Enable action is available on the account disabled above', async () => {
            addFeature('Course Instructor'); addSeverity('blocker')
            await expect(CourseInstructorPage.enableBtn).toBeDisplayed()
        })

        it('REG-INS-020 | Confirming re-enables the account', async () => {
            addFeature('Course Instructor'); addSeverity('blocker')
            await CourseInstructorPage.enable()
            await expect(CourseInstructorPage.enableConfirmBtn).not.toBeDisplayed()
        })
    })
})
