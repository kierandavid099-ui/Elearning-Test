import ModulePage from './modulePage.page.js'

class BroadcastsPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-core/notifications')
    }

    get subtitle() { return $('.text-danger.d-none.d-md-flex') }
    get notificationsTable() { return $('#dataTableBuilder') }
    get tableHeaders() { return $$('#dataTableBuilder thead th') }
}

export default new BroadcastsPage()
