// At this machine's screen size (~1370px wide) the site starts with its
// sidebar collapsed to a 70px icon strip (`.wrapper.toggled`). In that state
// every submenu link has zero size, so WebdriverIO reports it as not
// displayed, and clicking where the eLearning header appears to be can land
// on a different menu entry. The sidebar only expands to full width
// (`.sidebar-hovered`) while the mouse is over it, so hover it before looking
// for a link and keep the mouse there until the click.
//
// The menu script (metisMenu) also auto-expands the eLearning group when the
// current page is one of its links, and clicking an already-open header
// collapses it again. So only click the header if the link isn't showing.
const SIDEBAR = '.sidebar-wrapper'
const ELEARNING = '#mnu_el_dashboard'

class Sidebar {

    get sidebar() { return $(SIDEBAR) }
    get elearningMenu() { return $(ELEARNING) }

    // The site's driver.js tour starts on every page load. Its overlay blocks
    // the hover that expands the sidebar, so close it before using the menu.
    get tourCloseBtn() { return $('.driver-popover-close-btn') }
    // From page load until the tour is closed the sidebar carries .tour-active,
    // which pins it open at 260px over the page whatever the mouse does.
    get tourSidebar() { return $('.sidebar-wrapper.tour-active') }

    async dismissTour(timeout = 3000) {
        // The popover shows ~1s after .tour-active is set, so wait for it
        // properly whenever the tour is still pending.
        if (await this.tourSidebar.isExisting()) timeout = Math.max(timeout, 3000)
        const shown = await this.tourCloseBtn.waitForDisplayed({ timeout }).catch(() => false)
        if (shown) {
            await this.tourCloseBtn.click()
            await this.tourCloseBtn.waitForDisplayed({ reverse: true, timeout: 5000 })
            await this.tourSidebar.waitForExist({ reverse: true, timeout: 3000 }).catch(() => {})
        }
        // Site bug (portal-tour.js): openSidebar() adds .tour-active plus an
        // inline width:260px/left:0, and closeSidebar() skips cleanup while the
        // tour still thinks it's in progress, so the sidebar can stay pinned
        // open with no tour showing. Clear the leftovers when no popover is up.
        await browser.execute(() => {
            const sb = document.querySelector('.sidebar-wrapper')
            if (sb && !document.querySelector('.driver-popover')) {
                sb.classList.remove('tour-active')
                sb.style.width = ''
                sb.style.left = ''
            }
        })
    }

    async expand() {
        await this.sidebar.waitForDisplayed({ timeout: 10000 })
        await this.dismissTour(500)
        await this.sidebar.moveTo()
        await browser.waitUntil(
            async () => (await $('.wrapper').getAttribute('class') || '').includes('sidebar-hovered')
                || !(await $('.wrapper').getAttribute('class') || '').includes('toggled'),
            { timeout: 3000, timeoutMsg: 'Sidebar did not expand on hover' }
        )
    }

    async goVia(itemSelector) {
        await browser.waitUntil(
            async () => (await browser.execute(() => document.readyState)) === 'complete',
            { timeout: 15000, timeoutMsg: 'Page did not finish loading' }
        )
        await this.elearningMenu.waitForExist({ timeout: 5000 })
        await this.expand()

        const item = $(itemSelector)
        if (!(await item.isDisplayed())) {
            await this.elearningMenu.click()
        }
        await item.waitForDisplayed({ timeout: 5000, timeoutMsg: `Sidebar item ${itemSelector} never became visible` })
        await item.click()
    }

    goToDashboard() { return this.goVia('#mnu_el_dashboard_index') }
    goToBroadcasts() { return this.goVia('#mnu_el_dashboard_notification_dashboard') }
    goToSettings() { return this.goVia('#mnu_el_dashboard_settings_dashboard') }
    goToWebsiteContent() { return this.goVia('#mnu_el_dashboard_web_content_dashboard') }
    goToCalendar() { return this.goVia('#mnu_el_dashboard_semester_dashboard') }
    goToAdministrators() { return this.goVia('#mnu_el_dashboard_managers') }
    goToInstructors() { return this.goVia('#mnu_el_dashboard_lecturers') }
    goToStudents() { return this.goVia('#mnu_el_dashboard_students') }
    goToLevels() { return this.goVia('#mnu_el_dashboard_level_dashboard') }
    goToCourses() { return this.goVia('#mnu_el_dashboard_classes') }
    goToCourseClasses() { return this.goVia('#mnu_el_dashboard_course_classes') }
    goToAssignedClasses() { return this.goVia('#mnu_el_dashboard_assigned_class') }
    goToArchives() { return this.goVia('#mnu_el_dashboard_archives') }
}

export default new Sidebar()
