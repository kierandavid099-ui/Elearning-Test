// Shared shape for simple Elearning module pages that smoke tests only need
// to load and inspect — no modal CRUD flows (see personModal.page.js for that).
import Sidebar from './sidebar.js'

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
    // The handling (including the pinned-sidebar site bug) lives in sidebar.js.
    get tourCloseBtn() { return $('.driver-popover-close-btn') }

    dismissTour(timeout = 3000) {
        return Sidebar.dismissTour(timeout)
    }

    // Generic modal helpers for the confirmed-safe-to-inspect "New" modals
    // (Calendar, Students, Levels). Deliberately no save/create helper here —
    // these entities don't have a confirmed delete path yet, so regression
    // tests open, inspect, and close without persisting anything.
    get openModal() { return $('.modal.show') }
    get closeModalBtn() { return $('.modal.show button.btn-close') }

    // The × click is sometimes lost (tour overlay, or the modal still fading
    // in) and the open modal then blocks every later click on the page, so
    // keep clicking the visible modal's × until it has actually gone.
    async closeModal() {
        await this.closeModalBtn.waitForClickable({ timeout: 5000 })
        const id = await browser.execute(() => [...document.querySelectorAll('.modal.show')]
            .find(m => getComputedStyle(m).display !== 'none')?.id)
        if (!id) return
        const modal = $(`#${id}`)
        await browser.waitUntil(async () => {
            if (await modal.isDisplayed()) {
                await this.dismissTour(500)
                await modal.$('button.btn-close').click().catch(() => {})
                await modal.waitForDisplayed({ reverse: true, timeout: 3000 }).catch(() => {})
            }
            return !(await modal.isDisplayed())
        }, { timeout: 15000, interval: 500, timeoutMsg: 'Modal did not close' })
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
