import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import CalendarPage from '../../page objects/calendar.page.js'
import { ADMIN_USER } from '../../helpers/testData.js'

// Calendar creation isn't exercised end-to-end here — there's no confirmed
// delete path for a Calendar record, and creating one has real academic
// scheduling implications. Regression coverage inspects the modal thoroughly
// and closes without saving.

describe('REGRESSION — Calendar', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await CalendarPage.open()
    })

    describe('Page Load', () => {

        it('REG-CAL-001 | Calendar page loads with the correct title', async () => {
            addFeature('Calendar'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Calendar Management/i)
        })

        it('REG-CAL-002 | Breadcrumb shows Calendar', async () => {
            addFeature('Calendar'); addSeverity('critical')
            await expect(CalendarPage.breadcrumb).toHaveText(/Calendar/i)
        })

        it('REG-CAL-003 | New Calendar button is visible and enabled', async () => {
            addFeature('Calendar'); addSeverity('blocker')
            await expect(CalendarPage.newCalendarBtn).toBeDisplayed()
            await expect(CalendarPage.newCalendarBtn).not.toBeDisabled()
        })
    })

    describe('New Calendar Modal', () => {

        before(async () => {
            await CalendarPage.openNewModal()
        })

        it('REG-CAL-004 | Clicking New Calendar opens the modal', async () => {
            addFeature('Calendar'); addSeverity('blocker')
            await expect(CalendarPage.modal).toBeDisplayed()
        })

        it('REG-CAL-005 | Error banner is hidden when modal first opens', async () => {
            addFeature('Calendar'); addSeverity('normal')
            await expect(CalendarPage.modalError).not.toBeDisplayed()
        })

        it('REG-CAL-006 | Session select is present with multiple academic sessions', async () => {
            addFeature('Calendar'); addSeverity('critical')
            await expect(CalendarPage.sessionSelect).toBeDisplayed()
            const options = await CalendarPage.sessionSelect.$$('option')
            expect(options.length).toBeGreaterThan(5)
        })

        it('REG-CAL-007 | Calendar Code select offers First, Second and Third Calendar', async () => {
            addFeature('Calendar'); addSeverity('critical')
            await expect(CalendarPage.calendarCodeSelect).toBeDisplayed()
            const options = await CalendarPage.calendarCodeSelect.$$('option')
            const texts = (await options.map((o) => o.getText())).map((t) => t.trim())
            expect(texts).toContain('First Calendar')
            expect(texts).toContain('Second Calendar')
            expect(texts).toContain('Third Calendar')
        })

        it('REG-CAL-008 | Start Date and End Date are date inputs', async () => {
            addFeature('Calendar'); addSeverity('critical')
            await expect(CalendarPage.startDateInput).toBeDisplayed()
            await expect(CalendarPage.endDateInput).toBeDisplayed()
            expect(await CalendarPage.startDateInput.getAttribute('type')).toBe('date')
            expect(await CalendarPage.endDateInput.getAttribute('type')).toBe('date')
        })

        it('REG-CAL-009 | Save button is present', async () => {
            addFeature('Calendar'); addSeverity('blocker')
            await expect(CalendarPage.saveBtn).toBeDisplayed()
        })

        it('REG-CAL-010 | Closing without saving dismisses the modal', async () => {
            addFeature('Calendar'); addSeverity('critical')
            await CalendarPage.closeModal()
            await expect(CalendarPage.openModal).not.toBeDisplayed()
        })
    })

    // Commencing a semester has real academic scheduling implications, so —
    // same caution as New Calendar above — this only opens and inspects the
    // modal, it never clicks Save.
    describe('Start Calendar (Commence Semester) Modal', () => {

        before(async () => {
            await CalendarPage.openCommenceModal()
        })

        it('REG-CAL-011 | Clicking Start Calendar opens a modal', async () => {
            addFeature('Calendar'); addSeverity('critical')
            await expect(CalendarPage.openModal).toBeDisplayed()
        })

        it('REG-CAL-012 | Save button is present', async () => {
            addFeature('Calendar'); addSeverity('critical')
            await expect(CalendarPage.commenceSaveBtn).toBeDisplayed()
        })

        it('REG-CAL-013 | Closing without saving dismisses the modal', async () => {
            addFeature('Calendar'); addSeverity('critical')
            await CalendarPage.closeModal()
            await expect(CalendarPage.openModal).not.toBeDisplayed()
        })
    })
})
