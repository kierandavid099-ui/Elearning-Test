import ModulePage from './modulePage.page.js'

class CreditLoadsPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-core/credit_loads')
    }

    get newBtn() { return $('#btn-new-mdl-credit_load-modal') }
    get modal() { return $('#mdl-credit_load-modal') }
    get modalError() { return $('#div-credit_load-modal-error') }

    get semesterCodeSelect() { return $('#semester_code') }
    get levelSelect() { return $('#level') }
    get maxCreditLoadInput() { return $('#max_credit_load') }

    get saveBtn() { return $('#btn-save-mdl-credit_load-modal') }

    async openNewModal() {
        await this.newBtn.waitForDisplayed({ timeout: 5000 })
        await this.newBtn.click()
        await this.modal.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
    }
}

export default new CreditLoadsPage()
