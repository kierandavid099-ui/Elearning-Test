import { randomString, randomPhone, randomEmail } from '../helpers/random.js'

// Shared behaviour for the "manager"/"lecturer" modal CRUD screens, which
// use the same select2-driven create modal and the same disable/reset-password
// modals, only with different trigger selectors per resource type.
export default class PersonModalPage {

    constructor({ url, newBtnSelector, editBtnSelector, viewBtnSelector, saveBtnSelector, modalSelector }) {
        this.url = url
        this.newBtnSelector = newBtnSelector
        this.editBtnSelector = editBtnSelector
        this.viewBtnSelector = viewBtnSelector
        this.saveBtnSelector = saveBtnSelector
        this.modalSelector = modalSelector
    }

    get breadcrumb() { return $('.breadcrumb-title, .page-title, .breadcrumb') }

    async open() {
        await browser.url(this.url)
        await this.breadcrumb.waitForDisplayed({ timeout: 10000 })
    }

    get newBtn() { return $(this.newBtnSelector) }
    get editBtn() { return $(this.editBtnSelector) }
    get viewBtn() { return $(this.viewBtnSelector) }
    get saveBtn() { return $(this.saveBtnSelector) }

    // Inferred from the btn-*-mdl-{resource}-modal naming convention already used
    // by the trigger buttons above — not yet confirmed against the live DOM.
    get modal() { return $(this.modalSelector) }

    // Only one modal is open at a time in these flows, so target whichever is
    // currently visible rather than assuming a resource-specific ID.
    get openModal() { return $('.modal.show') }
    get closeModalBtn() { return $('.modal.show button.btn-close') }

    get staffSelectContainer() { return $('#select2-select-staff-container') }
    get staffSearchInput() { return $('.select2-search__field') }
    staffOption(name) { return $(`li*=${name}`) }

    get middleNameInput() { return $('#middle_name') }

    get disableBtn() { return $('a.btn-disable-user-account') }
    get disableReasonInput() { return $('#reason') }
    get disableConfirmBtn() { return $('#modify-account-disabled') }

    // Mirrors disableBtn's class-naming convention (btn-disable-user-account ->
    // btn-enable-user-account) — confirmed against the live DOM's per-row
    // btn-enable-<uuid> trigger ids, but the class itself isn't directly
    // observable from an id-only dump, so treat this as inferred like `modal` above.
    get enableBtn() { return $('a.btn-enable-user-account') }
    get enableConfirmBtn() { return $('#modify-account-enable') }

    get resetPasswordLink() { return $('a.btn-edit-modify-user-password-reset-modal') }
    get newPasswordInput() { return $('#password') }
    get resetConfirmBtn() { return $('#btn-modify-user-password-reset') }

    get sweetAlertConfirmBtn() { return $('.sweet-alert.showSweetAlert button.confirm') }

    // Save/disable/reset actions all resolve into a SweetAlert confirmation
    // that blocks the underlying modal from fully closing until dismissed —
    // and if left unhandled, its overlay intercepts clicks on later actions.
    async dismissSweetAlert(timeout = 3000) {
        const appeared = await this.sweetAlertConfirmBtn.waitForDisplayed({ timeout }).catch(() => false)
        if (appeared) {
            await this.sweetAlertConfirmBtn.click()
            await this.sweetAlertConfirmBtn.waitForExist({ reverse: true, timeout: 5000 })
        }
    }

    async openNewModal() {
        await this.newBtn.waitForDisplayed({ timeout: 5000 })
        await this.newBtn.click()
        await this.modal.waitForDisplayed({ timeout: 5000 })
        // the modal shell appears before its content (loaded via AJAX) finishes
        // rendering — wait for the save button so callers see a fully-loaded form
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
    }

    async openEditModal() {
        await this.editBtn.waitForDisplayed({ timeout: 5000 })
        await this.editBtn.click()
        await this.modal.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
    }

    async openViewModal() {
        await this.viewBtn.waitForDisplayed({ timeout: 5000 })
        await this.viewBtn.click()
        // The Instructor spec's view trigger is literally 'a.btn-show-mdl-manager-modal' —
        // identical to the Administrator one — so we can't be sure the resource-specific
        // modal ID applies here. Wait for any open Bootstrap modal instead.
        await this.openModal.waitForDisplayed({ timeout: 5000 })
    }

    async closeModal() {
        await this.closeModalBtn.waitForClickable({ timeout: 5000 })
        await this.closeModalBtn.click()
        await this.openModal.waitForDisplayed({ reverse: true, timeout: 8000 })
    }

    async selectStaff(name) {
        await this.staffSelectContainer.waitForDisplayed({ timeout: 5000 })
        await this.staffSelectContainer.click()

        await this.staffSearchInput.waitForDisplayed({ timeout: 5000 })
        await this.staffSearchInput.setValue(name)

        const option = this.staffOption(name)
        await option.waitForDisplayed({ timeout: 5000 })
        await option.click()
    }

    get createNewStaffOption() { return $('.select2-results__option*=Create a New Staff') }
    get newStaffSection() { return $('#div-new-staff') }
    get departmentSelectContainer() { return $('#select2-department_id-container') }
    get lastNameInput() { return $('#last_name') }
    get firstNameInput() { return $('#first_name') }
    get emailInput() { return $('#email') }
    get telephoneInput() { return $('#telephone') }

    // The staff picker's dropdown always offers a "Create a New Staff+" entry
    // ahead of the real employee list — picking it reveals a brand-new-hire
    // form (#div-new-staff) instead of requiring an existing record.
    async selectCreateNewStaff() {
        await this.staffSelectContainer.waitForDisplayed({ timeout: 5000 })
        await this.staffSelectContainer.click()

        await this.createNewStaffOption.waitForDisplayed({ timeout: 5000 })
        await this.createNewStaffOption.click()

        await this.newStaffSection.waitForDisplayed({ timeout: 5000 })
    }

    async selectRandomDepartment() {
        await this.departmentSelectContainer.waitForDisplayed({ timeout: 5000 })
        await this.departmentSelectContainer.click()

        const options = await $$('.select2-results__option')
        await options[0].waitForDisplayed({ timeout: 5000 })
        await options[Math.floor(Math.random() * options.length)].click()
    }

    // Fills in a brand-new staff record with randomised details every run,
    // so re-saving never collides with a staff member already created (or
    // already assigned to this role) by an earlier run. The telephone field
    // requires exactly 11 digits — randomPhone() always produces that.
    async createNewStaff() {
        await this.selectCreateNewStaff()
        await this.selectRandomDepartment()

        const suffix = randomString(6)
        const lastName = `TestLast-${suffix}`
        const firstName = `TestFirst-${suffix}`
        const email = randomEmail()

        await this.lastNameInput.setValue(lastName)
        await this.firstNameInput.setValue(firstName)
        await this.emailInput.setValue(email)
        await this.telephoneInput.setValue(randomPhone())

        return { firstName, lastName, email }
    }

    // Row-search helper for the resource list behind this modal — the table's
    // cdv_<hash> component id is regenerated per page load (see students.page.js),
    // so match on visible text instead of a stable id.
    row(text) { return $(`//tr[.//td[contains(., "${text}")]]`) }

    async setMiddleName(value) {
        await this.middleNameInput.waitForDisplayed({ timeout: 5000 })
        await this.middleNameInput.setValue(value)
    }

    async save() {
        await this.saveBtn.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.click()
        await this.dismissSweetAlert()
        // Bootstrap hides the modal (display:none) rather than removing it from
        // the DOM, so the save button still "exists" after close — check visibility.
        await this.saveBtn.waitForDisplayed({ reverse: true, timeout: 10000 })
    }

    async create(staffName) {
        await this.openNewModal()
        await this.selectStaff(staffName)
        await this.save()
    }

    // Full create-a-new-staff-member-and-assign-role round trip, returning
    // the generated identity so callers can verify/search for it afterward.
    async createWithNewStaff() {
        await this.openNewModal()
        const identity = await this.createNewStaff()
        await this.save()
        return identity
    }

    async editMiddleName(value) {
        await this.openEditModal()
        await this.setMiddleName(value)
        await this.save()
    }

    async disable(reason) {
        await this.disableBtn.waitForDisplayed({ timeout: 5000 })
        await this.disableBtn.click()

        await this.disableReasonInput.waitForDisplayed({ timeout: 5000 })
        await this.disableReasonInput.setValue(reason)

        await this.disableConfirmBtn.waitForDisplayed({ timeout: 5000 })
        await this.disableConfirmBtn.click()
        await this.dismissSweetAlert()
        await this.disableConfirmBtn.waitForDisplayed({ reverse: true, timeout: 10000 })
    }

    // Unlike disable(), enabling doesn't collect a reason — clicking Enable
    // goes straight to a Proceed/Cancel confirmation.
    async enable() {
        await this.enableBtn.waitForDisplayed({ timeout: 5000 })
        await this.enableBtn.click()

        await this.enableConfirmBtn.waitForDisplayed({ timeout: 5000 })
        await this.enableConfirmBtn.click()
        await this.dismissSweetAlert()
        await this.enableConfirmBtn.waitForDisplayed({ reverse: true, timeout: 10000 })
    }

    async resetPassword(newPassword) {
        await this.resetPasswordLink.waitForDisplayed({ timeout: 5000 })
        await this.resetPasswordLink.click()

        await this.newPasswordInput.waitForDisplayed({ timeout: 5000 })
        await this.newPasswordInput.setValue(newPassword)

        await this.resetConfirmBtn.waitForDisplayed({ timeout: 5000 })
        await this.resetConfirmBtn.click()
        await this.dismissSweetAlert()
        await this.resetConfirmBtn.waitForDisplayed({ reverse: true, timeout: 10000 })
    }
}
