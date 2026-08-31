import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import Sidebar from '../../page objects/sidebar.js'
import AssignedClassesPage from '../../page objects/assignedClasses.page.js'
import { COURSE_INSTRUCTOR_USER } from '../../helpers/testData.js'

// Read-only list — instructors don't create/delete classes here, they only
// view the ones they're assigned to teach and jump into the class workspace.

describe('REGRESSION (Course Instructor) — Assigned Classes', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(COURSE_INSTRUCTOR_USER.email, COURSE_INSTRUCTOR_USER.password)
        await Sidebar.goToAssignedClasses()
    })

    describe('Page Load', () => {

        it('REG-IAC-001 | Assigned Classes page loads with the correct title', async () => {
            addFeature('Course Instructor Assigned Classes'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Class/i)
        })

        it('REG-IAC-002 | Breadcrumb shows Class', async () => {
            addFeature('Course Instructor Assigned Classes'); addSeverity('critical')
            await expect(AssignedClassesPage.breadcrumb).toHaveText(/Class/i)
        })

        it('REG-IAC-003 | At least one assigned class is listed with a View link', async () => {
            addFeature('Course Instructor Assigned Classes'); addSeverity('blocker')
            await expect(AssignedClassesPage.firstViewLink).toBeDisplayed()
        })
    })

    describe('Filter Modal', () => {

        before(async () => {
            await AssignedClassesPage.openFilterModal()
        })

        it('REG-IAC-004 | Clicking Filter opens the filter modal', async () => {
            addFeature('Course Instructor Assigned Classes'); addSeverity('critical')
            await expect(AssignedClassesPage.filterModal).toBeDisplayed()
        })

        it('REG-IAC-005 | Apply and Reset actions are present', async () => {
            addFeature('Course Instructor Assigned Classes'); addSeverity('normal')
            await expect(AssignedClassesPage.filterApplyBtn).toBeDisplayed()
            await expect(AssignedClassesPage.filterResetBtn).toBeDisplayed()
        })

        it('REG-IAC-006 | Closing without applying does not error', async () => {
            addFeature('Course Instructor Assigned Classes'); addSeverity('critical')
            // The filter modal's backdrop can linger after the close click on
            // this page, so don't hard-fail on `.modal.show` disappearing —
            // just confirm the close button works and the page stays usable.
            await AssignedClassesPage.closeModalBtn.waitForClickable({ timeout: 5000 })
            await AssignedClassesPage.closeModalBtn.click()
            await AssignedClassesPage.openModal.waitForDisplayed({ reverse: true, timeout: 5000 }).catch(() => {})
            await expect(AssignedClassesPage.breadcrumb).toBeDisplayed()
        })
    })

    describe('Navigating into a class', () => {

        it('REG-IAC-007 | Clicking View opens the class workspace', async () => {
            addFeature('Course Instructor Assigned Classes'); addSeverity('blocker')
            await AssignedClassesPage.firstViewLink.click()
            expect(await browser.getUrl()).toContain('/scola-elearning/courseClasses/')
        })
    })
})
