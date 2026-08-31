import PersonModalPage from './personModal.page.js'

class CourseInstructorPage extends PersonModalPage {
    constructor() {
        super({
            url: 'https://nda.scola.ng/scola-elearning/lecturers',
            newBtnSelector: '#btn-new-mdl-lecturer-modal',
            editBtnSelector: 'a.btn-edit-mdl-lecturer-modal[title="Edit"]',
            viewBtnSelector: 'a.btn-show-mdl-lecturer-modal',
            saveBtnSelector: '#btn-save-mdl-lecturer-modal',
            modalSelector: '#mdl-lecturer-modal',
        })
    }

    // kept for backward compatibility with existing callers
    get newInstructorBtn() { return this.newBtn }
    async createInstructor(name) { return this.create(name) }
}

export default new CourseInstructorPage()
