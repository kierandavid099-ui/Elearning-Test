import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import SettingsPage from '../../page objects/settings.page.js'
import { ADMIN_USER } from '../../helpers/testData.js'

// Settings controls live site-wide content (landing page background, graphics,
// learning mechanism copy) — regression inspects every tab renders its own
// controls but never clicks Save, since there's no confirmed way to restore
// the prior values afterward.

describe('REGRESSION — Manage Settings', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await SettingsPage.open()
    })

    describe('Page Load', () => {

        it('REG-SET-001 | Settings page loads with the correct title', async () => {
            addFeature('Manage Settings'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Setting/i)
        })

        it('REG-SET-002 | Breadcrumb shows Setting', async () => {
            addFeature('Manage Settings'); addSeverity('critical')
            await expect(SettingsPage.breadcrumb).toHaveText(/Setting/i)
        })

        it('REG-SET-003 | All four settings tabs are present', async () => {
            addFeature('Manage Settings'); addSeverity('critical')
            await expect(SettingsPage.basicSettingsTab).toBeDisplayed()
            await expect(SettingsPage.landingPageBackgroundTab).toBeDisplayed()
            await expect(SettingsPage.landingPageGraphicsTab).toBeDisplayed()
            await expect(SettingsPage.learningMechanismTab).toBeDisplayed()
        })

        it('REG-SET-004 | Save button is present', async () => {
            addFeature('Manage Settings'); addSeverity('blocker')
            await expect(SettingsPage.saveBtn).toBeExisting()
        })
    })

    describe('Tab Switching', () => {

        it('REG-SET-005 | Landing Page Background tab activates on click', async () => {
            addFeature('Manage Settings'); addSeverity('normal')
            await SettingsPage.landingPageBackgroundTab.click()
            const tabClass = await SettingsPage.landingPageBackgroundTab.getAttribute('class')
            expect(tabClass).toContain('active')
        })

        it('REG-SET-006 | Landing Page Graphics tab activates on click', async () => {
            addFeature('Manage Settings'); addSeverity('normal')
            await SettingsPage.landingPageGraphicsTab.click()
            const tabClass = await SettingsPage.landingPageGraphicsTab.getAttribute('class')
            expect(tabClass).toContain('active')
        })

        it('REG-SET-007 | Learning Mechanism tab activates on click', async () => {
            addFeature('Manage Settings'); addSeverity('normal')
            await SettingsPage.learningMechanismTab.click()
            const tabClass = await SettingsPage.learningMechanismTab.getAttribute('class')
            expect(tabClass).toContain('active')
        })

        it('REG-SET-008 | Returning to Basic Settings tab activates it', async () => {
            addFeature('Manage Settings'); addSeverity('normal')
            await SettingsPage.basicSettingsTab.click()
            const tabClass = await SettingsPage.basicSettingsTab.getAttribute('class')
            expect(tabClass).toContain('active')
        })
    })
})
