import ModulePage from './modulePage.page.js'

// Distinct from calendar.page.js (which targets the admin-only academic
// semesters screen at /scola-core/semesters) — this is the course admin's
// eLearning "Calendar" sidebar item, a separate calendar-entries feature.
class CalendarEntriesPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-elearning/calendarEntries')
    }

    get newBtn() { return $('#btn-new-mdl-calendarEntry-modal') }
    get modal() { return $('#mdl-calendarEntry-modal') }
    get modalError() { return $('#div-calendarEntry-modal-error') }

    get titleInput() { return $('#title') }
    get departmentSelect() { return $('#department_ids') }
    get dueDateInput() { return $('#due_date') }
    get descriptionInput() { return $('#description') }

    get saveBtn() { return $('#btn-save-mdl-calendarEntry-modal') }

    async openNewModal() {
        await this.newBtn.waitForDisplayed({ timeout: 5000 })
        await this.newBtn.click()
        await this.modal.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
    }
}

export default new CalendarEntriesPage()
