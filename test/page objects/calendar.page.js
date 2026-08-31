import ModulePage from './modulePage.page.js'

class CalendarPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-core/semesters')
    }

    get newCalendarBtn() { return $('#btn-new-mdl-semester-modal') }
    get modal() { return $('#mdl-semester-modal') }
    get modalError() { return $('#div-semester-modal-error') }

    get sessionSelect() { return $('#academic_session') }
    get calendarCodeSelect() { return $('#semester_code') }
    get startDateInput() { return $('#start_date') }
    get endDateInput() { return $('#end_date') }
    get saveBtn() { return $('#btn-save-mdl-semester-modal') }

    // The live markup reuses #btn-new-mdl-semester-modal for both the "New
    // Calendar" and "Start Calendar" triggers (a duplicate-id quirk on the
    // page itself), so an id selector can't tell them apart — target by text.
    get startCalendarBtn() { return $('a=Start Calendar') }
    get commenceSaveBtn() { return $('#btn-save-mdl-commence-semester-modal') }

    async openNewModal() {
        await this.newCalendarBtn.waitForDisplayed({ timeout: 5000 })
        await this.newCalendarBtn.click()
        await this.modal.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
    }

    // Commencing a semester has real academic scheduling implications, so —
    // same caution as openNewModal's siblings in this suite — this only opens
    // and inspects the modal, it never clicks commenceSaveBtn.
    async openCommenceModal() {
        await this.startCalendarBtn.waitForDisplayed({ timeout: 5000 })
        await this.startCalendarBtn.click()
        await this.openModal.waitForDisplayed({ timeout: 5000 })
    }
}

export default new CalendarPage()
