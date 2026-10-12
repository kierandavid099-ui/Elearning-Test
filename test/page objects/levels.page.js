import ModulePage from './modulePage.page.js'

class LevelsPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-core/levels')
    }

    get newLevelBtn() { return $('#btn-new-mdl-level-modal') }
    get modal() { return $('#mdl-level-modal') }
    get modalError() { return $('#div-level-modal-error') }
    get changeStudentLevelBtn() { return $('#btn-change-student-level-modal') }

    get nameInput() { return $('#name') }
    get levelInput() { return $('#level') }
    get saveBtn() { return $('#btn-save-mdl-level-modal') }

    async openNewModal() {
        await this.newLevelBtn.waitForDisplayed({ timeout: 5000 })
        await this.newLevelBtn.click()
        await this.modal.waitForDisplayed({ timeout: 5000 })
        await this.saveBtn.waitForDisplayed({ timeout: 8000 })
    }

    // Change Student Level isn't a modal: it opens a SweetAlert asking to move
    // ALL students up a level ("irreversible"). Only ever answer No here —
    // never use dismissSweetAlert(), which clicks Yes.
    get changeLevelAlert() { return $('.sweet-alert.showSweetAlert') }
    get changeLevelNoBtn() { return $('.sweet-alert.showSweetAlert button.cancel') }

    async openChangeStudentLevelAlert() {
        await this.changeStudentLevelBtn.waitForDisplayed({ timeout: 5000 })
        await this.changeStudentLevelBtn.click()
        await this.changeLevelAlert.waitForDisplayed({ timeout: 10000 })
    }

    async cancelChangeStudentLevel() {
        await this.changeLevelNoBtn.waitForClickable({ timeout: 5000 })
        await this.changeLevelNoBtn.click()
        await this.changeLevelAlert.waitForExist({ reverse: true, timeout: 5000 })
    }
}

export default new LevelsPage()
