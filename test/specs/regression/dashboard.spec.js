import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import DashboardPage from '../../page objects/dashboard.page.js'
import { ADMIN_USER } from '../../helpers/testData.js'

describe('REGRESSION — eLearning Dashboard', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await DashboardPage.open()
    })

    describe('Page Load', () => {

        it('REG-DSH-001 | Dashboard loads with the correct title', async () => {
            addFeature('Dashboard'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/eLearning/i)
        })

        it('REG-DSH-002 | Breadcrumb shows eLearning', async () => {
            addFeature('Dashboard'); addSeverity('critical')
            await expect(DashboardPage.breadcrumb).toHaveText(/eLearning/i)
        })
    })

    describe('Stat Cards', () => {

        it('REG-DSH-003 | STUDENTS card shows a numeric count', async () => {
            addFeature('Dashboard'); addSeverity('critical')
            await expect(DashboardPage.studentsCount).toBeDisplayed()
            const value = await DashboardPage.studentsCount.getText()
            expect(Number.isNaN(Number(value.trim()))).toBe(false)
        })

        it('REG-DSH-004 | ONLINE CLASSES card shows a numeric count', async () => {
            addFeature('Dashboard'); addSeverity('critical')
            await expect(DashboardPage.onlineClassesCount).toBeDisplayed()
            const value = await DashboardPage.onlineClassesCount.getText()
            expect(Number.isNaN(Number(value.trim()))).toBe(false)
        })

        it('REG-DSH-005 | COURSE CATALOG card shows a numeric count', async () => {
            addFeature('Dashboard'); addSeverity('critical')
            await expect(DashboardPage.courseCatalogCount).toBeDisplayed()
            const value = await DashboardPage.courseCatalogCount.getText()
            expect(Number.isNaN(Number(value.trim()))).toBe(false)
        })
    })

    describe('Widgets', () => {

        it('REG-DSH-006 | Announcements widget is present', async () => {
            addFeature('Dashboard'); addSeverity('normal')
            await expect(DashboardPage.announcementsHeading).toBeDisplayed()
        })

        it('REG-DSH-007 | Classes widget is present', async () => {
            addFeature('Dashboard'); addSeverity('normal')
            await expect(DashboardPage.classesHeading).toBeDisplayed()
        })
    })

    describe('Quick-Create Actions', () => {

        // it('REG-DSH-009 | New Course Class action exists', async () => {
        //     addFeature('Dashboard'); addSeverity('normal')
        //     await expect(DashboardPage.newCourseClassBtn).toBeExisting()
        // })

        it('REG-DSH-010 | New Calendar Entry action exists', async () => {
            addFeature('Dashboard'); addSeverity('normal')
            await expect(DashboardPage.newCalendarEntryBtn).toBeExisting()
        })
    })
})
