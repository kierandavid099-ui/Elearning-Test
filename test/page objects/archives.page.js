import ModulePage from './modulePage.page.js'

// Read-only — no New/Edit/Delete actions confirmed on this page, only
// per-class "View" links, so no modal CRUD helpers here.
class ArchivesPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-elearning/dashboard/archives')
    }

    get heading() { return $('*=Class Archives') }
    get classCards() { return $$('.card') }
    viewLinkForClass(className) {
        return $(`//*[contains(text(), "${className}")]/ancestor::*[contains(@class,"card")][1]//*[contains(., "View")]`)
    }
}

export default new ArchivesPage()
