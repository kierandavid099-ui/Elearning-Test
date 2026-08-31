import ModulePage from './modulePage.page.js'

class CoursesPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-core/courses')
    }

    get newBtn() { return $('#btn-new-mdl-course-modal') }
    get modal() { return $('#mdl-course-modal') }
    get modalError() { return $('#div-course-modal-error') }
    get bulkUploadBtn() { return $('*=Bulk Upload') }

    get departmentSelect() { return $('#department_id') }
    get nameInput() { return $('#name') }
    get codeInput() { return $('#code') }
    get creditHoursInput() { return $('#credit_hours') }
    get descriptionInput() { return $('#description') }

    get saveBtn() { return $('#btn-save-mdl-course-modal') }

    get viewBtn() { return $('.btn-show-mdl-course-modal') }
    get editBtn() { return $('.btn-edit-mdl-course-modal') }

    get descriptionTab() { return $('a[href="#descriptions"]') }

    async openDescriptionTab() {
        await this.descriptionTab.waitForDisplayed({ timeout: 5000 })
        await this.descriptionTab.click()
        await this.descriptionInput.waitForDisplayed({ timeout: 5000 })
    }

    async openNewModal() {
        await this.newBtn.waitForDisplayed({ timeout: 5000 })
        await this.newBtn.click()
        await this.modal.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
    }

    async openEditModal() {
        await this.editBtn.waitForDisplayed({ timeout: 5000 })
        await this.editBtn.click()
        await this.modal.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
        // The modal shell (and its Save button) render before the record's
        // data finishes loading via AJAX — wait for the Name field to
        // actually be populated rather than assuming it's ready.
        await browser.waitUntil(async () => (await this.nameInput.getValue()) !== '', {
            timeout: 8000,
            timeoutMsg: 'Course edit modal did not populate the Name field in time',
        })
    }

    async openViewModal() {
        await this.viewBtn.waitForDisplayed({ timeout: 5000 })
        await this.viewBtn.click()
        await this.openModal.waitForDisplayed({ timeout: 5000 })
    }
}

export default new CoursesPage()
