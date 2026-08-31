import PersonModalPage from './personModal.page.js'

class CourseAdminPage extends PersonModalPage {
    constructor() {
        super({
            url: 'https://nda.scola.ng/scola-elearning/managers',
            newBtnSelector: '#btn-new-mdl-manager-modal',
            editBtnSelector: 'a.btn-edit-mdl-manager-modal',
            viewBtnSelector: 'a.btn-show-mdl-manager-modal',
            saveBtnSelector: '#btn-save-mdl-manager-modal',
            modalSelector: '#mdl-manager-modal',
        })
    }
}

export default new CourseAdminPage()
