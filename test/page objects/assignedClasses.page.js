import ModulePage from './modulePage.page.js'

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

    async openFilterModal() {
        await this.filterBtn.waitForDisplayed({ timeout: 5000 })
        await this.filterBtn.click()
        await this.filterModal.waitForDisplayed({ timeout: 5000 })
    }
}

export default new AssignedClassesPage()
