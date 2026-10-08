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
        await this.dismissTour()
    }

    // Same "Welcome to Invoice Manager" tour pop-up as in modulePage.page.js;
    // it sits over the page and blocks typing into forms.
    get tourCloseBtn() { return $('.driver-popover-close-btn') }

    async dismissTour(timeout = 3000) {
        const shown = await this.tourCloseBtn.waitForDisplayed({ timeout }).catch(() => false)
        if (shown) {
            await this.tourCloseBtn.click()
            await this.tourCloseBtn.waitForDisplayed({ reverse: true, timeout: 5000 })
        }
    }

    // The tour can also pop up mid-spec (e.g. after a save reloads the page),
    // and its overlay swallows clicks, so clear it before every modal trigger.
    async clickTrigger(el) {
        await el.waitForDisplayed({ timeout: 5000 })
        await this.dismissTour(500)
        await el.click()
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

    get sweetAlert() { return $('.sweet-alert.showSweetAlert') }
    // SweetAlert v1 draws a different icon per alert type; only the green
    // tick (.sa-success) is visible on a success alert.
    get sweetAlertSuccessIcon() { return $('.sweet-alert.showSweetAlert .sa-icon.sa-success') }
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
        await this.clickTrigger(this.newBtn)
        await this.modal.waitForDisplayed({ timeout: 5000 })
        // the modal shell appears before its content (loaded via AJAX) finishes
        // rendering — wait for the save button so callers see a fully-loaded form
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
        // Even then it isn't ready for typing straight away; give it a moment.
        await browser.pause(3000)
    }

    async openEditModal() {
        await this.clickTrigger(this.editBtn)
        await this.modal.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
        // The existing record is filled in after the form appears; typing
        // before then gets overwritten or saves a half-loaded form.
        await browser.pause(3000)
    }

    async openViewModal() {
        await this.clickTrigger(this.viewBtn)
        // The Instructor spec's view trigger is literally 'a.btn-show-mdl-manager-modal' —
        // identical to the Administrator one — so we can't be sure the resource-specific
        // modal ID applies here. Wait for any open Bootstrap modal instead.
        await this.openModal.waitForDisplayed({ timeout: 5000 })
        // The modal shows before its record has loaded; closing it too early
        // lets the late load reopen it.
        await browser.pause(3000)
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
    // Named per page: #div-new-lecturer on Course Instructor, #div-new-staff elsewhere.
    get newStaffSection() { return $('#div-new-staff, #div-new-lecturer') }
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

        await $('#select2-department_id-results .select2-results__option').waitForDisplayed({ timeout: 5000 })
        // Skip the "Select Department" placeholder; picking it leaves the field empty.
        const options = await $$('#select2-department_id-results .select2-results__option')
            .filter(async (o) => !(await o.getText()).trim().startsWith('Select'))
        if (!options.length) throw new Error('No departments to choose from')
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

    // The list behind this modal is a stack of cards, not a table, and its
    // cdv_<hash> id changes per page load. Find the text, then take the nearest
    // card around it so the row's own action buttons can be looked up inside it.
    row(text) {
        return $(`//*[text()[contains(., "${text}")]]/ancestor::div[contains(concat(" ", normalize-space(@class), " "), " card ")][1]`)
    }

    async setMiddleName(value) {
        await this.middleNameInput.waitForDisplayed({ timeout: 5000 })
        await this.middleNameInput.setValue(value)
    }

    async save() {
        await this.saveBtn.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.click()
        // If the site rejects the save, fail with its own message rather
        // than the vaguer "save button still displayed" below.
        const alerted = await this.sweetAlert.waitForDisplayed({ timeout: 10000 }).catch(() => false)
        if (alerted && !(await this.sweetAlertSuccessIcon.isDisplayed())) {
            throw new Error(`Save was rejected: ${await this.sweetAlert.getText()}`)
        }
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
        await this.clickTrigger(this.disableBtn)

        await this.disableReasonInput.waitForDisplayed({ timeout: 5000 })
        // Same not-yet-loaded problem as the reset modal below.
        await browser.pause(3000)
        await this.disableReasonInput.setValue(reason)

        await this.disableConfirmBtn.waitForDisplayed({ timeout: 5000 })
        await this.disableConfirmBtn.click()
        await this.dismissSweetAlert(10000)
        await this.disableConfirmBtn.waitForDisplayed({ reverse: true, timeout: 10000 })
    }

    // Unlike disable(), enabling doesn't collect a reason — clicking Enable
    // goes straight to a Proceed/Cancel confirmation.
    async enable() {
        // A successful disable can hide its confirm button but leave the
        // modal open over the table, which intercepts the Enable click.
        const stillOpen = !(await this.openModal.waitForDisplayed({ reverse: true, timeout: 3000 }).catch(() => false))
        if (stillOpen) await this.closeModal()

        await this.clickTrigger(this.enableBtn)

        await this.enableConfirmBtn.waitForDisplayed({ timeout: 5000 })
        // Same not-yet-loaded problem as the disable and reset modals.
        await browser.pause(3000)
        await this.enableConfirmBtn.click()
        // If the site rejects it, fail with its own message rather than the
        // vaguer "confirm button still displayed" below.
        const alerted = await this.sweetAlert.waitForDisplayed({ timeout: 10000 }).catch(() => false)
        if (alerted && !(await this.sweetAlertSuccessIcon.isDisplayed())) {
            throw new Error(`Enable was rejected: ${await this.sweetAlert.getText()}`)
        }
        await this.dismissSweetAlert()
        await this.enableConfirmBtn.waitForDisplayed({ reverse: true, timeout: 10000 })
    }

    // The reset modal shows its fields before it has finished loading which
    // user it belongs to. Confirming too early makes the site reject the reset
    // with "User not found ! Not valid!" without sending a request. There's no
    // visible signal for "loaded", so give it a moment like a person would.
    async openResetPasswordModal() {
        await this.clickTrigger(this.resetPasswordLink)
        await this.newPasswordInput.waitForDisplayed({ timeout: 5000 })
        await browser.pause(3000)
    }

    async resetPassword(newPassword) {
        await this.openResetPasswordModal()
        await this.newPasswordInput.setValue(newPassword)

        await this.resetConfirmBtn.waitForDisplayed({ timeout: 5000 })
        await this.resetConfirmBtn.click()
        await this.dismissSweetAlert()
        await this.resetConfirmBtn.waitForDisplayed({ reverse: true, timeout: 10000 })
    }
}
