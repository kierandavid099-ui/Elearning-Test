import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import DashboardPage from '../../page objects/dashboard.page.js'
import BroadcastsPage from '../../page objects/broadcasts.page.js'
import AnnouncementsPage from '../../page objects/announcements.page.js'
import CalendarEntriesPage from '../../page objects/calendarEntries.page.js'
import ArchivesPage from '../../page objects/archives.page.js'
import CourseInstructorPage from '../../page objects/courseInstructor.page.js'
import StudentsPage from '../../page objects/students.page.js'
import CoursesPage from '../../page objects/courses.page.js'
import CourseClassesPage from '../../page objects/courseClasses.page.js'
import CreditLoadsPage from '../../page objects/creditLoads.page.js'
import EnrollmentsPage from '../../page objects/enrollments.page.js'
import { COURSE_ADMIN_USER } from '../../helpers/testData.js'

// ─────────────────────────────────────────────────────────────────────────────
// SMOKE — nda.scola.ng eLearning critical path, as a Course Admin
//
// Same lean load-and-inspect pass as smoke/critical-path.spec.js, but signed
// in as a Course Admin (william.johnson@mail.ng) rather than the platform
// Admin — this role's eLearning sidebar exposes a different set of pages
// (Announcements, Calendar Entries, Archives, Courses, Classes, Credit Load,
// Enrollments) at different URLs than the Admin's. No mutations here.
// ─────────────────────────────────────────────────────────────────────────────

describe('SMOKE — eLearning Critical Path (Course Admin)', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
    })

    describe('Dashboard', () => {

        before(async () => await DashboardPage.open())

        it('SM-CA-DSH-001 | Dashboard loads with the correct title', async () => {
            addFeature('Course Admin Dashboard'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/eLearning/i)
        })

        it('SM-CA-DSH-002 | Breadcrumb shows eLearning', async () => {
            addFeature('Course Admin Dashboard'); addSeverity('normal')
            await expect(DashboardPage.breadcrumb).toHaveText(/eLearning/i)
        })
    })

    describe('Broadcasts', () => {

        before(async () => await BroadcastsPage.open())

        it('SM-CA-BRD-001 | Broadcasts page loads with the correct title', async () => {
            addFeature('Course Admin Broadcasts'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Notifications/i)
        })

        it('SM-CA-BRD-002 | Breadcrumb shows Notifications', async () => {
            addFeature('Course Admin Broadcasts'); addSeverity('normal')
            await expect(BroadcastsPage.breadcrumb).toHaveText(/Notifications/i)
        })
    })

    describe('Announcements', () => {

        before(async () => await AnnouncementsPage.open())

        it('SM-CA-ANN-001 | Announcements page loads with the correct title', async () => {
            addFeature('Course Admin Announcements'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Announcement/i)
        })

        it('SM-CA-ANN-002 | Breadcrumb shows Announcement', async () => {
            addFeature('Course Admin Announcements'); addSeverity('normal')
            await expect(AnnouncementsPage.breadcrumb).toHaveText(/Announcement/i)
        })

        it('SM-CA-ANN-003 | New Announcement button is present', async () => {
            addFeature('Course Admin Announcements'); addSeverity('critical')
            await expect(AnnouncementsPage.newBtn).toBeDisplayed()
        })
    })

    describe('Calendar', () => {

        before(async () => await CalendarEntriesPage.open())

        it('SM-CA-CALE-001 | Calendar page loads with the correct title', async () => {
            addFeature('Course Admin Calendar'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Calendar/i)
        })

        it('SM-CA-CALE-002 | Breadcrumb shows Calendar', async () => {
            addFeature('Course Admin Calendar'); addSeverity('normal')
            await expect(CalendarEntriesPage.breadcrumb).toHaveText(/Calendar/i)
        })

        it('SM-CA-CALE-003 | New Calendar Entry button is present', async () => {
            addFeature('Course Admin Calendar'); addSeverity('critical')
            await expect(CalendarEntriesPage.newBtn).toBeDisplayed()
        })
    })

    describe('Archives', () => {

        before(async () => await ArchivesPage.open())

        it('SM-CA-ARC-001 | Archives page loads with the correct title', async () => {
            addFeature('Course Admin Archives'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Dashboard/i)
        })

        it('SM-CA-ARC-002 | Class Archives heading is present', async () => {
            addFeature('Course Admin Archives'); addSeverity('normal')
            await expect(ArchivesPage.heading).toBeDisplayed()
        })
    })

    describe('Course Instructor', () => {

        before(async () => await CourseInstructorPage.open())

        it('SM-CA-INS-001 | Course Instructor page loads with the correct title', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Course Instructor/i)
        })

        it('SM-CA-INS-002 | Breadcrumb shows Course Instructor', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('normal')
            await expect(CourseInstructorPage.breadcrumb).toHaveText(/Course Instructor/i)
        })

        it('SM-CA-INS-003 | New Course Instructor button is present', async () => {
            addFeature('Course Admin Course Instructor'); addSeverity('critical')
            await expect(CourseInstructorPage.newBtn).toBeDisplayed()
        })
    })

    describe('Students', () => {

        before(async () => await StudentsPage.open())

        it('SM-CA-STU-001 | Students page loads with the correct title', async () => {
            addFeature('Course Admin Students'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Student/i)
        })

        it('SM-CA-STU-002 | Breadcrumb shows Student', async () => {
            addFeature('Course Admin Students'); addSeverity('normal')
            await expect(StudentsPage.breadcrumb).toHaveText(/Student/i)
        })

        it('SM-CA-STU-003 | New Student button is present', async () => {
            addFeature('Course Admin Students'); addSeverity('critical')
            await expect(StudentsPage.newStudentBtn).toBeExisting()
        })
    })

    describe('Courses', () => {

        before(async () => await CoursesPage.open())

        it('SM-CA-CRS-001 | Courses page loads with the correct title', async () => {
            addFeature('Course Admin Courses'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Course/i)
        })

        it('SM-CA-CRS-002 | Breadcrumb shows Course', async () => {
            addFeature('Course Admin Courses'); addSeverity('normal')
            await expect(CoursesPage.breadcrumb).toHaveText(/Course/i)
        })

        it('SM-CA-CRS-003 | New Course button is present', async () => {
            addFeature('Course Admin Courses'); addSeverity('critical')
            await expect(CoursesPage.newBtn).toBeDisplayed()
        })
    })

    describe('Classes', () => {

        before(async () => await CourseClassesPage.open())

        it('SM-CA-CCL-001 | Classes page loads with the correct title', async () => {
            addFeature('Course Admin Classes'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Class/i)
        })

        it('SM-CA-CCL-002 | Breadcrumb shows Class', async () => {
            addFeature('Course Admin Classes'); addSeverity('normal')
            await expect(CourseClassesPage.breadcrumb).toHaveText(/Class/i)
        })

        it('SM-CA-CCL-003 | New Class button is present', async () => {
            addFeature('Course Admin Classes'); addSeverity('critical')
            await expect(CourseClassesPage.newBtn).toBeDisplayed()
        })
    })

    describe('Credit Load', () => {

        before(async () => await CreditLoadsPage.open())

        it('SM-CA-CRL-001 | Credit Load page loads with the correct title', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Credit Load/i)
        })

        it('SM-CA-CRL-002 | Breadcrumb shows Credit Load', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('normal')
            await expect(CreditLoadsPage.breadcrumb).toHaveText(/Credit Load/i)
        })

        it('SM-CA-CRL-003 | New Credit Load button is present', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('critical')
            await expect(CreditLoadsPage.newBtn).toBeDisplayed()
        })
    })

    describe('Enrollments', () => {

        before(async () => await EnrollmentsPage.open())

        it('SM-CA-ENR-001 | Enrollments page loads with the correct title', async () => {
            addFeature('Course Admin Enrollments'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Enrollment/i)
        })

        it('SM-CA-ENR-002 | Breadcrumb shows Enrollment', async () => {
            addFeature('Course Admin Enrollments'); addSeverity('normal')
            await expect(EnrollmentsPage.breadcrumb).toHaveText(/Enrollment/i)
        })

        it('SM-CA-ENR-003 | Status filters are present', async () => {
            addFeature('Course Admin Enrollments'); addSeverity('critical')
            await expect(EnrollmentsPage.allFilter).toBeDisplayed()
            await expect(EnrollmentsPage.pendingFilter).toBeDisplayed()
        })
    })
})
