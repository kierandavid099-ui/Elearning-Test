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
    get departmentSelect() { return $('#department_id_m') }
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
        // The form shows before it's ready and typing straight away fails with
        // "element not interactable", so give it a moment like a person would.
        await browser.pause(3000)
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

    // The Classes list is a stack of cards, not a table. Each card's title
    // reads "<code> :: <name>" and its View/Edit/Delete buttons sit in the same
    // card. The list itself is also wrapped in a .card, so take the closest one.
    row(text) {
        return $(`//h5[contains(@class, "card-title")][contains(., "${text}")]/ancestor::div[contains(concat(" ", normalize-space(@class), " "), " card ")][1]`)
    }

    // The top card in the list, which is the newest class once the page is reloaded.
    get firstCard() {
        return $(`(//h5[contains(@class, "card-title")])[1]/ancestor::div[contains(concat(" ", normalize-space(@class), " "), " card ")][1]`)
    }

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
    // used so callers can verify the row afterward. Pass departmentId to
    // target a specific department (e.g. so a freshly-created class is
    // guaranteed to show up for a student in that department) instead of
    // whichever department happens to be first in the list.
    async create({ code, name, lecturerFirstName, lecturerLastName, departmentId } = {}) {
        await this.openNewModal()

        await this.codeInput.setValue(code)
        await this.nameInput.setValue(name)
        await this.creditHoursInput.setValue(3)
        await this.selectFirstOption(this.statusSelect)
        if (departmentId) {
            await this.departmentSelect.selectByAttribute('value', departmentId)
        } else {
            await this.selectFirstOption(this.departmentSelect)
        }
        await this.selectFirstOption(this.semesterSelect)
        await this.selectFirstOption(this.courseSelect)

        if (lecturerFirstName && lecturerLastName) {
            await this.selectLecturerByName(lecturerFirstName, lecturerLastName)
        } else {
            await this.selectFirstOption(this.lecturerSelect)
        }

        // Outline and Department are both required; the site refuses the save
        // with "The outline field is required" if the Outline tab is left empty.
        await this.openOutlineTab()
        await this.courseOutlineInput.setValue('Outline added by automated e2e coverage.')

        await this.saveBtn.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.click()
        await this.dismissSweetAlert()
        await this.modal.waitForDisplayed({ reverse: true, timeout: 10000 })
    }
}

export default new CourseClassesPage()
