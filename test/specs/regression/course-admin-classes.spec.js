import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import CourseClassesPage from '../../page objects/courseClasses.page.js'
import { COURSE_ADMIN_USER } from '../../helpers/testData.js'

// A confirmed Delete action exists per row here (unlike Courses/Announcements/
// Calendar Entries), but deleting a real Class has knock-on effects on
// Archives/Enrollments data — regression only asserts it's present, it never
// clicks it. New/Edit modals are inspected and closed without saving.

describe('REGRESSION (Course Admin) — Classes', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
        await CourseClassesPage.open()
    })

    describe('Page Load', () => {

        it('REG-CCL-001 | Classes page loads with the correct title', async () => {
            addFeature('Course Admin Classes'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Class/i)
        })

        it('REG-CCL-002 | Breadcrumb shows Class', async () => {
            addFeature('Course Admin Classes'); addSeverity('critical')
            await expect(CourseClassesPage.breadcrumb).toHaveText(/Class/i)
        })

        it('REG-CCL-003 | New Class button is visible and enabled', async () => {
            addFeature('Course Admin Classes'); addSeverity('blocker')
            await expect(CourseClassesPage.newBtn).toBeDisplayed()
            await expect(CourseClassesPage.newBtn).not.toBeDisabled()
        })

        it('REG-CCL-004 | Delete action is present on an existing row', async () => {
            addFeature('Course Admin Classes'); addSeverity('normal')
            await expect(CourseClassesPage.deleteBtn).toBeDisplayed()
        })

        it('REG-CCL-017 | View action is present on an existing row', async () => {
            addFeature('Course Admin Classes'); addSeverity('normal')
            await expect(CourseClassesPage.viewBtn).toBeDisplayed()
        })
    })

    describe('New Class Modal', () => {

        before(async () => {
            await CourseClassesPage.openNewModal()
        })

        it('REG-CCL-005 | Clicking New Class opens the modal', async () => {
            addFeature('Course Admin Classes'); addSeverity('blocker')
            await expect(CourseClassesPage.modal).toBeDisplayed()
        })

        it('REG-CCL-006 | Error banner is hidden when modal first opens', async () => {
            addFeature('Course Admin Classes'); addSeverity('normal')
            await expect(CourseClassesPage.modalError).not.toBeDisplayed()
        })

        it('REG-CCL-007 | Code and Name fields are present and empty', async () => {
            addFeature('Course Admin Classes'); addSeverity('critical')
            await expect(CourseClassesPage.codeInput).toBeDisplayed()
            await expect(CourseClassesPage.nameInput).toBeDisplayed()
            expect(await CourseClassesPage.codeInput.getValue()).toBe('')
            expect(await CourseClassesPage.nameInput.getValue()).toBe('')
        })

        it('REG-CCL-008 | Credit Hours is a numeric field', async () => {
            addFeature('Course Admin Classes'); addSeverity('critical')
            await expect(CourseClassesPage.creditHoursInput).toBeDisplayed()
            expect(await CourseClassesPage.creditHoursInput.getAttribute('type')).toBe('number')
        })

        it('REG-CCL-009 | Status select is present', async () => {
            addFeature('Course Admin Classes'); addSeverity('critical')
            await expect(CourseClassesPage.statusSelect).toBeExisting()
        })

        it('REG-CCL-010 | Semester, Course and Lecturer selects are present', async () => {
            addFeature('Course Admin Classes'); addSeverity('critical')
            await expect(CourseClassesPage.semesterSelect).toBeExisting()
            await expect(CourseClassesPage.courseSelect).toBeExisting()
            await expect(CourseClassesPage.lecturerSelect).toBeExisting()
        })

        it('REG-CCL-011 | Next Exam Date is a date input', async () => {
            addFeature('Course Admin Classes'); addSeverity('normal')
            await expect(CourseClassesPage.nextExamDateInput).toBeDisplayed()
            expect(await CourseClassesPage.nextExamDateInput.getAttribute('type')).toBe('date')
        })

        it('REG-CCL-012 | Course Outline field is present', async () => {
            addFeature('Course Admin Classes'); addSeverity('normal')
            await CourseClassesPage.openOutlineTab()
            await expect(CourseClassesPage.courseOutlineInput).toBeDisplayed()
        })

        it('REG-CCL-013 | Save button is present', async () => {
            addFeature('Course Admin Classes'); addSeverity('blocker')
            await expect(CourseClassesPage.saveBtn).toBeDisplayed()
        })

        it('REG-CCL-014 | Closing without saving dismisses the modal', async () => {
            addFeature('Course Admin Classes'); addSeverity('critical')
            await CourseClassesPage.closeModal()
            await expect(CourseClassesPage.openModal).not.toBeDisplayed()
        })
    })

    describe('Edit Class Modal', () => {

        before(async () => {
            await CourseClassesPage.openEditModal()
        })

        it('REG-CCL-015 | Clicking edit opens the modal pre-filled with the class name', async () => {
            addFeature('Course Admin Classes'); addSeverity('critical')
            await expect(CourseClassesPage.modal).toBeDisplayed()
            expect(await CourseClassesPage.nameInput.getValue()).not.toBe('')
        })

        it('REG-CCL-016 | Closing without saving dismisses the modal', async () => {
            addFeature('Course Admin Classes'); addSeverity('critical')
            await CourseClassesPage.closeModal()
            await expect(CourseClassesPage.openModal).not.toBeDisplayed()
        })
    })
})
