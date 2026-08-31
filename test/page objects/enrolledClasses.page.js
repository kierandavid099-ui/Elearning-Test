import ModulePage from './modulePage.page.js'

// Student-facing "My Classes" list — the counterpart to the admin's Classes
// module. The Enroll In Class modal uses plain <select> elements (not
// select2): picking a Department AJAX-loads that department's Classes into
// the second dropdown. Saving always lands the enrollment as Pending until a
// Course Admin approves/declines it from the Enrollments module.
class EnrolledClassesPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-elearning/enrolled-classes')
    }

    get enrollBtn() { return $('#btn-new-enrollment-modal') }
    get enrollModal() { return $('#mdl-enrolled-modal') }
    get departmentSelect() { return $('#department_id') }
    get classSelect() { return $('#courseClass_id') }
    get enrollSaveBtn() { return $('#save-mdl-enrollment') }
    get enrollErrorDiv() { return $('#div-enrollment-modal-error') }

    async openEnrollModal() {
        await this.enrollBtn.waitForDisplayed({ timeout: 5000 })
        await this.enrollBtn.click()
        await this.enrollModal.waitForDisplayed({ timeout: 5000 })
        await this.enrollSaveBtn.waitForDisplayed({ timeout: 8000 })
    }

    async selectDepartment(departmentId) {
        await this.departmentSelect.waitForDisplayed({ timeout: 5000 })
        await this.departmentSelect.selectByAttribute('value', departmentId)
        await browser.waitUntil(async () => (await this.classSelect.$$('option')).length > 1, {
            timeout: 5000,
            timeoutMsg: 'Class options did not load after selecting a department',
        })
    }

    async enroll(departmentId, className) {
        await this.openEnrollModal()
        await this.selectDepartment(departmentId)
        await this.classSelect.selectByVisibleText(className)
        await this.enrollSaveBtn.click()
        await this.enrollModal.waitForDisplayed({ reverse: true, timeout: 10000 })
    }
}

export default new EnrolledClassesPage()
