import ModulePage from './modulePage.page.js'

class WebsiteContentPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-elearning/website-content')
    }

    get backToDashboardLink() { return $('a=Back to Dashboard') }

    get landingPageContentTab() { return $('a=Landing Page Content') }
    get otherPagesTab() { return $('a=Other Pages') }

    // The live trigger's id embeds a per-load component instance number
    // (btn-ate_<n>-add-new-page), so match on its stable text instead.
    get addNewPageLink() { return $('a*=Add New Pages') }

    async openAddNewPageModal() {
        await this.otherPagesTab.click()
        await this.addNewPageLink.waitForDisplayed({ timeout: 5000 })
        await this.addNewPageLink.click()
        await this.openModal.waitForDisplayed({ timeout: 5000 })
    }

    // The New Page form's exact field ids aren't confirmed (regression only
    // ever inspects the entry point, never opens this modal), so this fills
    // whatever text/textarea/select controls the currently-open modal
    // actually renders rather than assuming specific ids. Adds a brand-new
    // page — never edits or removes existing published content.
    async fillAndSaveNewPage(title) {
        const modal = this.openModal
        await modal.waitForDisplayed({ timeout: 5000 })

        const textInputs = await modal.$$('input[type="text"]:not([disabled]), input:not([type]):not([disabled])')
        for (let i = 0; i < textInputs.length; i++) {
            await textInputs[i].setValue(i === 0 ? title : `${title} ${i}`)
        }

        const textareas = await modal.$$('textarea:not([disabled])')
        for (const textarea of textareas) {
            await textarea.setValue('Test content added by automated e2e coverage.')
        }

        const selects = await modal.$$('select:not([disabled])')
        for (const select of selects) {
            const options = await select.$$('option')
            for (const option of options) {
                const value = await option.getAttribute('value')
                if (value) {
                    await select.selectByAttribute('value', value)
                    break
                }
            }
        }

        const saveBtn = modal.$('button[id^="btn-save"], button[type="submit"]')
        await saveBtn.waitForDisplayed({ timeout: 5000 })
        await saveBtn.click()
        await this.dismissSweetAlert()
        await this.openModal.waitForDisplayed({ reverse: true, timeout: 10000 })
    }
}

export default new WebsiteContentPage()
