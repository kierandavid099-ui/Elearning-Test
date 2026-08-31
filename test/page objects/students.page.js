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
    get filterLink() { return $('a=Filter') }
    get filterApplyBtn() { return $('button[id^="btn-save-mdl-cdv_"][id$="-filter-modal"]') }
    get filterResetBtn() { return $('button[id^="btn-reset-mdl-cdv_"][id$="-filter-modal"]') }

    async openNewModal() {
        await this.newStudentBtn.waitForDisplayed({ timeout: 5000 })
        await this.newStudentBtn.click()
        await this.modal.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
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

    // Row-search helper — same pattern as personModal.page.js's row().
    row(text) { return $(`//tr[.//td[contains(., "${text}")]]`) }

    // Fills every required field across both tabs with either a supplied
    // value or a sane default, then saves. Department/Level/Program/
    // Admission Year are left at whatever the form defaults to — any valid
    // choice satisfies the form and the specific value doesn't matter here.
    async create({ firstName, lastName, email, telephone, dateOfBirth }) {
        await this.openNewModal()

        await this.firstNameInput.setValue(firstName)
        await this.lastNameInput.setValue(lastName)
        await this.emailInput.setValue(email)
        await this.telephoneInput.setValue(telephone)
        await this.dateOfBirthInput.setValue(dateOfBirth)

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
