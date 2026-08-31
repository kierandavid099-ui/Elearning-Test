import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import LevelsPage from '../../page objects/levels.page.js'
import { ADMIN_USER } from '../../helpers/testData.js'

// Level creation isn't exercised end-to-end here — no confirmed delete path
// yet. Regression coverage inspects the modal and closes without saving.

describe('REGRESSION — Levels', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await LevelsPage.open()
    })

    describe('Page Load', () => {

        it('REG-LVL-001 | Levels page loads with the correct title', async () => {
            addFeature('Levels'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Level/i)
        })

        it('REG-LVL-002 | Breadcrumb shows Level', async () => {
            addFeature('Levels'); addSeverity('critical')
            await expect(LevelsPage.breadcrumb).toHaveText(/Level/i)
        })

        it('REG-LVL-003 | New Level button is visible and enabled', async () => {
            addFeature('Levels'); addSeverity('blocker')
            await expect(LevelsPage.newLevelBtn).toBeDisplayed()
            await expect(LevelsPage.newLevelBtn).not.toBeDisabled()
        })
    })

    describe('New Level Modal', () => {

        before(async () => {
            await LevelsPage.openNewModal()
        })

        it('REG-LVL-004 | Clicking New Level opens the modal', async () => {
            addFeature('Levels'); addSeverity('blocker')
            await expect(LevelsPage.modal).toBeDisplayed()
        })

        it('REG-LVL-005 | Error banner is hidden when modal first opens', async () => {
            addFeature('Levels'); addSeverity('normal')
            await expect(LevelsPage.modalError).not.toBeDisplayed()
        })

        it('REG-LVL-006 | Name field is present and empty', async () => {
            addFeature('Levels'); addSeverity('critical')
            await expect(LevelsPage.nameInput).toBeDisplayed()
            expect(await LevelsPage.nameInput.getValue()).toBe('')
        })

        it('REG-LVL-007 | Level field is present, numeric and empty', async () => {
            addFeature('Levels'); addSeverity('critical')
            await expect(LevelsPage.levelInput).toBeDisplayed()
            expect(await LevelsPage.levelInput.getAttribute('type')).toBe('number')
            expect(await LevelsPage.levelInput.getValue()).toBe('')
        })

        it('REG-LVL-008 | Save button is present', async () => {
            addFeature('Levels'); addSeverity('blocker')
            await expect(LevelsPage.saveBtn).toBeDisplayed()
        })

        it('REG-LVL-009 | Closing without saving dismisses the modal', async () => {
            addFeature('Levels'); addSeverity('critical')
            await LevelsPage.closeModal()
            await expect(LevelsPage.openModal).not.toBeDisplayed()
        })
    })

    describe('Change Student Level Modal', () => {

        before(async () => {
            await LevelsPage.openChangeStudentLevelModal()
        })

        it('REG-LVL-010 | Clicking Change Student Level opens a modal', async () => {
            addFeature('Levels'); addSeverity('critical')
            await expect(LevelsPage.openModal).toBeDisplayed()
        })

        it('REG-LVL-011 | Closing without saving dismisses the modal', async () => {
            addFeature('Levels'); addSeverity('critical')
            await LevelsPage.closeModal()
            await expect(LevelsPage.openModal).not.toBeDisplayed()
        })
    })
})
