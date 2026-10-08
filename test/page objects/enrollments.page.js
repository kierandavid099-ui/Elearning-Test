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

    rowXPath(studentName, className) {
        return `//div[contains(@class,"card") and contains(@class,"border-radius-0")][.//p[contains(text(),"${studentName}")]][.//p[contains(text(),"${className}")]]`
    }

    row(studentName, className) {
        return $(this.rowXPath(studentName, className))
    }

    statusOf(studentName, className) { return this.row(studentName, className).$('.card-text span') }
    approveBtn(studentName, className) { return this.row(studentName, className).$('.btn-approve-enrollment') }
    declineBtn(studentName, className) { return this.row(studentName, className).$('.btn-decline-enrollment') }
    viewBtn(studentName, className) { return this.row(studentName, className).$('.btn-show-mdl-enrollment-modal') }

    async confirmSweetAlert() {
        await this.sweetAlertConfirmBtn.waitForDisplayed({ timeout: 5000 })
        // The SweetAlert is visible as soon as it starts animating in; give it
        // a moment to fully render before clicking, like a person would.
        await browser.pause(3000)
        await this.sweetAlertConfirmBtn.click()
        await this.sweetAlertConfirmBtn.waitForExist({ reverse: true, timeout: 5000 })
        // Confirming kicks off the approve/decline AJAX call, but nothing in
        // the DOM signals when it finishes — no second SweetAlert, no spinner.
        // Reading the status column immediately after the click reads it
        // before the request lands, so give it a moment like a person would.
        await browser.pause(3000)
    }

    // The list is paginated (20 cards per page) and not strictly newest-first,
    // so a given card can be on any page. Click "Next" until it shows up or
    // the last page is reached. If it's still missing (e.g. we started part-way
    // through the list), reload back to page 1 and scan once more.
    async findRow(studentName, className) {
        // Counted via $$ rather than row().isDisplayed(), which throws a BiDi
        // "Invalid input in arguments/0" error on this WDIO version. Only the
        // current page's cards are in the DOM, so presence == on this page.
        const onThisPage = async () =>
            (await $$(this.rowXPath(studentName, className))).length > 0
        for (let attempt = 0; attempt < 2; attempt++) {
            if (attempt > 0) {
                await this.open()
                await browser.pause(3000)
            }
            if (await onThisPage()) return
            while (!(await this.isLastPage())) {
                await this.goToNextPage()
                if (await onThisPage()) return
            }
        }
    }

    async isLastPage() {
        return browser.execute(() => {
            const next = document.querySelector('#next-page')
            return !next || next.classList.contains('disabled')
        })
    }

    // A chart overlay sits over the top of the page and intercepts real
    // clicks, so "Next" is clicked through JS. Waits for the first card to
    // change so we don't check the old page's cards.
    async goToNextPage() {
        const firstCard = () => browser.execute(() => {
            const c = document.querySelector('div.card.border-radius-0')
            return c ? c.innerText : ''
        })
        const before = await firstCard()
        await browser.execute(() => document.querySelector('#next-page a').click())
        await browser.waitUntil(async () => (await firstCard()) !== before, {
            timeout: 10000,
            timeoutMsg: 'Enrollments list did not move to the next page',
        })
        await browser.pause(1000)
    }

    async approve(studentName, className) {
        await this.findRow(studentName, className)
        const btn = this.approveBtn(studentName, className)
        await btn.waitForDisplayed({ timeout: 5000 })
        await btn.click()
        await this.confirmSweetAlert()
    }

    async decline(studentName, className) {
        await this.findRow(studentName, className)
        const btn = this.declineBtn(studentName, className)
        await btn.waitForDisplayed({ timeout: 5000 })
        await btn.click()
        await this.confirmSweetAlert()
    }
}

export default new EnrollmentsPage()
