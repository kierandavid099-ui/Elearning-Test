import ModulePage from './modulePage.page.js'

class DashboardPage extends ModulePage {
    constructor() {
        super('https://nda.scola.ng/scola-elearning/dashboard')
    }

    get newAnnouncementBtn() { return $('#btn-new-mdl-announcement-modal') }
    get newCourseClassBtn() { return $('#btn-new-mdl-courseClass-modal') }
    get newCalendarEntryBtn() { return $('#btn-new-mdl-calendarEntry-modal') }
    get newCourseBtn() { return $('#btn-new-mdl-course-modal') }

    // Stat cards have no ids — anchor off the label heading and read the sibling value
    statCardValue(label) { return $(`//h5[text()="${label}"]/following-sibling::h3`) }
    get studentsCount() { return this.statCardValue('STUDENTS') }
    get onlineClassesCount() { return this.statCardValue('ONLINE CLASSES') }
    get courseCatalogCount() { return this.statCardValue('COURSE CATALOG') }

    get announcementsHeading() { return $('h6.card-title=Announcements') }
    get classesHeading() { return $('h6.card-title=Classes') }

    // Student view of this same dashboard swaps the admin's stat cards for
    // these two instead.
    get enrolledClassesCount() { return this.statCardValue('ENROLLED CLASSES') }
    get pendingEnrollmentsCount() { return this.statCardValue('PENDING ENROLLMENTS') }
}

export default new DashboardPage()
