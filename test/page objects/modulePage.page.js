// Shared shape for simple Elearning module pages that smoke tests only need
// to load and inspect — no modal CRUD flows (see personModal.page.js for that).
export default class ModulePage {

    constructor(url) {
        this.url = url
    }

    get breadcrumb() { return $('.breadcrumb-title, .page-title, .breadcrumb') }

    async open() {
        await browser.url(this.url)
        await this.breadcrumb.waitForDisplayed({ timeout: 10000 })
        await this.dismissTour()
    }

    // The site sometimes opens a "Welcome to Invoice Manager" tour pop-up that
    // sits over the page and blocks typing into forms. Close it as a person would.
    get tourCloseBtn() { return $('.driver-popover-close-btn') }

    async dismissTour() {
        const shown = await this.tourCloseBtn.waitForDisplayed({ timeout: 3000 }).catch(() => false)
        if (shown) {
            await this.tourCloseBtn.click()
            await this.tourCloseBtn.waitForDisplayed({ reverse: true, timeout: 5000 })
        }
    }

    // Generic modal helpers for the confirmed-safe-to-inspect "New" modals
    // (Calendar, Students, Levels). Deliberately no save/create helper here —
    // these entities don't have a confirmed delete path yet, so regression
    // tests open, inspect, and close without persisting anything.
    get openModal() { return $('.modal.show') }
    get closeModalBtn() { return $('.modal.show button.btn-close') }

    async closeModal() {
        await this.closeModalBtn.waitForClickable({ timeout: 5000 })
        await this.closeModalBtn.click()
        await this.openModal.waitForDisplayed({ reverse: true, timeout: 8000 })
    }

    // Same SweetAlert-confirmation pattern used by personModal.page.js and
    // courseClassWorkspace.page.js — real Save actions on these "inspect only"
    // pages weren't exercised until the e2e suite, so this wasn't needed here
    // before now. No-ops (via the timeout+catch) if no alert appears.
    get sweetAlertConfirmBtn() { return $('.sweet-alert.showSweetAlert button.confirm') }

    async dismissSweetAlert(timeout = 3000) {
        const appeared = await this.sweetAlertConfirmBtn.waitForDisplayed({ timeout }).catch(() => false)
        if (appeared) {
            await this.sweetAlertConfirmBtn.click()
            await this.sweetAlertConfirmBtn.waitForExist({ reverse: true, timeout: 5000 })
        }
    }
}
