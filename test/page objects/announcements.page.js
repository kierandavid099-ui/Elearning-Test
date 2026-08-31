import ModulePage from './modulePage.page.js'

class AnnouncementsPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-elearning/announcements')
    }

    get newBtn() { return $('#btn-new-mdl-announcement-modal') }
    get modal() { return $('#mdl-announcement-modal') }
    get modalError() { return $('#div-announcement-modal-error') }

    get headlineInput() { return $('#headline') }
    get startDateInput() { return $('#announcement_start_date') }
    get endDateInput() { return $('#announcement_end_date') }
    get descriptionInput() { return $('#announcement_description') }
    get courseClassSelect() { return $('#announcement_course_class_id') }
    get fileInput() { return $('#announcement_file') }

    get audienceAllRadio() { return $('#all') }
    get audienceLecturerRadio() { return $('#lecturer') }
    get audienceStudentRadio() { return $('#student') }

    get saveBtn() { return $('#btn-save-mdl-announcement-modal') }

    async openNewModal() {
        await this.newBtn.waitForDisplayed({ timeout: 5000 })
        await this.newBtn.click()
        await this.modal.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
    }
}

export default new AnnouncementsPage()
