import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import AnnouncementsPage from '../../page objects/announcements.page.js'
import { COURSE_ADMIN_USER } from '../../helpers/testData.js'

// As with Calendar/Levels/Students in the Admin regression suite, Announcement
// creation isn't exercised end-to-end here — no confirmed delete path yet.
// Regression coverage inspects the modal thoroughly and closes without saving.

describe('REGRESSION (Course Admin) — Announcements', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
        await AnnouncementsPage.open()
    })

    describe('Page Load', () => {

        it('REG-ANN-001 | Announcements page loads with the correct title', async () => {
            addFeature('Course Admin Announcements'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Announcement/i)
        })

        it('REG-ANN-002 | Breadcrumb shows Announcement', async () => {
            addFeature('Course Admin Announcements'); addSeverity('critical')
            await expect(AnnouncementsPage.breadcrumb).toHaveText(/Announcement/i)
        })

        it('REG-ANN-003 | New Announcement button is visible and enabled', async () => {
            addFeature('Course Admin Announcements'); addSeverity('blocker')
            await expect(AnnouncementsPage.newBtn).toBeDisplayed()
            await expect(AnnouncementsPage.newBtn).not.toBeDisabled()
        })
    })

    describe('New Announcement Modal', () => {

        before(async () => {
            await AnnouncementsPage.openNewModal()
        })

        it('REG-ANN-004 | Clicking New Announcement opens the modal', async () => {
            addFeature('Course Admin Announcements'); addSeverity('blocker')
            await expect(AnnouncementsPage.modal).toBeDisplayed()
        })

        it('REG-ANN-005 | Error banner is hidden when modal first opens', async () => {
            addFeature('Course Admin Announcements'); addSeverity('normal')
            await expect(AnnouncementsPage.modalError).not.toBeDisplayed()
        })

        it('REG-ANN-006 | Headline field is present and empty', async () => {
            addFeature('Course Admin Announcements'); addSeverity('critical')
            await expect(AnnouncementsPage.headlineInput).toBeDisplayed()
            expect(await AnnouncementsPage.headlineInput.getValue()).toBe('')
        })

        it('REG-ANN-007 | Start Date and End Date are date inputs', async () => {
            addFeature('Course Admin Announcements'); addSeverity('critical')
            await expect(AnnouncementsPage.startDateInput).toBeDisplayed()
            await expect(AnnouncementsPage.endDateInput).toBeDisplayed()
            expect(await AnnouncementsPage.startDateInput.getAttribute('type')).toBe('date')
            expect(await AnnouncementsPage.endDateInput.getAttribute('type')).toBe('date')
        })

        it('REG-ANN-008 | Description field is present', async () => {
            addFeature('Course Admin Announcements'); addSeverity('critical')
            await expect(AnnouncementsPage.descriptionInput).toBeDisplayed()
        })

        it('REG-ANN-009 | Course Class select is present', async () => {
            addFeature('Course Admin Announcements'); addSeverity('normal')
            await expect(AnnouncementsPage.courseClassSelect).toBeExisting()
        })

        it('REG-ANN-010 | Audience radios default to All', async () => {
            addFeature('Course Admin Announcements'); addSeverity('critical')
            await expect(AnnouncementsPage.audienceAllRadio).toBeChecked()
            await expect(AnnouncementsPage.audienceLecturerRadio).not.toBeChecked()
            await expect(AnnouncementsPage.audienceStudentRadio).not.toBeChecked()
        })

        it('REG-ANN-011 | Selecting the Lecturer audience updates the checked radio', async () => {
            addFeature('Course Admin Announcements'); addSeverity('normal')
            await AnnouncementsPage.audienceLecturerRadio.click()
            await expect(AnnouncementsPage.audienceLecturerRadio).toBeChecked()
        })

        it('REG-ANN-012 | File attachment input is present', async () => {
            addFeature('Course Admin Announcements'); addSeverity('normal')
            await expect(AnnouncementsPage.fileInput).toBeExisting()
        })

        it('REG-ANN-013 | Save button is present', async () => {
            addFeature('Course Admin Announcements'); addSeverity('blocker')
            await expect(AnnouncementsPage.saveBtn).toBeDisplayed()
        })

        it('REG-ANN-014 | Closing without saving dismisses the modal', async () => {
            addFeature('Course Admin Announcements'); addSeverity('critical')
            await AnnouncementsPage.closeModal()
            await expect(AnnouncementsPage.openModal).not.toBeDisplayed()
        })
    })
})
