import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import DashboardPage from '../../page objects/dashboard.page.js'
import ArchivesPage from '../../page objects/archives.page.js'
import CourseClassWorkspacePage from '../../page objects/courseClassWorkspace.page.js'
import ModulePage from '../../page objects/modulePage.page.js'
import { STUDENT_USER, STUDENT_ACTIVE_CLASS_ID } from '../../helpers/testData.js'

describe('REGRESSION (Student) — Other eLearning Features', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(STUDENT_USER.email, STUDENT_USER.password)
    })

    describe('Dashboard', () => {

        before(async () => await DashboardPage.open())

        it('REG-STU-DSH-001 | ENROLLED CLASSES card shows a numeric count', async () => {
            addFeature('Student Dashboard'); addSeverity('critical')
            await expect(DashboardPage.enrolledClassesCount).toBeDisplayed()
            const value = await DashboardPage.enrolledClassesCount.getText()
            expect(Number.isNaN(Number(value.trim()))).toBe(false)
        })

        it('REG-STU-DSH-002 | PENDING ENROLLMENTS card shows a numeric count', async () => {
            addFeature('Student Dashboard'); addSeverity('critical')
            await expect(DashboardPage.pendingEnrollmentsCount).toBeDisplayed()
            const value = await DashboardPage.pendingEnrollmentsCount.getText()
            expect(Number.isNaN(Number(value.trim()))).toBe(false)
        })
    })

    describe('Class Archives', () => {

        before(async () => await ArchivesPage.open())

        it('REG-STU-ARC-001 | Class Archives page loads', async () => {
            addFeature('Student Archives'); addSeverity('normal')
            await expect(ArchivesPage.heading).toBeDisplayed()
        })
    })

    describe('Class Workspace (read-only)', () => {

        before(async () => {
            await CourseClassWorkspacePage.open(STUDENT_ACTIVE_CLASS_ID)
            await CourseClassWorkspacePage.breadcrumb.waitForDisplayed({ timeout: 10000 })
        })

        it('REG-STU-CLW-001 | Class Dates section is visible', async () => {
            addFeature('Student Class Workspace'); addSeverity('normal')
            await expect(CourseClassWorkspacePage.classDatesHeading).toBeDisplayed()
        })

        it('REG-STU-CLW-002 | Reading Materials section is visible', async () => {
            addFeature('Student Class Workspace'); addSeverity('normal')
            await expect(CourseClassWorkspacePage.readingMaterialsHeading).toBeDisplayed()
        })

        it('REG-STU-CLW-003 | Outline section is visible', async () => {
            addFeature('Student Class Workspace'); addSeverity('normal')
            await expect(CourseClassWorkspacePage.outlineHeading).toBeDisplayed()
        })

        it('REG-STU-CLW-004 | Announcements section is visible', async () => {
            addFeature('Student Class Workspace'); addSeverity('normal')
            await expect(CourseClassWorkspacePage.announcementsHeading).toBeDisplayed()
        })
    })

    describe('Help & FAQ', () => {

        const helpPage = new ModulePage('https://nda.scola.ng/scola-elearning/help')
        const faqPage = new ModulePage('https://nda.scola.ng/scola-elearning/faq')

        it('REG-STU-HLP-001 | Help page loads', async () => {
            addFeature('Student Help & FAQ'); addSeverity('normal')
            await helpPage.open()
            await expect(helpPage.breadcrumb).toHaveText(/FAQs and Help/i)
        })

        it('REG-STU-HLP-002 | FAQ page loads', async () => {
            addFeature('Student Help & FAQ'); addSeverity('normal')
            await faqPage.open()
            await expect(faqPage.breadcrumb).toHaveText(/FAQs and Help/i)
        })
    })
})
