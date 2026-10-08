import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import StudentsPage from '../../page objects/students.page.js'
import { ADMIN_USER } from '../../helpers/testData.js'
import { uniqueName, randomEmail, randomPhone, randomDigits } from '../../helpers/random.js'

// ─────────────────────────────────────────────────────────────────────────────
// E2E — Student lifecycle: an Admin creates a brand-new Student record and
// confirms it actually persists and appears in the live Students table.
// Regression only inspects the New Student modal and closes it without
// saving; this exercises the real Save path.
//
// Leaves behind: one new Student record — no confirmed delete path exists.
// ─────────────────────────────────────────────────────────────────────────────

describe('E2E — Student Lifecycle', () => {

    const suffix = uniqueName('e2e')
    const student = {
        firstName: `First-${suffix}`,
        lastName: `Last-${suffix}`,
        email: randomEmail('e2e-student'),
        telephone: randomPhone(),
        dateOfBirth: '2000-01-01',
        matriculationNumber: `E2E${randomDigits(6)}`,
    }

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await StudentsPage.open()
    })

    it('E2E-STU-001 | A new Student can be created with Bio Details and Address', async () => {
        addFeature('Student Lifecycle'); addSeverity('blocker')
        await StudentsPage.create(student)
        await expect(StudentsPage.newStudentBtn).toBeDisplayed()
    })

    it('E2E-STU-002 | The new Student is listed on the Students page', async () => {
        addFeature('Student Lifecycle'); addSeverity('critical')
        // The list is paginated and doesn't refresh after a save, so reload and search.
        await StudentsPage.open()
        await StudentsPage.search(student.lastName)
        await expect(StudentsPage.row(student.lastName)).toBeDisplayed()
    })
})
