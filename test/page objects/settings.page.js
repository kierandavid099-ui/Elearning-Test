import ModulePage from './modulePage.page.js'

class SettingsPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-elearning/settings')
    }

    get backToDashboardLink() { return $('a=Back to Dashboard') }

    get basicSettingsTab() { return $('a=Basic Settings') }
    get landingPageBackgroundTab() { return $('a=Landing Page Background') }
    get landingPageGraphicsTab() { return $('a=Landing Page Graphics') }
    get learningMechanismTab() { return $('a=Learning Mechanism') }
    get saveBtn() { return $('#btn-save-mdl-setting-modal') }
}

export default new SettingsPage()
