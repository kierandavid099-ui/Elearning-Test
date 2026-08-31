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
            await CourseAdminPage.resetPasswordLink.waitForDisplayed({ timeout: 5000 })
            await CourseAdminPage.resetPasswordLink.click()
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

        it('REG-ADM-015 | Confirming the reset closes the modal', async () => {
            addFeature('Course Administrator'); addSeverity('blocker')
            await CourseAdminPage.resetConfirmBtn.click()
            await CourseAdminPage.dismissSweetAlert()
            await expect(CourseAdminPage.resetConfirmBtn).not.toBeDisplayed()
        })
    })

    // ── Disable Administrator Modal ──────────────────────────────────────────

    describe('Disable Administrator Modal', () => {

        before(async () => {
            await CourseAdminPage.disableBtn.waitForDisplayed({ timeout: 5000 })
            await CourseAdminPage.disableBtn.click()
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
            await CourseAdminPage.disableConfirmBtn.click()
            await CourseAdminPage.dismissSweetAlert()
            await expect(CourseAdminPage.disableConfirmBtn).not.toBeDisplayed()
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
