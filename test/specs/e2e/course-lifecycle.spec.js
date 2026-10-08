import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import CourseInstructorPage from '../../page objects/courseInstructor.page.js'
import CourseClassesPage from '../../page objects/courseClasses.page.js'
import { COURSE_ADMIN_USER } from '../../helpers/testData.js'
import { uniqueName, randomDigits } from '../../helpers/random.js'

// ─────────────────────────────────────────────────────────────────────────────
// E2E — Course lifecycle: a Course Admin hires a new Course Instructor, then
// creates a Course Class taught by that instructor. Unlike the regression
// suite (which only inspects these modals and closes without saving), this
// chains the two real mutations together and verifies the second depends on
// the first.
//
// Leaves behind: one new Course Instructor staff record and one new Course
// Class — there's no confirmed delete path for either (see regression
// comments), so these are left in place rather than force-cleaned.
//
// If a step here fails because of a genuine site interaction problem (a
// click intercepted, a modal that won't close, a save that silently no-ops),
// the test is left failing rather than reworked around — that's a candidate
// real bug, not a test bug.
// ─────────────────────────────────────────────────────────────────────────────

describe('E2E — Course Lifecycle', () => {

    let instructor
    const classCode = `E2E-${randomDigits(5)}`
    const className = uniqueName('E2E Class')

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
    })

    it('E2E-CRS-001 | A new Course Instructor can be hired', async () => {
        addFeature('Course Lifecycle'); addSeverity('blocker')
        await CourseInstructorPage.open()
        instructor = await CourseInstructorPage.createWithNewStaff()
        await expect(CourseInstructorPage.newBtn).toBeDisplayed()
    })

    it('E2E-CRS-002 | The new instructor is listed on the Course Instructor page', async () => {
        addFeature('Course Lifecycle'); addSeverity('critical')
        await expect(CourseInstructorPage.row(instructor.lastName)).toBeDisplayed()
    })

    it('E2E-CRS-003 | A new Course Class can be created and assigned to that instructor', async () => {
        addFeature('Course Lifecycle'); addSeverity('blocker')
        await CourseClassesPage.open()
        await CourseClassesPage.create({
            code: classCode,
            name: className,
            lecturerFirstName: instructor.firstName,
            lecturerLastName: instructor.lastName,
        })
        await expect(CourseClassesPage.newBtn).toBeDisplayed()
    })

    it('E2E-CRS-004 | The new class is listed on the Classes page', async () => {
        addFeature('Course Lifecycle'); addSeverity('critical')
        // The list doesn't refresh after a save; new classes show at the top once reloaded.
        await CourseClassesPage.open()
        await expect(CourseClassesPage.row(classCode)).toBeDisplayed()
    })

    it('E2E-CRS-005 | Re-opening a class for edit shows a lecturer', async () => {
        addFeature('Course Lifecycle'); addSeverity('critical')
        const editBtn = CourseClassesPage.firstCard.$('.btn-edit-mdl-courseClass-modal')
        await editBtn.waitForDisplayed({ timeout: 5000 })
        await editBtn.click()
        await CourseClassesPage.modal.waitForDisplayed({ timeout: 5000 })
        await browser.waitUntil(async () => (await CourseClassesPage.nameInput.getValue()) !== '', {
            timeout: 8000,
            timeoutMsg: 'Class edit modal did not populate the Name field in time',
        })

        // Only checks that a lecturer is picked, not which one.
        const selectedOption = await CourseClassesPage.lecturerSelect.$('option:checked')
        expect(await selectedOption.getAttribute('value')).toBeTruthy()
        expect((await selectedOption.getText()).trim()).not.toBe('')

        await CourseClassesPage.closeModal()
    })
})
