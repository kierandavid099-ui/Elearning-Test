import ModulePage from './modulePage.page.js'

class StudentsPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-elearning/students')
    }

    get newStudentBtn() { return $('#btn-new-mdl-student-modal') }
    get modal() { return $('#mdl-student-modal') }
    get modalError() { return $('#div-student-modal-error') }

    // Bio Details tab
    get bioDetailsTab() { return $('a[href="#bio-details"]') }
    get firstNameInput() { return $('#first_name') }
    get lastNameInput() { return $('#last_name') }
    get middleNameInput() { return $('#middle_name') }
    get emailInput() { return $('#email') }
    get telephoneInput() { return $('#telephone') }
    get dateOfBirthInput() { return $('#date_of_birth') }
    get genderSelect() { return $('#gender') }
    get matriculationNumberInput() { return $('#matriculation_number') }
    get jambNumberInput() { return $('#jamb_number') }
    get nationalIdInput() { return $('#national_id_number') }
    get departmentSelect() { return $('#department_id') }
    get levelSelect() { return $('#level_id') }
    get admittedProgramSelect() { return $('#admitted_program_id') }
    get admissionYearSelect() { return $('#admission_year') }

    // Address tab
    get addressTab() { return $('a[href="#address"]') }
    get addressStreetInput() { return $('#address_street') }
    get addressTownInput() { return $('#address_town') }
    get addressStateInput() { return $('#address_state') }
    get stateOfOriginInput() { return $('#state_of_origin') }
    get geoPoliticalZoneInput() { return $('#geo_political_zone') }
    get originLgaInput() { return $('#origin_local_government_area') }

    get saveBtn() { return $('#btn-save-mdl-student-modal') }

    // Bulk Upload
    get bulkUploadBtn() { return $('#btn-mdl-bulk-upload-student-modal') }
    get bulkUploadSubmitBtn() { return $('#btn-upload-mdl-student-modal') }

    // Filter — the table's cdv_<hash> component id is regenerated per page
    // load, so anchor on the stable prefix/suffix instead of the full id.
    get searchInput() { return $('input[placeholder="Search Student"]') }

    get filterLink() { return $('a=Filter') }
    get filterApplyBtn() { return $('button[id^="btn-save-mdl-cdv_"][id$="-filter-modal"]') }
    get filterResetBtn() { return $('button[id^="btn-reset-mdl-cdv_"][id$="-filter-modal"]') }

    async openNewModal() {
        await this.newStudentBtn.waitForDisplayed({ timeout: 5000 })
        await this.newStudentBtn.click()
        await this.modal.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
        // The form shows before it's ready, so give it a moment before typing.
        await browser.pause(3000)
    }

    // Opens the bulk-upload modal to inspect it — never submits a file, since
    // there's no confirmed-safe sample file/undo path for a real bulk import.
    async openBulkUploadModal() {
        await this.bulkUploadBtn.waitForDisplayed({ timeout: 5000 })
        await this.bulkUploadBtn.click()
        await this.openModal.waitForDisplayed({ timeout: 5000 })
    }

    async openFilterModal() {
        await this.filterLink.waitForDisplayed({ timeout: 5000 })
        await this.filterLink.click()
        await this.openModal.waitForDisplayed({ timeout: 5000 })
    }

    // The Students list is rows of divs, not a table, and names read
    // "Last, First". Match the element whose own text holds the value.
    row(text) { return $(`//*[text()[contains(., "${text}")]]`) }

    // The list is paginated (20 per page) and new students aren't
    // necessarily on page 1, so look them up the way a person would.
    async search(text) {
        await this.searchInput.waitForDisplayed({ timeout: 5000 })
        await this.searchInput.setValue(text)
        await browser.keys('Enter')
    }

    // Picks the first real (non-placeholder) option of a <select>. Department,
    // Level and Admission Year are select2-backed but still set this way.
    async selectFirstOption(selectElement) {
        await selectElement.waitForExist({ timeout: 5000 })
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

    // Fills every required field across both tabs with either a supplied
    // value or a sane default, then saves. Department, Level and Admission
    // Year are required but start empty; any valid choice will do here.
    async create({ firstName, lastName, email, telephone, dateOfBirth, matriculationNumber }) {
        await this.openNewModal()

        await this.selectFirstOption(this.departmentSelect)
        await this.selectFirstOption(this.levelSelect)
        await this.selectFirstOption(this.admissionYearSelect)

        await this.firstNameInput.setValue(firstName)
        await this.lastNameInput.setValue(lastName)
        await this.emailInput.setValue(email)
        await this.telephoneInput.setValue(telephone)
        // Chrome's date box takes keystrokes in its displayed mm/dd/yyyy order,
        // so typing the ISO string straight in lands digits in the wrong parts.
        const [year, month, day] = dateOfBirth.split('-')
        await this.dateOfBirthInput.setValue(`${month}${day}${year}`)
        await this.matriculationNumberInput.setValue(matriculationNumber)

        await this.addressTab.click()
        await this.addressStreetInput.waitForDisplayed({ timeout: 5000 })
        await this.addressStreetInput.setValue('1 Test Street')
        await this.addressTownInput.setValue('Test Town')
        await this.addressStateInput.setValue('Test State')

        await this.saveBtn.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.click()
        await this.dismissSweetAlert()
        await this.modal.waitForDisplayed({ reverse: true, timeout: 10000 })
    }
}

export default new StudentsPage()
