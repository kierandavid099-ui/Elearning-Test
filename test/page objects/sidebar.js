class Sidebar {

    get elearningMenu() { return $('#mnu_el_dashboard') }
    get dashboardMenu() { return $('#mnu_el_dashboard_index') }
    get broadcastsMenu() { return $('#mnu_el_dashboard_notification_dashboard') }
    get settingsMenu() { return $('#mnu_el_dashboard_settings_dashboard') }
    get websiteContentMenu() { return $('#mnu_el_dashboard_web_content_dashboard') }
    get calendarMenu() { return $('#mnu_el_dashboard_semester_dashboard') }
    get administratorsMenu() { return $('#mnu_el_dashboard_managers') }
    get instructorsMenu() { return $('#mnu_el_dashboard_lecturers') }
    get studentsMenu() { return $('#mnu_el_dashboard_students') }
    get levelsMenu() { return $('#mnu_el_dashboard_level_dashboard') }
    get coursesMenu() { return $('#mnu_el_dashboard_classes') }
    get courseClassesMenu() { return $('#mnu_el_dashboard_course_classes') }
    get assignedClassesMenu() { return $('#mnu_el_dashboard_assigned_class') }
    get archivesMenu() { return $('#mnu_el_dashboard_archives') }

    async goToAdministrators() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.administratorsMenu.waitForDisplayed({ timeout: 5000 })
        await this.administratorsMenu.click()
    }

    async goToInstructors() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.instructorsMenu.waitForDisplayed({ timeout: 5000 })
        await this.instructorsMenu.click()
    }

    async goToAssignedClasses() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.assignedClassesMenu.waitForDisplayed({ timeout: 5000 })
        await this.assignedClassesMenu.click()
    }

    async goToArchives() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.archivesMenu.waitForDisplayed({ timeout: 5000 })
        await this.archivesMenu.click()
    }

    async goToDashboard() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.dashboardMenu.waitForDisplayed({ timeout: 5000 })
        await this.dashboardMenu.click()
    }

    async goToBroadcasts() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.broadcastsMenu.waitForDisplayed({ timeout: 5000 })
        await this.broadcastsMenu.click()
    }

    async goToSettings() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.settingsMenu.waitForDisplayed({ timeout: 5000 })
        await this.settingsMenu.click()
    }

    async goToWebsiteContent() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.websiteContentMenu.waitForDisplayed({ timeout: 5000 })
        await this.websiteContentMenu.click()
    }

    async goToCalendar() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.calendarMenu.waitForDisplayed({ timeout: 5000 })
        await this.calendarMenu.click()
    }

    async goToStudents() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.studentsMenu.waitForDisplayed({ timeout: 5000 })
        await this.studentsMenu.click()
    }

    async goToLevels() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.levelsMenu.waitForDisplayed({ timeout: 5000 })
        await this.levelsMenu.click()
    }

    async goToCourses() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.coursesMenu.waitForDisplayed({ timeout: 5000 })
        await this.coursesMenu.click()
    }

    async goToCourseClasses() {
        await this.elearningMenu.waitForDisplayed({ timeout: 5000 })
        await this.elearningMenu.click()

        await this.courseClassesMenu.waitForDisplayed({ timeout: 5000 })
        await this.courseClassesMenu.click()
    }
}

export default new Sidebar()
