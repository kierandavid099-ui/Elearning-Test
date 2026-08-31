import ModulePage from './modulePage.page.js'

class CourseClassesPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-elearning/courseClasses')
    }

    get newBtn() { return $('#btn-new-mdl-courseClass-modal') }
    get modal() { return $('#mdl-courseClass-modal') }
    get modalError() { return $('#div-courseClass-modal-error') }

    get codeInput() { return $('#code') }
    get nameInput() { return $('#name') }
    get emailAddressInput() { return $('#email_address') }
    get creditHoursInput() { return $('#credit_hours') }
    get statusSelect() { return $('#status') }
    get locationInput() { return $('#location') }
    get semesterSelect() { return $('#semester_id') }
    get courseSelect() { return $('#course_id') }
    get lecturerSelect() { return $('#lecturer_id') }
    get telephoneInput() { return $('#telephone') }
    get nextExamDateInput() { return $('#next_exam_date') }
    get courseOutlineInput() { return $('#course_outline') }

    get saveBtn() { return $('#btn-save-mdl-courseClass-modal') }

    get outlineTab() { return $('a[href="#outline"]') }

    get editBtn() { return $('.btn-edit-mdl-courseClass-modal') }
    get deleteBtn() { return $('.btn-delete-mdl-courseClass-modal') }
    get viewBtn() { return $('a=View') }

    async openOutlineTab() {
        await this.outlineTab.waitForDisplayed({ timeout: 5000 })
        await this.outlineTab.click()
        await this.courseOutlineInput.waitForDisplayed({ timeout: 5000 })
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
            timeoutMsg: 'Class edit modal did not populate the Name field in time',
        })
    }

    // Row-search helper for the Classes table — matches the pattern in
    // personModal.page.js's row(). Cell text (not id) since the table's
    // component id is regenerated per page load.
    row(text) { return $(`//tr[.//td[contains(., "${text}")]]`) }

    // The lecturer select's option text convention (e.g. "Last, First" vs
    // "First Last") isn't confirmed, so match on the option containing both
    // name fragments rather than assuming an exact display string.
    async selectLecturerByName(firstName, lastName) {
        await this.lecturerSelect.waitForDisplayed({ timeout: 5000 })
        const options = await this.lecturerSelect.$$('option')
        for (const option of options) {
            const text = await option.getText()
            if (text.includes(firstName) && text.includes(lastName)) {
                const value = await option.getAttribute('value')
                await this.lecturerSelect.selectByAttribute('value', value)
                return
            }
        }
        throw new Error(`No lecturer option found matching "${firstName}" / "${lastName}"`)
    }

    // Picks the first real (non-placeholder) option of a plain <select> —
    // used for fields where any valid choice satisfies the form (Semester,
    // Course, Status) and the specific value doesn't matter for the journey.
    async selectFirstOption(selectElement) {
        await selectElement.waitForDisplayed({ timeout: 5000 })
        const options = await selectElement.$$('option')
        for (const option of options) {
            const value = await option.getAttribute('value')
            if (value) {
                await selectElement.selectByAttribute('value', value)
                return
            }
        }
        throw new Error('No non-placeholder option found in select')
    }

    // Fills every required field on the New Class modal with either a
    // supplied value or a sane default, then saves. Returns the code/name
    // used so callers can verify the row afterward.
    async create({ code, name, lecturerFirstName, lecturerLastName } = {}) {
        await this.openNewModal()

        await this.codeInput.setValue(code)
        await this.nameInput.setValue(name)
        await this.creditHoursInput.setValue(3)
        await this.selectFirstOption(this.statusSelect)
        await this.selectFirstOption(this.semesterSelect)
        await this.selectFirstOption(this.courseSelect)

        if (lecturerFirstName && lecturerLastName) {
            await this.selectLecturerByName(lecturerFirstName, lecturerLastName)
        } else {
            await this.selectFirstOption(this.lecturerSelect)
        }

        await this.saveBtn.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.click()
        await this.dismissSweetAlert()
        await this.modal.waitForDisplayed({ reverse: true, timeout: 10000 })
    }
}

export default new CourseClassesPage()
