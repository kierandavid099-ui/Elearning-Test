import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import Sidebar from '../../page objects/sidebar.js'
import CourseAdminPage from '../../page objects/courseAdmin.page.js'
import { ADMIN_USER, MANAGER_STAFF_NAME, DISABLE_REASON, RESET_PASSWORD } from '../../helpers/testData.js'
import { uniqueName } from '../../helpers/random.js'

describe('REGRESSION — Course Administrator', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await Sidebar.goToAdministrators()
    })

    // ── New Administrator Modal ──────────────────────────────────────────────

    describe('New Administrator Modal', () => {

        it('REG-ADM-001 | New Administrator button is visible and enabled', async () => {
            addFeature('Course Administrator'); addSeverity('blocker')
            await expect(CourseAdminPage.newBtn).toBeDisplayed()
            await expect(CourseAdminPage.newBtn).not.toBeDisabled()
        })

        it('REG-ADM-002 | Clicking New Administrator opens the create modal', async () => {
            addFeature('Course Administrator'); addSeverity('blocker')
            await CourseAdminPage.openNewModal()
            await expect(CourseAdminPage.modal).toBeDisplayed()
        })

        it('REG-ADM-003 | Staff select field is displayed', async () => {
            addFeature('Course Administrator'); addSeverity('critical')
            await expect(CourseAdminPage.staffSelectContainer).toBeDisplayed()
        })

        it('REG-ADM-004 | Save button is present on the create modal', async () => {
            addFeature('Course Administrator'); addSeverity('critical')
            await expect(CourseAdminPage.saveBtn).toBeDisplayed()
        })

        it('REG-ADM-005 | Searching the staff picker surfaces a matching option', async () => {
            addFeature('Course Administrator'); addSeverity('critical')
            await CourseAdminPage.staffSelectContainer.click()
            await CourseAdminPage.staffSearchInput.setValue(MANAGER_STAFF_NAME)
            const option = CourseAdminPage.staffOption(MANAGER_STAFF_NAME)
            await expect(option).toBeDisplayed()
            await option.click()
        })

        it('REG-ADM-006 | Saving with a selected staff member closes the modal', async () => {
            addFeature('Course Administrator'); addSeverity('blocker')
            // Create a brand-new staff record with randomised details
            // instead of reusing the existing staff member REG-ADM-005
            // picked — that one may already be an administrator from a
            // prior run, which stops the modal closing for an unrelated
            // (and misleading) reason.
            await CourseAdminPage.createNewStaff()
            await CourseAdminPage.save()
            await expect(CourseAdminPage.newBtn).toBeDisplayed()
        })
    })

    // ── Edit Administrator Modal ─────────────────────────────────────────────

    describe('Edit Administrator Modal', () => {

        before(async () => {
            await CourseAdminPage.openEditModal()
        })

        it('REG-ADM-007 | Clicking edit opens the modal', async () => {
            addFeature('Course Administrator'); addSeverity('critical')
            await expect(CourseAdminPage.modal).toBeDisplayed()
        })

        it('REG-ADM-008 | Middle name field is displayed', async () => {
            addFeature('Course Administrator'); addSeverity('critical')
            await expect(CourseAdminPage.middleNameInput).toBeDisplayed()
        })

        it('REG-ADM-009 | Middle name field accepts a new value', async () => {
            addFeature('Course Administrator'); addSeverity('critical')
            const newMiddleName = uniqueName('Dave')
            await CourseAdminPage.setMiddleName(newMiddleName)
            await expect(CourseAdminPage.middleNameInput).toHaveValue(newMiddleName)
         })

        it('REG-ADM-010 | Saving the edit closes the modal', async () => {
            addFeature('Course Administrator'); addSeverity('blocker')
            await CourseAdminPage.save()
            await expect(CourseAdminPage.newBtn).toBeDisplayed()
        })
    })

    // ── View Administrator Modal ─────────────────────────────────────────────

    describe('View Administrator Modal', () => {

        before(async () => {
            await CourseAdminPage.openViewModal()
        })

        it('REG-ADM-011 | Clicking view opens the modal', async () => {
            addFeature('Course Administrator'); addSeverity('normal')
            await expect(CourseAdminPage.openModal).toBeDisplayed()
        })

        it('REG-ADM-012 | Closing the view modal dismisses it', async () => {
            addFeature('Course Administrator'); addSeverity('normal')
            await CourseAdminPage.closeModal()
            await expect(CourseAdminPage.openModal).not.toBeDisplayed()
        })
    })

    // ── Reset Password Modal ─────────────────────────────────────────────────

    describe('Reset Password Modal', () => {

        before(async () => {
            await CourseAdminPage.openResetPasswordModal()
        })

        after(async () => {
            // Only a successful reset closes the modal by itself.
            if (await CourseAdminPage.openModal.isDisplayed()) await CourseAdminPage.closeModal()
        })

        it('REG-ADM-013 | Reset password link opens the modal', async () => {
            addFeature('Course Administrator'); addSeverity('critical')
            await expect(CourseAdminPage.newPasswordInput).toBeDisplayed()
        })

        it('REG-ADM-014 | New password field accepts a value', async () => {
            addFeature('Course Administrator'); addSeverity('critical')
            await CourseAdminPage.newPasswordInput.setValue(RESET_PASSWORD)
            await expect(CourseAdminPage.newPasswordInput).toHaveValue(RESET_PASSWORD)
        })

        // Two outcomes count as a pass: the reset succeeds, or the site says
        // "must be different from old password" because the account already
        // holds RESET_PASSWORD from an earlier run. Both show the reset reached
        // the server. Anything else fails, including "User not found", which
        // means the modal hadn't finished loading (see openResetPasswordModal).
        it('REG-ADM-015 | Clicking reset gets a response from the site', async () => {
            addFeature('Course Administrator'); addSeverity('blocker')
            await CourseAdminPage.resetConfirmBtn.waitForClickable({ timeout: 5000 })
            await CourseAdminPage.resetConfirmBtn.click()
            // Like Disable, a successful reset may just close the modal with
            // no alert, so the alert is optional. If one does appear, it has
            // to be one of the two outcomes above.
            const alerted = await CourseAdminPage.sweetAlert.waitForDisplayed({ timeout: 10000 }).catch(() => false)
            if (alerted) {
                if (!(await CourseAdminPage.sweetAlertSuccessIcon.isDisplayed())) {
                    await expect(CourseAdminPage.sweetAlert).toHaveText(/must be different from old password/i)
                }
                await CourseAdminPage.dismissSweetAlert()
            } else {
                await expect(CourseAdminPage.resetConfirmBtn).not.toBeDisplayed({ wait: 10000 })
            }
        })
    })

    // ── Disable Administrator Modal ──────────────────────────────────────────

    describe('Disable Administrator Modal', () => {

        before(async () => {
            await CourseAdminPage.clickTrigger(CourseAdminPage.disableBtn)
            // Like the reset modal, this one shows its fields before it has
            // loaded which user it's for; confirming too early is rejected.
            await CourseAdminPage.disableReasonInput.waitForDisplayed({ timeout: 5000 })
            await browser.pause(3000)
        })

        it('REG-ADM-016 | Disable action opens the reason modal', async () => {
            addFeature('Course Administrator'); addSeverity('critical')
            await expect(CourseAdminPage.disableReasonInput).toBeDisplayed()
        })

        it('REG-ADM-017 | Reason field accepts a value', async () => {
            addFeature('Course Administrator'); addSeverity('critical')
            await CourseAdminPage.disableReasonInput.setValue(DISABLE_REASON)
            await expect(CourseAdminPage.disableReasonInput).toHaveValue(DISABLE_REASON)
        })

        it('REG-ADM-018 | Confirming disables the account and closes the modal', async () => {
            addFeature('Course Administrator'); addSeverity('blocker')
            await CourseAdminPage.disableConfirmBtn.waitForClickable({ timeout: 5000 })
            await CourseAdminPage.disableConfirmBtn.click()
            // Success may close the modal without any alert, so the alert is
            // optional. If the site rejected it, fail with its own message
            // rather than the vaguer "modal still displayed" below.
            const alerted = await CourseAdminPage.sweetAlert.waitForDisplayed({ timeout: 10000 }).catch(() => false)
            if (alerted && !(await CourseAdminPage.sweetAlertSuccessIcon.isDisplayed())) {
                throw new Error(`Disable was rejected: ${await CourseAdminPage.sweetAlert.getText()}`)
            }
            await CourseAdminPage.dismissSweetAlert()
            await expect(CourseAdminPage.disableConfirmBtn).not.toBeDisplayed({ wait: 10000 })
        })
    })

    // ── Enable Administrator Modal ───────────────────────────────────────────
    // Re-enables the account REG-ADM-018 just disabled. Without this, every
    // regression run would permanently disable one more administrator account.

    describe('Enable Administrator Modal', () => {

        it('REG-ADM-019 | Enable action is available on the account disabled above', async () => {
            addFeature('Course Administrator'); addSeverity('blocker')
            await expect(CourseAdminPage.enableBtn).toBeDisplayed()
        })

        it('REG-ADM-020 | Confirming re-enables the account', async () => {
            addFeature('Course Administrator'); addSeverity('blocker')
            await CourseAdminPage.enable()
            await expect(CourseAdminPage.enableConfirmBtn).not.toBeDisplayed()
        })
    })
})
