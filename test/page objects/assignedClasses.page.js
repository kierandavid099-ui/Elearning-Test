import ModulePage from './modulePage.page.js'
import Sidebar from './sidebar.js'

// Read-only list for instructors — classes they're assigned to teach.
// No New/Delete here; the real CRUD surface is the class workspace each
// row's "View" link opens into (see courseClassWorkspace.page.js).
class AssignedClassesPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-elearning/assignedClasses')
    }

    get filterBtn() { return $('a*=Filter') }
    get filterModal() { return $('[id^="mdl-cdv_"][id*="filter-modal"]') }
    get filterApplyBtn() { return $('[id^="btn-save-mdl-cdv_"]') }
    get filterResetBtn() { return $('[id^="btn-reset-mdl-cdv_"]') }

    get viewLinks() { return $$('a[href*="/scola-elearning/courseClasses/"]') }
    get firstViewLink() { return $('a[href*="/scola-elearning/courseClasses/"]') }

    // The site tour pops up after load and its overlay covers the whole page.
    async openFilterModal() {
        await this.filterBtn.waitForDisplayed({ timeout: 5000 })
        await Sidebar.dismissTour()
        await this.filterBtn.click()
        await this.filterModal.waitForDisplayed({ timeout: 5000 })
    }

    // The × click is sometimes lost (tour overlay or the modal still fading
    // in) and the modal then blocks the rest of the page, so retry until it
    // has actually gone.
    async closeFilterModal() {
        await browser.waitUntil(async () => {
            if (await this.filterModal.isDisplayed()) {
                await Sidebar.dismissTour(500)
                await this.closeModalBtn.click().catch(() => {})
                await this.filterModal.waitForDisplayed({ reverse: true, timeout: 3000 }).catch(() => {})
            }
            return !(await this.filterModal.isDisplayed())
        }, { timeout: 15000, interval: 500, timeoutMsg: 'Filter modal did not close' })
    }

    // The tour can come back after the filter modal closes, so keep closing
    // it and clicking until the workspace actually opens.
    async openFirstClass() {
        await this.firstViewLink.waitForDisplayed({ timeout: 5000 })
        await browser.waitUntil(async () => {
            if (!(await browser.getUrl()).includes('/scola-elearning/courseClasses/')) {
                await Sidebar.dismissTour(1000)
                await this.firstViewLink.click().catch(() => {})
            }
            return (await browser.getUrl()).includes('/scola-elearning/courseClasses/')
        }, { timeout: 20000, interval: 1000, timeoutMsg: 'Class workspace did not open' })
    }
}

export default new AssignedClassesPage()
