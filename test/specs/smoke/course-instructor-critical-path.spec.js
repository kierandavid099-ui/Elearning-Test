import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import DashboardPage from '../../page objects/dashboard.page.js'
import AssignedClassesPage from '../../page objects/assignedClasses.page.js'
import ArchivesPage from '../../page objects/archives.page.js'
import CourseClassWorkspacePage from '../../page objects/courseClassWorkspace.page.js'
import { COURSE_INSTRUCTOR_USER, INSTRUCTOR_CLASS_ID } from '../../helpers/testData.js'

// ─────────────────────────────────────────────────────────────────────────────
// SMOKE — nda.scola.ng eLearning critical path, as a Course Instructor
//
// Same lean load-and-inspect pass as the Course Admin critical path, but
// signed in as a Course Instructor (zainab.usman@mail.ng). This role's
// eLearning sidebar is far smaller than Course Admin's — just Dashboard,
// Assigned Classes and Archives — with the real depth living inside each
// assigned class's workspace instead. No mutations here.
// ─────────────────────────────────────────────────────────────────────────────

describe('SMOKE — eLearning Critical Path (Course Instructor)', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(COURSE_INSTRUCTOR_USER.email, COURSE_INSTRUCTOR_USER.password)
    })

    describe('Dashboard', () => {

        before(async () => await DashboardPage.open())

        it('SM-CI-DSH-001 | Dashboard loads with the correct title', async () => {
            addFeature('Course Instructor Dashboard'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/eLearning/i)
        })

        it('SM-CI-DSH-002 | Breadcrumb shows eLearning', async () => {
            addFeature('Course Instructor Dashboard'); addSeverity('normal')
            await expect(DashboardPage.breadcrumb).toHaveText(/eLearning/i)
        })
    })

    describe('Assigned Classes', () => {

        before(async () => await AssignedClassesPage.open())

        it('SM-CI-IAC-001 | Assigned Classes page loads with the correct title', async () => {
            addFeature('Course Instructor Assigned Classes'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Class/i)
        })

        it('SM-CI-IAC-002 | Breadcrumb shows Class', async () => {
            addFeature('Course Instructor Assigned Classes'); addSeverity('normal')
            await expect(AssignedClassesPage.breadcrumb).toHaveText(/Class/i)
        })

        it('SM-CI-IAC-003 | At least one assigned class is listed', async () => {
            addFeature('Course Instructor Assigned Classes'); addSeverity('critical')
            await expect(AssignedClassesPage.firstViewLink).toBeDisplayed()
        })
    })

    describe('Archives', () => {

        before(async () => await ArchivesPage.open())

        it('SM-CI-ARC-001 | Archives page loads with the correct title', async () => {
            addFeature('Course Instructor Archives'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Dashboard/i)
        })

        it('SM-CI-ARC-002 | Class Archives heading is present', async () => {
            addFeature('Course Instructor Archives'); addSeverity('normal')
            await expect(ArchivesPage.heading).toBeDisplayed()
        })
    })

    describe('Class Workspace', () => {

        before(async () => {
            await CourseClassWorkspacePage.open(INSTRUCTOR_CLASS_ID)
            await CourseClassWorkspacePage.breadcrumb.waitForDisplayed({ timeout: 10000 })
        })

        it('SM-CI-ICW-001 | Edit Class action is present', async () => {
            addFeature('Course Instructor Class Workspace'); addSeverity('blocker')
            await expect(CourseClassWorkspacePage.editClassBtn).toBeDisplayed()
        })

        it('SM-CI-ICW-002 | Materials, Discussions and Grades tabs are present', async () => {
            addFeature('Course Instructor Class Workspace'); addSeverity('critical')
            await expect(CourseClassWorkspacePage.tab('#tab_materials')).toBeDisplayed()
            await expect(CourseClassWorkspacePage.tab('#tab_discussions')).toBeDisplayed()
            await expect(CourseClassWorkspacePage.tab('#tab_grades')).toBeDisplayed()
        })

        it('SM-CI-ICW-003 | Students tab lists the enrolled roster', async () => {
            addFeature('Course Instructor Class Workspace'); addSeverity('critical')
            await CourseClassWorkspacePage.openTab('#tab_student')
            expect(await CourseClassWorkspacePage.studentRows.length).toBeGreaterThan(0)
        })
    })
})
