import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import EnrollmentsPage from '../../page objects/enrollments.page.js'
import { COURSE_ADMIN_USER, STUDENT_FULL_NAME, ENROLL_CLASS_TO_APPROVE, ENROLL_CLASS_TO_DECLINE } from '../../helpers/testData.js'

// Reflects the result of the manual enroll -> approve/decline pass already
// run against the live site: Liam Clark's Giacomo Fletcher request was
// approved (Active) and his Glenna Fisher request was declined (Declined).

describe('REGRESSION (Course Admin) — Enrollments', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
        await EnrollmentsPage.open()
    })

    it('REG-CA-ENR-001 | Enrollments list is displayed with status filters', async () => {
        addFeature('Course Admin Enrollments'); addSeverity('critical')
        await expect(EnrollmentsPage.allFilter).toBeDisplayed()
        await expect(EnrollmentsPage.pendingFilter).toBeDisplayed()
    })

    it('REG-CA-ENR-002 | Liam Clark is listed against the approved class', async () => {
        addFeature('Course Admin Enrollments'); addSeverity('critical')
        await EnrollmentsPage.findRow(STUDENT_FULL_NAME, ENROLL_CLASS_TO_APPROVE)
        await expect(EnrollmentsPage.row(STUDENT_FULL_NAME, ENROLL_CLASS_TO_APPROVE)).toBeDisplayed()
    })

    it('REG-CA-ENR-003 | The approved enrollment shows as Active', async () => {
        addFeature('Course Admin Enrollments'); addSeverity('blocker')
        await EnrollmentsPage.findRow(STUDENT_FULL_NAME, ENROLL_CLASS_TO_APPROVE)
        const status = await EnrollmentsPage.statusOf(STUDENT_FULL_NAME, ENROLL_CLASS_TO_APPROVE).getText()
        expect(status.trim()).toBe('Active')
    })

    it('REG-CA-ENR-004 | Liam Clark is listed against the declined class', async () => {
        addFeature('Course Admin Enrollments'); addSeverity('critical')
        await EnrollmentsPage.findRow(STUDENT_FULL_NAME, ENROLL_CLASS_TO_DECLINE)
        await expect(EnrollmentsPage.row(STUDENT_FULL_NAME, ENROLL_CLASS_TO_DECLINE)).toBeDisplayed()
    })

    it('REG-CA-ENR-005 | The declined enrollment shows as Declined', async () => {
        addFeature('Course Admin Enrollments'); addSeverity('blocker')
        await EnrollmentsPage.findRow(STUDENT_FULL_NAME, ENROLL_CLASS_TO_DECLINE)
        const status = await EnrollmentsPage.statusOf(STUDENT_FULL_NAME, ENROLL_CLASS_TO_DECLINE).getText()
        expect(status.trim()).toBe('Declined')
    })
})
