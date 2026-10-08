import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import DashboardPage from '../../page objects/dashboard.page.js'
import EnrolledClassesPage from '../../page objects/enrolledClasses.page.js'
import ArchivesPage from '../../page objects/archives.page.js'
import CourseClassWorkspacePage from '../../page objects/courseClassWorkspace.page.js'
import ModulePage from '../../page objects/modulePage.page.js'
import { STUDENT_USER, STUDENT_ACTIVE_CLASS_ID } from '../../helpers/testData.js'

// ─────────────────────────────────────────────────────────────────────────────
// SMOKE — nda.scola.ng eLearning critical path, as a Student
//
// Same lean load-and-inspect pass as the Course Admin / Course Instructor
// critical paths, but signed in as a Student (liam.clark@mail.ng). This
// role's eLearning sidebar covers Dashboard, Enrolled Classes, Archives,
// a read-only Class Workspace and Help & FAQ. No mutations here.
// ─────────────────────────────────────────────────────────────────────────────

describe('SMOKE — eLearning Critical Path (Student)', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(STUDENT_USER.email, STUDENT_USER.password)
    })

    describe('Dashboard', () => {

        before(async () => await DashboardPage.open())

        it('SM-ST-DSH-001 | Dashboard loads with the correct title', async () => {
            addFeature('Student Dashboard'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/eLearning/i)
        })

        it('SM-ST-DSH-002 | Breadcrumb shows eLearning', async () => {
            addFeature('Student Dashboard'); addSeverity('normal')
            await expect(DashboardPage.breadcrumb).toHaveText(/eLearning/i)
        })

        it('SM-ST-DSH-003 | Enrolled Classes and Pending Enrollments cards are present', async () => {
            addFeature('Student Dashboard'); addSeverity('critical')
            await expect(DashboardPage.enrolledClassesCount).toBeDisplayed()
            await expect(DashboardPage.pendingEnrollmentsCount).toBeDisplayed()
        })
    })

    describe('Enrolled Classes', () => {

        before(async () => await EnrolledClassesPage.open())

        it('SM-ST-ENR-001 | Enrolled Classes page loads with the correct title', async () => {
            addFeature('Student Enrolled Classes'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Class/i)
        })

        it('SM-ST-ENR-002 | Breadcrumb shows Class', async () => {
            addFeature('Student Enrolled Classes'); addSeverity('normal')
            await expect(EnrolledClassesPage.breadcrumb).toHaveText(/Class/i)
        })

        it('SM-ST-ENR-003 | Enroll In Class button is present', async () => {
            addFeature('Student Enrolled Classes'); addSeverity('critical')
            await expect(EnrolledClassesPage.enrollBtn).toBeDisplayed()
        })
    })

    describe('Archives', () => {

        before(async () => await ArchivesPage.open())

        it('SM-ST-ARC-001 | Archives page loads with the correct title', async () => {
            addFeature('Student Archives'); addSeverity('blocker')
            // The Archives page doesn't set a page-specific <title> — it
            // renders the bare site title ("NDA Test -") unlike every other
            // page in this suite, confirmed live rather than assumed.
            await expect(browser).toHaveTitle(/NDA Test/i)
        })

        it('SM-ST-ARC-002 | Class Archives heading is present', async () => {
            addFeature('Student Archives'); addSeverity('normal')
            await expect(ArchivesPage.heading).toBeDisplayed()
        })
    })

    describe('Class Workspace (read-only)', () => {

        before(async () => {
            await CourseClassWorkspacePage.open(STUDENT_ACTIVE_CLASS_ID)
            await CourseClassWorkspacePage.breadcrumb.waitForDisplayed({ timeout: 10000 })
        })

        it('SM-ST-CLW-001 | Class Dates, Reading Materials, Outline and Announcements sections are present', async () => {
            addFeature('Student Class Workspace'); addSeverity('critical')
            await expect(CourseClassWorkspacePage.classDatesHeading).toBeDisplayed()
            await expect(CourseClassWorkspacePage.readingMaterialsHeading).toBeDisplayed()
            await expect(CourseClassWorkspacePage.outlineHeading).toBeDisplayed()
            await expect(CourseClassWorkspacePage.announcementsHeading).toBeDisplayed()
        })
    })

    describe('Help & FAQ', () => {

        const helpPage = new ModulePage('https://nda.scola.ng/scola-elearning/help')

        it('SM-ST-HLP-001 | Help page loads with the correct breadcrumb', async () => {
            addFeature('Student Help & FAQ'); addSeverity('normal')
            await helpPage.open()
            await expect(helpPage.breadcrumb).toHaveText(/FAQs and Help/i)
        })
    })
})
