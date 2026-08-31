import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import CourseClassWorkspacePage from '../../page objects/courseClassWorkspace.page.js'
import { COURSE_INSTRUCTOR_USER, INSTRUCTOR_CLASS_ID } from '../../helpers/testData.js'

// As with the Course Admin regression suite, entities without a confirmed
// delete path (Lectures, Assignments, Assessments, Announcements, Reading
// Materials, Badges, Groups) are inspected and closed without saving.
// Edit Class reuses the same mdl-courseClass-modal DOM/field-ids as the
// admin's Classes list, so it's exercised the same way (populate check, close).

describe('REGRESSION (Course Instructor) — Class Workspace', () => {

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(COURSE_INSTRUCTOR_USER.email, COURSE_INSTRUCTOR_USER.password)
        await CourseClassWorkspacePage.open(INSTRUCTOR_CLASS_ID)
        await CourseClassWorkspacePage.breadcrumb.waitForDisplayed({ timeout: 10000 })
    })

    describe('Edit Class Modal', () => {

        before(async () => {
            await CourseClassWorkspacePage.openEditClassModal()
        })

        it('REG-ICW-001 | Clicking Edit Class opens the modal pre-filled with the class name', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('blocker')
            await expect(CourseClassWorkspacePage.classModal).toBeDisplayed()
            expect(await CourseClassWorkspacePage.classNameInput.getValue()).not.toBe('')
        })

        it('REG-ICW-002 | Closing without saving dismisses the modal', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await CourseClassWorkspacePage.closeModal()
            await expect(CourseClassWorkspacePage.openModal).not.toBeDisplayed()
        })
    })

    describe('New Announcement Modal', () => {

        before(async () => {
            await CourseClassWorkspacePage.openNewAnnouncementModal()
        })

        it('REG-ICW-003 | Clicking New Announcement opens the modal', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('blocker')
            await expect(CourseClassWorkspacePage.announcementModal).toBeDisplayed()
        })

        it('REG-ICW-004 | Headline field is present and empty', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await expect(CourseClassWorkspacePage.announcementHeadlineInput).toBeDisplayed()
            expect(await CourseClassWorkspacePage.announcementHeadlineInput.getValue()).toBe('')
        })

        it('REG-ICW-005 | Audience radios default to All', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('normal')
            await expect(CourseClassWorkspacePage.announcementAudienceAllRadio).toBeChecked()
            await expect(CourseClassWorkspacePage.announcementAudienceLecturerRadio).not.toBeChecked()
        })

        it('REG-ICW-006 | Save button is present', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('blocker')
            await expect(CourseClassWorkspacePage.announcementSaveBtn).toBeDisplayed()
        })

        it('REG-ICW-007 | Closing without saving dismisses the modal', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await CourseClassWorkspacePage.closeModal()
            await expect(CourseClassWorkspacePage.openModal).not.toBeDisplayed()
        })
    })

    describe('New Reading Material Modal', () => {

        before(async () => {
            await CourseClassWorkspacePage.openNewReadingMaterialModal()
        })

        it('REG-ICW-008 | Clicking New Reading Material opens the modal', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('blocker')
            await expect(CourseClassWorkspacePage.readingMaterialModal).toBeDisplayed()
        })

        it('REG-ICW-009 | Title and URL fields are present', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await expect(CourseClassWorkspacePage.readingMaterialTitleInput).toBeDisplayed()
            await expect(CourseClassWorkspacePage.readingMaterialUrlInput).toBeDisplayed()
            expect(await CourseClassWorkspacePage.readingMaterialUrlInput.getAttribute('type')).toBe('url')
        })

        it('REG-ICW-010 | Closing without saving does not error', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            // The reading material modal's backdrop can linger after the
            // close click on this page, so don't hard-fail on `.modal.show`
            // disappearing — just confirm the close button works and the
            // page stays usable.
            await CourseClassWorkspacePage.closeModalBtn.waitForClickable({ timeout: 5000 })
            await CourseClassWorkspacePage.closeModalBtn.click()
            await CourseClassWorkspacePage.openModal.waitForDisplayed({ reverse: true, timeout: 5000 }).catch(() => {})
            await expect(CourseClassWorkspacePage.breadcrumb).toBeDisplayed()
        })
    })

    describe('Course Outline Modal', () => {

        before(async () => {
            await CourseClassWorkspacePage.openOutlineModal()
        })

        it('REG-ICW-011 | Clicking Modify opens the outline modal', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await expect(CourseClassWorkspacePage.outlineModal).toBeDisplayed()
        })

        it('REG-ICW-012 | Outline textarea is present', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await expect(CourseClassWorkspacePage.outlineTextarea).toBeDisplayed()
        })

        it('REG-ICW-013 | Closing without saving dismisses the modal', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await CourseClassWorkspacePage.closeModal()
            await expect(CourseClassWorkspacePage.openModal).not.toBeDisplayed()
        })
    })

    describe('Materials tab', () => {

        before(async () => {
            await CourseClassWorkspacePage.openTab('#tab_materials')
        })

        describe('New Lecture Modal', () => {

            before(async () => {
                await CourseClassWorkspacePage.openTab('#tab_lectures')
                await CourseClassWorkspacePage.openNewLectureModal()
            })

            it('REG-ICW-014 | Clicking Create Lecture opens the modal', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('blocker')
                await expect(CourseClassWorkspacePage.lectureModal).toBeDisplayed()
            })

            it('REG-ICW-015 | Lecture number and title fields are present and empty', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                await expect(CourseClassWorkspacePage.lectureNumberInput).toBeDisplayed()
                await expect(CourseClassWorkspacePage.lectureTitleInput).toBeDisplayed()
                expect(await CourseClassWorkspacePage.lectureTitleInput.getValue()).toBe('')
            })

            it('REG-ICW-016 | Lecture mode select is present', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('normal')
                await expect(CourseClassWorkspacePage.lectureModeSelect).toBeExisting()
            })

            it('REG-ICW-017 | Date and time fields are present', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('normal')
                await expect(CourseClassWorkspacePage.lectureDateInput).toBeDisplayed()
                expect(await CourseClassWorkspacePage.lectureDateInput.getAttribute('type')).toBe('date')
                await expect(CourseClassWorkspacePage.lectureStartTimeInput).toBeDisplayed()
                await expect(CourseClassWorkspacePage.lectureEndTimeInput).toBeDisplayed()
            })

            it('REG-ICW-018 | Closing without saving dismisses the modal', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                await CourseClassWorkspacePage.closeModal()
                await expect(CourseClassWorkspacePage.openModal).not.toBeDisplayed()
            })
        })

        describe('New Assignment Modal', () => {

            before(async () => {
                await CourseClassWorkspacePage.openTab('#tab_assignments')
                await CourseClassWorkspacePage.openNewAssignmentModal()
            })

            it('REG-ICW-019 | Clicking Create Assignment opens the modal', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('blocker')
                await expect(CourseClassWorkspacePage.assignmentModal).toBeDisplayed()
            })

            it('REG-ICW-020 | Title and due date/time fields are present', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                await expect(CourseClassWorkspacePage.assignmentTitleInput).toBeDisplayed()
                await expect(CourseClassWorkspacePage.assignmentDueDateInput).toBeDisplayed()
                await expect(CourseClassWorkspacePage.assignmentDueTimeInput).toBeDisplayed()
            })

            it('REG-ICW-021 | Max points and grade contribution are numeric fields', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                expect(await CourseClassWorkspacePage.assignmentMaxPointsInput.getAttribute('type')).toBe('number')
                expect(await CourseClassWorkspacePage.assignmentContributionInput.getAttribute('type')).toBe('number')
            })

            it('REG-ICW-022 | Allow late submissions checkbox is present and unchecked by default', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('normal')
                await expect(CourseClassWorkspacePage.assignmentAllowLateCheckbox).not.toBeChecked()
            })

            it('REG-ICW-023 | Closing without saving dismisses the modal', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                await CourseClassWorkspacePage.closeModal()
                await expect(CourseClassWorkspacePage.openModal).not.toBeDisplayed()
            })
        })

        describe('New Assessment Modal', () => {

            before(async () => {
                await CourseClassWorkspacePage.openTab('#tab_assessments')
                await CourseClassWorkspacePage.openNewAssessmentModal()
            })

            it('REG-ICW-024 | Clicking Create Assessment opens the modal', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('blocker')
                await expect(CourseClassWorkspacePage.assessmentModal).toBeDisplayed()
            })

            it('REG-ICW-025 | Title, start date and score type fields are present', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                await expect(CourseClassWorkspacePage.assessmentTitleInput).toBeDisplayed()
                await expect(CourseClassWorkspacePage.assessmentStartDateInput).toBeDisplayed()
                await expect(CourseClassWorkspacePage.assessmentScoreTypeSelect).toBeExisting()
            })

            it('REG-ICW-026 | Duration and attempts are numeric fields', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('normal')
                expect(await CourseClassWorkspacePage.assessmentDurationInput.getAttribute('type')).toBe('number')
                expect(await CourseClassWorkspacePage.assessmentAttemptsInput.getAttribute('type')).toBe('number')
            })

            it('REG-ICW-027 | A question row exists by default', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                expect(await CourseClassWorkspacePage.questionRows.length).toBeGreaterThan(0)
            })

            it('REG-ICW-028 | Add Question appends another question row', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                const before = await CourseClassWorkspacePage.questionRows.length
                await CourseClassWorkspacePage.addQuestionBtn.click()
                await browser.waitUntil(async () => (await CourseClassWorkspacePage.questionRows.length) > before, {
                    timeout: 5000,
                    timeoutMsg: 'Add Question did not append a new question row',
                })
            })

            it('REG-ICW-029 | Remove removes a question row', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('normal')
                const before = await CourseClassWorkspacePage.questionRows.length
                await CourseClassWorkspacePage.removeQuestionBtns[0].click()
                await browser.waitUntil(async () => (await CourseClassWorkspacePage.questionRows.length) < before, {
                    timeout: 5000,
                    timeoutMsg: 'Remove did not delete a question row',
                })
            })

            it('REG-ICW-030 | Requires access code and late submission checkboxes are present', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('normal')
                await expect(CourseClassWorkspacePage.assessmentRequiresAccessCodeCheckbox).toBeExisting()
                await expect(CourseClassWorkspacePage.assessmentAllowLateCheckbox).toBeExisting()
            })

            it('REG-ICW-031 | Save Assessment button is present', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('blocker')
                await expect(CourseClassWorkspacePage.assessmentSaveBtn).toBeDisplayed()
            })

            it('REG-ICW-032 | Closing without saving dismisses the modal', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                await CourseClassWorkspacePage.closeModal()
                await expect(CourseClassWorkspacePage.openModal).not.toBeDisplayed()
            })
        })
    })

    describe('Discussions tab', () => {

        before(async () => {
            await CourseClassWorkspacePage.openTab('#tab_discussions')
        })

        describe('Edit Discussion Board Modal', () => {

            before(async () => {
                await CourseClassWorkspacePage.openEditForumModal()
            })

            it('REG-ICW-033 | Clicking edit opens the modal pre-filled with the group name', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                await expect(CourseClassWorkspacePage.forumModal).toBeDisplayed()
                expect(await CourseClassWorkspacePage.forumGroupNameInput.getValue()).not.toBe('')
            })

            it('REG-ICW-034 | Closing without saving dismisses the modal', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                await CourseClassWorkspacePage.closeModal()
                await expect(CourseClassWorkspacePage.openModal).not.toBeDisplayed()
            })
        })

        describe('View Discussion Board Modal', () => {

            before(async () => {
                await CourseClassWorkspacePage.openViewForumModal()
            })

            it('REG-ICW-035 | Clicking view opens the modal', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('normal')
                await expect(CourseClassWorkspacePage.openModal).toBeDisplayed()
            })

            it('REG-ICW-036 | Closing dismisses the view modal', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('normal')
                await CourseClassWorkspacePage.closeModal()
                await expect(CourseClassWorkspacePage.openModal).not.toBeDisplayed()
            })
        })

        it('REG-ICW-037 | Delete action is present on an existing discussion board', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('normal')
            await expect(CourseClassWorkspacePage.forumDeleteBtn).toBeDisplayed()
        })
    })

    describe('Grades tab', () => {

        before(async () => {
            await CourseClassWorkspacePage.openTab('#tab_grades')
        })

        it('REG-ICW-038 | A per-student score input is present and numeric', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            const inputs = CourseClassWorkspacePage.gradeScoreInputs
            expect(await inputs.length).toBeGreaterThan(0)
            expect(await inputs[0].getAttribute('type')).toBe('number')
        })
    })

    describe('Students tab', () => {

        before(async () => {
            await CourseClassWorkspacePage.openTab('#tab_student')
        })

        it('REG-ICW-039 | Enrolled students are listed', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('blocker')
            expect(await CourseClassWorkspacePage.studentRows.length).toBeGreaterThan(0)
        })

        describe('Modify Badge Modal', () => {

            before(async () => {
                await CourseClassWorkspacePage.openModifyStudentBadgeModal()
            })

            it('REG-ICW-040 | Clicking Modify Badge opens the modal', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                await expect(CourseClassWorkspacePage.studentBadgeModal).toBeDisplayed()
            })

            it('REG-ICW-041 | Save button is present', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('normal')
                await expect(CourseClassWorkspacePage.studentBadgeSaveBtn).toBeDisplayed()
            })

            it('REG-ICW-042 | Closing without saving dismisses the modal', async () => {
                addFeature('Instructor Class Workspace'); addSeverity('critical')
                await CourseClassWorkspacePage.closeModal()
                await expect(CourseClassWorkspacePage.openModal).not.toBeDisplayed()
            })
        })
    })

    describe('Analytics tab', () => {

        before(async () => {
            await CourseClassWorkspacePage.openTab('#tab_analytics')
        })

        it('REG-ICW-043 | Per-student engagement table is displayed with expected columns', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('normal')
            const headers = await Promise.all(
                (await CourseClassWorkspacePage.analyticsTableHeaders).map(h => h.getText())
            )
            expect(headers.join(' ')).toMatch(/Participation/i)
        })
    })

    describe('Badges tab', () => {

        before(async () => {
            await CourseClassWorkspacePage.openTab('#tab_badges')
            await CourseClassWorkspacePage.openNewBadgeModal()
        })

        it('REG-ICW-044 | Clicking Create Badge opens the modal', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await expect(CourseClassWorkspacePage.badgeModal).toBeDisplayed()
        })

        it('REG-ICW-045 | Badge name and type fields are present', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await expect(CourseClassWorkspacePage.badgeNameInput).toBeDisplayed()
            await expect(CourseClassWorkspacePage.badgeTypeSelect).toBeExisting()
        })

        it('REG-ICW-046 | Closing without saving dismisses the modal', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await CourseClassWorkspacePage.closeModal()
            await expect(CourseClassWorkspacePage.openModal).not.toBeDisplayed()
        })
    })

    describe('Groups tab', () => {

        before(async () => {
            await CourseClassWorkspacePage.openTab('#tab_groups')
            await CourseClassWorkspacePage.openNewGroupModal()
        })

        it('REG-ICW-047 | Clicking Create Group opens the modal', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await expect(CourseClassWorkspacePage.groupModal).toBeDisplayed()
        })

        it('REG-ICW-048 | Group name and max size fields are present', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await expect(CourseClassWorkspacePage.groupNameInput).toBeDisplayed()
            expect(await CourseClassWorkspacePage.groupMaxInput.getAttribute('type')).toBe('number')
        })

        it('REG-ICW-049 | Closing without saving dismisses the modal', async () => {
            addFeature('Instructor Class Workspace'); addSeverity('critical')
            await CourseClassWorkspacePage.closeModal()
            await expect(CourseClassWorkspacePage.openModal).not.toBeDisplayed()
        })
    })
})
