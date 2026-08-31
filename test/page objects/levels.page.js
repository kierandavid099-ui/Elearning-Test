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

    // Modal id isn't confirmed for this trigger, so — like the View modal
    // pattern elsewhere — wait for whichever Bootstrap modal is currently open.
    async openChangeStudentLevelModal() {
        await this.changeStudentLevelBtn.waitForDisplayed({ timeout: 5000 })
        await this.changeStudentLevelBtn.click()
        await this.openModal.waitForDisplayed({ timeout: 5000 })
    }
}

export default new LevelsPage()
