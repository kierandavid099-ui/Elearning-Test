import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import DashboardPage from '../../page objects/dashboard.page.js'
import BroadcastsPage from '../../page objects/broadcasts.page.js'
import SettingsPage from '../../page objects/settings.page.js'
import WebsiteContentPage from '../../page objects/websiteContent.page.js'
import CalendarPage from '../../page objects/calendar.page.js'
import CourseAdminPage from '../../page objects/courseAdmin.page.js'
import CourseInstructorPage from '../../page objects/courseInstructor.page.js'
import StudentsPage from '../../page objects/students.page.js'
import LevelsPage from '../../page objects/levels.page.js'
import { ADMIN_USER } from '../../helpers/testData.js'

// ─────────────────────────────────────────────────────────────────────────────
// SMOKE — nda.scola.ng eLearning critical path
//
// One lean pass through every Elearning module: does it load, with the right
// title and key elements present. No mutations (create/edit/disable/reset) —
// those live in test/specs/regression and test/specs/e2e.
// ─────────────────────────────────────────────────────────────────────────────

describe('SMOKE — eLearning Critical Path', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
    })

    describe('Dashboard', () => {

        before(async () => await DashboardPage.open())

        it('SM-DSH-001 | Dashboard loads with the correct title', async () => {
            addFeature('Dashboard'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/eLearning/i)
        })

        it('SM-DSH-002 | Breadcrumb shows eLearning', async () => {
            addFeature('Dashboard'); addSeverity('normal')
            await expect(DashboardPage.breadcrumb).toHaveText(/eLearning/i)
        })
    })

    describe('Broadcasts', () => {

        before(async () => await BroadcastsPage.open())

        it('SM-BRD-001 | Broadcasts page loads with the correct title', async () => {
            addFeature('Broadcasts'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Notifications/i)
        })

        it('SM-BRD-002 | Breadcrumb shows Notifications', async () => {
            addFeature('Broadcasts'); addSeverity('normal')
            await expect(BroadcastsPage.breadcrumb).toHaveText(/Notifications/i)
        })

        it('SM-BRD-003 | Notifications table is present', async () => {
            addFeature('Broadcasts'); addSeverity('critical')
            await expect(BroadcastsPage.notificationsTable).toBeExisting()
        })
    })

    describe('Manage Settings', () => {

        before(async () => await SettingsPage.open())

        it('SM-SET-001 | Settings page loads with the correct title', async () => {
            addFeature('Manage Settings'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Setting/i)
        })

        it('SM-SET-002 | Breadcrumb shows Setting', async () => {
            addFeature('Manage Settings'); addSeverity('normal')
            await expect(SettingsPage.breadcrumb).toHaveText(/Setting/i)
        })

        it('SM-SET-003 | Back to Dashboard link is present', async () => {
            addFeature('Manage Settings'); addSeverity('normal')
            await expect(SettingsPage.backToDashboardLink).toBeDisplayed()
        })
    })

    describe('Website Content', () => {

        before(async () => await WebsiteContentPage.open())

        it('SM-WEB-001 | Website Content page loads with the correct title', async () => {
            addFeature('Website Content'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/eLearning Website Content/i)
        })

        it('SM-WEB-002 | Breadcrumb shows eLearning', async () => {
            addFeature('Website Content'); addSeverity('normal')
            await expect(WebsiteContentPage.breadcrumb).toHaveText(/eLearning/i)
        })

        it('SM-WEB-003 | Back to Dashboard link is present', async () => {
            addFeature('Website Content'); addSeverity('normal')
            await expect(WebsiteContentPage.backToDashboardLink).toBeDisplayed()
        })
    })

    describe('Calendar', () => {

        before(async () => await CalendarPage.open())

        it('SM-CAL-001 | Calendar page loads with the correct title', async () => {
            addFeature('Calendar'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Calendar Management/i)
        })

        it('SM-CAL-002 | Breadcrumb shows Calendar', async () => {
            addFeature('Calendar'); addSeverity('normal')
            await expect(CalendarPage.breadcrumb).toHaveText(/Calendar/i)
        })

        it('SM-CAL-003 | New Calendar button is present', async () => {
            addFeature('Calendar'); addSeverity('critical')
            await expect(CalendarPage.newCalendarBtn).toBeExisting()
        })
    })

    describe('Course Administrator', () => {

        before(async () => await CourseAdminPage.open())

        it('SM-ADM-001 | Course Administrator page loads with the correct title', async () => {
            addFeature('Course Administrator'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Course Administrator/i)
        })

        it('SM-ADM-002 | Breadcrumb shows Course Administrator', async () => {
            addFeature('Course Administrator'); addSeverity('normal')
            await expect(CourseAdminPage.breadcrumb).toHaveText(/Course Administrator/i)
        })

        it('SM-ADM-003 | New Course Administrator button is present', async () => {
            addFeature('Course Administrator'); addSeverity('critical')
            await expect(CourseAdminPage.newBtn).toBeDisplayed()
        })
    })

    describe('Course Instructor', () => {

        before(async () => await CourseInstructorPage.open())

        it('SM-INS-001 | Course Instructor page loads with the correct title', async () => {
            addFeature('Course Instructor'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Course Instructor/i)
        })

        it('SM-INS-002 | Breadcrumb shows Course Instructor', async () => {
            addFeature('Course Instructor'); addSeverity('normal')
            await expect(CourseInstructorPage.breadcrumb).toHaveText(/Course Instructor/i)
        })

        it('SM-INS-003 | New Course Instructor button is present', async () => {
            addFeature('Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.newBtn).toBeDisplayed()
        })
    })

    describe('Students', () => {

        before(async () => await StudentsPage.open())

        it('SM-STU-001 | Students page loads with the correct title', async () => {
            addFeature('Students'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Student/i)
        })

        it('SM-STU-002 | Breadcrumb shows Student', async () => {
            addFeature('Students'); addSeverity('normal')
            await expect(StudentsPage.breadcrumb).toHaveText(/Student/i)
        })

        it('SM-STU-003 | New Student button is present', async () => {
            addFeature('Students'); addSeverity('critical')
            await expect(StudentsPage.newStudentBtn).toBeExisting()
        })
    })

    describe('Levels', () => {

        before(async () => await LevelsPage.open())

        it('SM-LVL-001 | Levels page loads with the correct title', async () => {
            addFeature('Levels'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Level/i)
        })

        it('SM-LVL-002 | Breadcrumb shows Level', async () => {
            addFeature('Levels'); addSeverity('normal')
            await expect(LevelsPage.breadcrumb).toHaveText(/Level/i)
        })

        it('SM-LVL-003 | New Level button is present', async () => {
            addFeature('Levels'); addSeverity('critical')
            await expect(LevelsPage.newLevelBtn).toBeExisting()
        })
    })
})
