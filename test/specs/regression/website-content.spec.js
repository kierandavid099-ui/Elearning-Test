import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import WebsiteContentPage from '../../page objects/websiteContent.page.js'
import { ADMIN_USER } from '../../helpers/testData.js'

// Website Content edits the live public-facing eLearning landing page —
// regression inspects both tabs and the page-builder's entry points but never
// saves or publishes, since there's no confirmed way to revert a live page.

describe('REGRESSION — Website Content', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await WebsiteContentPage.open()
    })

    describe('Page Load', () => {

        it('REG-WEB-001 | Website Content page loads with the correct title', async () => {
            addFeature('Website Content'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/eLearning Website Content/i)
        })

        it('REG-WEB-002 | Breadcrumb shows eLearning', async () => {
            addFeature('Website Content'); addSeverity('critical')
            await expect(WebsiteContentPage.breadcrumb).toHaveText(/eLearning/i)
        })

        it('REG-WEB-003 | Landing Page Content and Other Pages tabs are present', async () => {
            addFeature('Website Content'); addSeverity('critical')
            await expect(WebsiteContentPage.landingPageContentTab).toBeDisplayed()
            await expect(WebsiteContentPage.otherPagesTab).toBeDisplayed()
        })
    })

    describe('Tab Switching', () => {

        it('REG-WEB-004 | Other Pages tab activates on click', async () => {
            addFeature('Website Content'); addSeverity('normal')
            await WebsiteContentPage.otherPagesTab.click()
            const tabClass = await WebsiteContentPage.otherPagesTab.getAttribute('class')
            expect(tabClass).toContain('active')
        })

        it('REG-WEB-005 | Add New Pages entry point is present on the Other Pages tab', async () => {
            addFeature('Website Content'); addSeverity('critical')
            await expect(WebsiteContentPage.addNewPageLink).toBeExisting()
        })

        it('REG-WEB-006 | Returning to Landing Page Content tab activates it', async () => {
            addFeature('Website Content'); addSeverity('normal')
            await WebsiteContentPage.landingPageContentTab.click()
            const tabClass = await WebsiteContentPage.landingPageContentTab.getAttribute('class')
            expect(tabClass).toContain('active')
        })
    })
})
