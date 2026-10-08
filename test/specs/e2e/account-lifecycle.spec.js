import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import CourseAdminPage from '../../page objects/courseAdmin.page.js'
import { ADMIN_USER, DISABLE_REASON } from '../../helpers/testData.js'

// ─────────────────────────────────────────────────────────────────────────────
// E2E — Account lifecycle: create a brand-new Course Administrator, then take
// it through disable -> re-enable, verifying the row's own action button
// flips each time. Unlike regression/administrator.spec.js (which disables
// then re-enables an *existing* admin to avoid permanently deactivating a
// real account), this creates its own disposable account first so the
// disable/enable cycle never touches anyone else's access.
//
// Leaves behind: one new (enabled) Course Administrator account.
// ─────────────────────────────────────────────────────────────────────────────

describe('E2E — Account Lifecycle', () => {

    let admin

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await CourseAdminPage.open()
    })

    it('E2E-ACC-001 | A new Course Administrator can be created', async () => {
        addFeature('Account Lifecycle'); addSeverity('blocker')
        admin = await CourseAdminPage.createWithNewStaff()
        await expect(CourseAdminPage.newBtn).toBeDisplayed()
    })

    it('E2E-ACC-002 | The new administrator is listed with a Disable action available', async () => {
        addFeature('Account Lifecycle'); addSeverity('critical')
        // Reload so the list shows the account saved in the previous step.
        await CourseAdminPage.open()
        const row = CourseAdminPage.row(admin.lastName)
        await expect(row).toBeDisplayed()
        await expect(row.$('a.btn-disable-user-account')).toBeDisplayed()
    })

    it('E2E-ACC-003 | Disabling the account swaps its action to Enable', async () => {
        addFeature('Account Lifecycle'); addSeverity('blocker')
        const row = CourseAdminPage.row(admin.lastName)
        const disableBtn = row.$('a.btn-disable-user-account')
        await CourseAdminPage.clickTrigger(disableBtn)

        await CourseAdminPage.disableReasonInput.waitForDisplayed({ timeout: 5000 })
        // The modal shows its fields before it has loaded which user it's
        // for; confirming too early is rejected (see personModal.page.js).
        await browser.pause(3000)
        await CourseAdminPage.disableReasonInput.setValue(DISABLE_REASON)
        await CourseAdminPage.disableConfirmBtn.waitForClickable({ timeout: 5000 })
        await CourseAdminPage.disableConfirmBtn.click()
        // Success may close the modal without any alert. If the site rejected
        // it, fail with its own message rather than "still displayed" below.
        const alerted = await CourseAdminPage.sweetAlert.waitForDisplayed({ timeout: 10000 }).catch(() => false)
        if (alerted && !(await CourseAdminPage.sweetAlertSuccessIcon.isDisplayed())) {
            throw new Error(`Disable was rejected: ${await CourseAdminPage.sweetAlert.getText()}`)
        }
        await CourseAdminPage.dismissSweetAlert()
        await CourseAdminPage.disableConfirmBtn.waitForDisplayed({ reverse: true, timeout: 10000 })

        await expect(CourseAdminPage.row(admin.lastName).$('a.btn-enable-user-account')).toBeDisplayed()
    })

    it('E2E-ACC-004 | Re-enabling the account swaps its action back to Disable', async () => {
        addFeature('Account Lifecycle'); addSeverity('blocker')
        // The disable modal can stay open after success and block the click.
        const stillOpen = !(await CourseAdminPage.openModal.waitForDisplayed({ reverse: true, timeout: 3000 }).catch(() => false))
        if (stillOpen) await CourseAdminPage.closeModal()

        const row = CourseAdminPage.row(admin.lastName)
        const enableBtn = row.$('a.btn-enable-user-account')
        await CourseAdminPage.clickTrigger(enableBtn)

        await CourseAdminPage.enableConfirmBtn.waitForDisplayed({ timeout: 5000 })
        // Same not-yet-loaded problem as the Disable modal above.
        await browser.pause(3000)
        await CourseAdminPage.enableConfirmBtn.click()
        const alerted = await CourseAdminPage.sweetAlert.waitForDisplayed({ timeout: 10000 }).catch(() => false)
        if (alerted && !(await CourseAdminPage.sweetAlertSuccessIcon.isDisplayed())) {
            throw new Error(`Enable was rejected: ${await CourseAdminPage.sweetAlert.getText()}`)
        }
        await CourseAdminPage.dismissSweetAlert()
        await CourseAdminPage.enableConfirmBtn.waitForDisplayed({ reverse: true, timeout: 10000 })

        await expect(CourseAdminPage.row(admin.lastName).$('a.btn-disable-user-account')).toBeDisplayed()
    })
})
