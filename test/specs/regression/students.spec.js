import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import StudentsPage from '../../page objects/students.page.js'
import { ADMIN_USER } from '../../helpers/testData.js'

// As with Calendar, Student creation isn't exercised end-to-end here — no
// confirmed delete path yet. Regression coverage inspects both modal tabs
// thoroughly and closes without saving.

describe('REGRESSION — Students', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await StudentsPage.open()
    })

    describe('Page Load', () => {

        it('REG-STU-001 | Students page loads with the correct title', async () => {
            addFeature('Students'); addSeverity('blocker')
            await expect(browser).toHaveTitle(/Student/i)
        })

        it('REG-STU-002 | Breadcrumb shows Student', async () => {
            addFeature('Students'); addSeverity('critical')
            await expect(StudentsPage.breadcrumb).toHaveText(/Student/i)
        })

        it('REG-STU-003 | New Student button is visible and enabled', async () => {
            addFeature('Students'); addSeverity('blocker')
            await expect(StudentsPage.newStudentBtn).toBeDisplayed()
            await expect(StudentsPage.newStudentBtn).not.toBeDisabled()
        })
    })

    describe('New Student Modal — Bio Details', () => {

        before(async () => {
            await StudentsPage.openNewModal()
        })

        it('REG-STU-004 | Clicking New Student opens the modal on the Bio Details tab', async () => {
            addFeature('Students'); addSeverity('blocker')
            await expect(StudentsPage.modal).toBeDisplayed()
            const tabClass = await StudentsPage.bioDetailsTab.getAttribute('class')
            expect(tabClass).toContain('active')
        })

        it('REG-STU-005 | Error banner is hidden when modal first opens', async () => {
            addFeature('Students'); addSeverity('normal')
            await expect(StudentsPage.modalError).not.toBeDisplayed()
        })

        it('REG-STU-006 | Name fields (First, Last, Other Names) are present', async () => {
            addFeature('Students'); addSeverity('critical')
            await expect(StudentsPage.firstNameInput).toBeDisplayed()
            await expect(StudentsPage.lastNameInput).toBeDisplayed()
            await expect(StudentsPage.middleNameInput).toBeDisplayed()
        })

        it('REG-STU-007 | Email, Telephone and Date of Birth fields are present', async () => {
            addFeature('Students'); addSeverity('critical')
            await expect(StudentsPage.emailInput).toBeDisplayed()
            expect(await StudentsPage.emailInput.getAttribute('type')).toBe('email')
            await expect(StudentsPage.telephoneInput).toBeDisplayed()
            await expect(StudentsPage.dateOfBirthInput).toBeDisplayed()
            expect(await StudentsPage.dateOfBirthInput.getAttribute('type')).toBe('date')
        })

        it('REG-STU-008 | Gender select offers multiple options', async () => {
            addFeature('Students'); addSeverity('critical')
            await expect(StudentsPage.genderSelect).toBeDisplayed()
            const options = await StudentsPage.genderSelect.$$('option')
            expect(options.length).toBeGreaterThan(1)
        })

        it('REG-STU-009 | Matriculation Number, Jamb Number and National ID fields are present', async () => {
            addFeature('Students'); addSeverity('critical')
            await expect(StudentsPage.matriculationNumberInput).toBeDisplayed()
            await expect(StudentsPage.jambNumberInput).toBeDisplayed()
            await expect(StudentsPage.nationalIdInput).toBeDisplayed()
        })

        it('REG-STU-010 | Department, Level, Program and Admission Year selects are present', async () => {
            addFeature('Students'); addSeverity('critical')
            await expect(StudentsPage.departmentSelect).toBeExisting()
            await expect(StudentsPage.levelSelect).toBeExisting()
            await expect(StudentsPage.admittedProgramSelect).toBeDisplayed()
            await expect(StudentsPage.admissionYearSelect).toBeExisting()
        })
    })

    describe('New Student Modal — Address', () => {

        it('REG-STU-011 | Switching to the Address tab reveals address fields', async () => {
            addFeature('Students'); addSeverity('critical')
            await StudentsPage.addressTab.click()
            await expect(StudentsPage.addressStreetInput).toBeDisplayed()
            await expect(StudentsPage.addressTownInput).toBeDisplayed()
            await expect(StudentsPage.addressStateInput).toBeDisplayed()
        })

        it('REG-STU-012 | State of Origin, Geo-Political Zone and Origin LGA fields are present', async () => {
            addFeature('Students'); addSeverity('normal')
            await expect(StudentsPage.stateOfOriginInput).toBeDisplayed()
            await expect(StudentsPage.geoPoliticalZoneInput).toBeDisplayed()
            await expect(StudentsPage.originLgaInput).toBeDisplayed()
        })

        it('REG-STU-013 | Save button is present', async () => {
            addFeature('Students'); addSeverity('blocker')
            await expect(StudentsPage.saveBtn).toBeDisplayed()
        })

        it('REG-STU-014 | Closing without saving dismisses the modal', async () => {
            addFeature('Students'); addSeverity('critical')
            await StudentsPage.closeModal()
            await expect(StudentsPage.openModal).not.toBeDisplayed()
        })
    })

    // Only opens/closes the modal — never submits a file, since there's no
    // confirmed-safe sample file or undo path for a real bulk import.
    describe('Bulk Upload Modal', () => {

        before(async () => {
            await StudentsPage.openBulkUploadModal()
        })

        it('REG-STU-015 | Clicking Bulk Upload opens the modal', async () => {
            addFeature('Students'); addSeverity('critical')
            await expect(StudentsPage.openModal).toBeDisplayed()
        })

        it('REG-STU-016 | Upload button is present', async () => {
            addFeature('Students'); addSeverity('critical')
            await expect(StudentsPage.bulkUploadSubmitBtn).toBeDisplayed()
        })

        it('REG-STU-017 | Closing without uploading dismisses the modal', async () => {
            addFeature('Students'); addSeverity('critical')
            await StudentsPage.closeModal()
            await expect(StudentsPage.openModal).not.toBeDisplayed()
        })
    })

    describe('Filter Modal', () => {

        before(async () => {
            await StudentsPage.openFilterModal()
        })

        it('REG-STU-018 | Clicking Filter opens the modal', async () => {
            addFeature('Students'); addSeverity('critical')
            await expect(StudentsPage.openModal).toBeDisplayed()
        })

        it('REG-STU-019 | Apply and Reset buttons are present', async () => {
            addFeature('Students'); addSeverity('normal')
            await expect(StudentsPage.filterApplyBtn).toBeDisplayed()
            await expect(StudentsPage.filterResetBtn).toBeDisplayed()
        })

        it('REG-STU-020 | Closing without applying dismisses the modal', async () => {
            addFeature('Students'); addSeverity('normal')
            await StudentsPage.closeModal()
            await expect(StudentsPage.openModal).not.toBeDisplayed()
        })
    })
})
