import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import CreditLoadsPage from '../../page objects/creditLoads.page.js'
import { COURSE_ADMIN_USER } from '../../helpers/testData.js'

// No confirmed delete path for a Credit Load yet — regression coverage
// inspects the modal thoroughly and closes without saving.

describe('REGRESSION (Course Admin) — Credit Load', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(COURSE_ADMIN_USER.email, COURSE_ADMIN_USER.password)
        await CreditLoadsPage.open()
    })

    describe('Page Load', () => {

        it('REG-CRL-001 | Credit Load page loads with the correct title', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Credit Load/i)
        })

        it('REG-CRL-002 | Breadcrumb shows Credit Load', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('critical')
            await expect(CreditLoadsPage.breadcrumb).toHaveText(/Credit Load/i)
        })

        it('REG-CRL-003 | New Credit Load button is visible and enabled', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('blocker')
            await expect(CreditLoadsPage.newBtn).toBeDisplayed()
            await expect(CreditLoadsPage.newBtn).not.toBeDisabled()
        })
    })

    describe('New Credit Load Modal', () => {

        before(async () => {
            await CreditLoadsPage.openNewModal()
        })

        it('REG-CRL-004 | Clicking New Credit Load opens the modal', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('blocker')
            await expect(CreditLoadsPage.modal).toBeDisplayed()
        })

        it('REG-CRL-005 | Error banner is hidden when modal first opens', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('normal')
            await expect(CreditLoadsPage.modalError).not.toBeDisplayed()
        })

        it('REG-CRL-006 | Semester Code select is present', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('critical')
            await expect(CreditLoadsPage.semesterCodeSelect).toBeExisting()
        })

        it('REG-CRL-007 | Level select is present', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('critical')
            await expect(CreditLoadsPage.levelSelect).toBeExisting()
        })

        it('REG-CRL-008 | Max Credit Load is a numeric field and empty', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('critical')
            await expect(CreditLoadsPage.maxCreditLoadInput).toBeDisplayed()
            expect(await CreditLoadsPage.maxCreditLoadInput.getAttribute('type')).toBe('number')
            expect(await CreditLoadsPage.maxCreditLoadInput.getValue()).toBe('')
        })

        it('REG-CRL-009 | Save button is present', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('blocker')
            await expect(CreditLoadsPage.saveBtn).toBeDisplayed()
        })

        it('REG-CRL-010 | Closing without saving dismisses the modal', async () => {
            addFeature('Course Admin Credit Load'); addSeverity('critical')
            await CreditLoadsPage.closeModal()
            await expect(CreditLoadsPage.openModal).not.toBeDisplayed()
        })
    })
})
