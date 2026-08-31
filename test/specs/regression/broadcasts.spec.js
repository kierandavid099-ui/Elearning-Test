import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import BroadcastsPage from '../../page objects/broadcasts.page.js'
import { ADMIN_USER } from '../../helpers/testData.js'

describe('REGRESSION — Broadcasts', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await BroadcastsPage.open()
    })

    it('REG-BRD-001 | Broadcasts page loads with the correct title', async () => {
        addFeature('Broadcasts'); addSeverity('blocker')
        await expect(browser).toHaveTitle(/Notifications/i)
    })

    it('REG-BRD-002 | Breadcrumb shows Notifications', async () => {
        addFeature('Broadcasts'); addSeverity('critical')
        await expect(BroadcastsPage.breadcrumb).toHaveText(/Notifications/i)
    })

    it('REG-BRD-003 | Subtitle shows Calendar Notifications', async () => {
        addFeature('Broadcasts'); addSeverity('normal')
        await expect(BroadcastsPage.subtitle).toHaveText(/Calendar Notifications/i)
    })

    it('REG-BRD-004 | Notifications table is present', async () => {
        addFeature('Broadcasts'); addSeverity('critical')
        await expect(BroadcastsPage.notificationsTable).toBeExisting()
    })

    it('REG-BRD-005 | Notifications table has Subject, Broadcast to, Created on, Action columns', async () => {
        addFeature('Broadcasts'); addSeverity('critical')
        const headerEls = await BroadcastsPage.tableHeaders
        const headers = await headerEls.map(async (h) => (await h.getText()).trim())
        expect(headers).toEqual(['Subject', 'Broadcast to', 'Created on', 'Action'])
    })
})
