import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import CalendarEntriesPage from '../../page objects/calendarEntries.page.js'
import { COURSE_ADMIN_USER } from '../../helpers/testData.js'

// No confirmed delete path for a Calendar Entry yet — regression coverage
// inspects the modal thoroughly and closes without saving, same as the
// Admin's Calendar (semesters) regression spec.

describe('REGRESSION (Course Admin) — Calendar Entries', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
        await CalendarEntriesPage.open()
    })

    describe('Page Load', () => {

        it('REG-CALE-001 | Calendar page loads with the correct title', async () => {
            addFeature('Course Admin Calendar'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Calendar/i)
        })

        it('REG-CALE-002 | Breadcrumb shows Calendar', async () => {
            addFeature('Course Admin Calendar'); addSeverity('critical')
            await expect(CalendarEntriesPage.breadcrumb).toHaveText(/Calendar/i)
        })

        it('REG-CALE-003 | New Calendar Entry button is visible and enabled', async () => {
            addFeature('Course Admin Calendar'); addSeverity('blocker')
            await expect(CalendarEntriesPage.newBtn).toBeDisplayed()
            await expect(CalendarEntriesPage.newBtn).not.toBeDisabled()
        })
    })

    describe('New Calendar Entry Modal', () => {

        before(async () => {
            await CalendarEntriesPage.openNewModal()
        })

        it('REG-CALE-004 | Clicking New Calendar Entry opens the modal', async () => {
            addFeature('Course Admin Calendar'); addSeverity('blocker')
            await expect(CalendarEntriesPage.modal).toBeDisplayed()
        })

        it('REG-CALE-005 | Error banner is hidden when modal first opens', async () => {
            addFeature('Course Admin Calendar'); addSeverity('normal')
            await expect(CalendarEntriesPage.modalError).not.toBeDisplayed()
        })

        it('REG-CALE-006 | Title field is present and empty', async () => {
            addFeature('Course Admin Calendar'); addSeverity('critical')
            await expect(CalendarEntriesPage.titleInput).toBeDisplayed()
            expect(await CalendarEntriesPage.titleInput.getValue()).toBe('')
        })

        it('REG-CALE-007 | Department select is present', async () => {
            addFeature('Course Admin Calendar'); addSeverity('normal')
            await expect(CalendarEntriesPage.departmentSelect).toBeExisting()
        })

        it('REG-CALE-008 | Due Date is a date input', async () => {
            addFeature('Course Admin Calendar'); addSeverity('critical')
            await expect(CalendarEntriesPage.dueDateInput).toBeDisplayed()
            expect(await CalendarEntriesPage.dueDateInput.getAttribute('type')).toBe('date')
        })

        it('REG-CALE-009 | Description field is present', async () => {
            addFeature('Course Admin Calendar'); addSeverity('critical')
            await expect(CalendarEntriesPage.descriptionInput).toBeDisplayed()
        })

        it('REG-CALE-010 | Save button is present', async () => {
            addFeature('Course Admin Calendar'); addSeverity('blocker')
            await expect(CalendarEntriesPage.saveBtn).toBeDisplayed()
        })

        it('REG-CALE-011 | Closing without saving dismisses the modal', async () => {
            addFeature('Course Admin Calendar'); addSeverity('critical')
            await CalendarEntriesPage.closeModal()
            await expect(CalendarEntriesPage.openModal).not.toBeDisplayed()
        })
    })
})
