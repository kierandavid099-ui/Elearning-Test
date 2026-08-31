import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import Sidebar from '../../page objects/sidebar.js'
import { ADMIN_USER } from '../../helpers/testData.js'

// Every other regression spec jumps straight to a page's URL, so the sidebar
// nav tree itself — as Admin sees it — has never actually been click-tested
// beyond Administrators/Instructors/Assigned Classes/Archives. This walks the
// remaining entries and confirms each click lands on the right page.

describe('REGRESSION — Sidebar Navigation', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
    })

    it('REG-NAV-001 | Broadcasts nav item loads the Notifications page', async () => {
        addFeature('Sidebar Navigation'); addSeverity('normal')
        await Sidebar.goToBroadcasts()
        await expect(browser).toHaveTitle(/Notifications/i)
    })

    it('REG-NAV-002 | Manage Settings nav item loads the Settings page', async () => {
        addFeature('Sidebar Navigation'); addSeverity('normal')
        await Sidebar.goToSettings()
        await expect(browser).toHaveTitle(/Setting/i)
    })

    it('REG-NAV-003 | Website Content nav item loads the Website Content page', async () => {
        addFeature('Sidebar Navigation'); addSeverity('normal')
        await Sidebar.goToWebsiteContent()
        await expect(browser).toHaveTitle(/eLearning Website Content/i)
    })

    it('REG-NAV-004 | Calendar nav item loads the Calendar Management page', async () => {
        addFeature('Sidebar Navigation'); addSeverity('normal')
        await Sidebar.goToCalendar()
        await expect(browser).toHaveTitle(/Calendar Management/i)
    })

    it('REG-NAV-005 | Students nav item loads the Student page', async () => {
        addFeature('Sidebar Navigation'); addSeverity('normal')
        await Sidebar.goToStudents()
        await expect(browser).toHaveTitle(/Student/i)
    })

    it('REG-NAV-006 | Levels nav item loads the Level page', async () => {
        addFeature('Sidebar Navigation'); addSeverity('normal')
        await Sidebar.goToLevels()
        await expect(browser).toHaveTitle(/Level/i)
    })

    it('REG-NAV-007 | Courses nav item loads the Course page', async () => {
        addFeature('Sidebar Navigation'); addSeverity('normal')
        await Sidebar.goToCourses()
        await expect(browser).toHaveTitle(/Course/i)
    })

    it('REG-NAV-008 | Classes nav item loads the Class page', async () => {
        addFeature('Sidebar Navigation'); addSeverity('normal')
        await Sidebar.goToCourseClasses()
        await expect(browser).toHaveTitle(/Class/i)
    })

    it('REG-NAV-009 | Dashboard nav item loads the Dashboard page', async () => {
        addFeature('Sidebar Navigation'); addSeverity('normal')
        await Sidebar.goToDashboard()
        await expect(browser).toHaveTitle(/eLearning/i)
    })
})
