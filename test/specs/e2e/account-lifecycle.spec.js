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
        const row = CourseAdminPage.row(admin.lastName)
        await expect(row).toBeDisplayed()
        await expect(row.$('a.btn-disable-user-account')).toBeDisplayed()
    })

    it('E2E-ACC-003 | Disabling the account swaps its action to Enable', async () => {
        addFeature('Account Lifecycle'); addSeverity('blocker')
        const row = CourseAdminPage.row(admin.lastName)
        const disableBtn = row.$('a.btn-disable-user-account')
        await disableBtn.waitForDisplayed({ timeout: 5000 })
        await disableBtn.click()

        await CourseAdminPage.disableReasonInput.waitForDisplayed({ timeout: 5000 })
        await CourseAdminPage.disableReasonInput.setValue(DISABLE_REASON)
        await CourseAdminPage.disableConfirmBtn.click()
        await CourseAdminPage.dismissSweetAlert()
        await CourseAdminPage.disableConfirmBtn.waitForDisplayed({ reverse: true, timeout: 10000 })

        await expect(CourseAdminPage.row(admin.lastName).$('a.btn-enable-user-account')).toBeDisplayed()
    })

    it('E2E-ACC-004 | Re-enabling the account swaps its action back to Disable', async () => {
        addFeature('Account Lifecycle'); addSeverity('blocker')
        const row = CourseAdminPage.row(admin.lastName)
        const enableBtn = row.$('a.btn-enable-user-account')
        await enableBtn.waitForDisplayed({ timeout: 5000 })
        await enableBtn.click()

        await CourseAdminPage.enableConfirmBtn.waitForDisplayed({ timeout: 5000 })
        await CourseAdminPage.enableConfirmBtn.click()
        await CourseAdminPage.dismissSweetAlert()
        await CourseAdminPage.enableConfirmBtn.waitForDisplayed({ reverse: true, timeout: 10000 })

        await expect(CourseAdminPage.row(admin.lastName).$('a.btn-disable-user-account')).toBeDisplayed()
    })
})
