import ModulePage from './modulePage.page.js'

// Each enrollment renders as its own bordered card (student name, class name,
// status, and action icons) rather than a table row. Pending rows get inline
// approve (check)/decline (cross) icons alongside the always-present View
// (eye) icon; Active/Declined rows only show View. Approve/decline both
// require confirming a SweetAlert ("Are you sure...? No/Yes") before the
// status column updates.
class EnrollmentsPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-elearning/enrollments')
    }

    get allFilter() { return $('*=All') }
    get activeFilter() { return $('*=Active') }
    get pendingFilter() { return $('*=Pending') }
    get declinedFilter() { return $('*=Declined') }

    get sweetAlertConfirmBtn() { return $('.sweet-alert.showSweetAlert button.confirm') }

    row(studentName, className) {
        return $(`//div[contains(@class,"card") and contains(@class,"border-radius-0")][.//p[contains(text(),"${studentName}")]][.//p[contains(text(),"${className}")]]`)
    }

    statusOf(studentName, className) { return this.row(studentName, className).$('.card-text span') }
    approveBtn(studentName, className) { return this.row(studentName, className).$('.btn-approve-enrollment') }
    declineBtn(studentName, className) { return this.row(studentName, className).$('.btn-decline-enrollment') }
    viewBtn(studentName, className) { return this.row(studentName, className).$('.btn-show-mdl-enrollment-modal') }

    async confirmSweetAlert() {
        await this.sweetAlertConfirmBtn.waitForDisplayed({ timeout: 5000 })
        await this.sweetAlertConfirmBtn.click()
        await this.sweetAlertConfirmBtn.waitForExist({ reverse: true, timeout: 5000 })
    }

    async approve(studentName, className) {
        const btn = this.approveBtn(studentName, className)
        await btn.waitForDisplayed({ timeout: 5000 })
        await btn.click()
        await this.confirmSweetAlert()
    }

    async decline(studentName, className) {
        const btn = this.declineBtn(studentName, className)
        await btn.waitForDisplayed({ timeout: 5000 })
        await btn.click()
        await this.confirmSweetAlert()
    }
}

export default new EnrollmentsPage()
