// The instructor's per-class workspace (courseClasses/{id}) — a single page with
// Bootstrap tab panes for Class Details, Materials (Lectures/Assignments/
// Assessments sub-tabs), Discussions, Feedback, Grades, Students, Analytics,
// Badges, Groups and Outline. All modals are already present in the DOM
// regardless of which tab is active; only the trigger buttons are tab-scoped.
class CourseClassWorkspacePage {

    open(classId) {
        return browser.url(`https://nda.scola.ng/scola-elearning/courseClasses/${classId}`)
    }

    get breadcrumb() { return $('.breadcrumb-title, .page-title, .breadcrumb') }

    get openModal() { return $('.modal.show') }
    get closeModalBtn() { return $('.modal.show button.btn-close') }
    get sweetAlertConfirmBtn() { return $('.sweet-alert.showSweetAlert button.confirm') }

    async dismissSweetAlert(timeout = 3000) {
        const appeared = await this.sweetAlertConfirmBtn.waitForDisplayed({ timeout }).catch(() => false)
        if (appeared) {
            await this.sweetAlertConfirmBtn.click()
            await this.sweetAlertConfirmBtn.waitForExist({ reverse: true, timeout: 5000 })
        }
    }

    async closeModal() {
        await this.closeModalBtn.waitForClickable({ timeout: 5000 })
        await this.closeModalBtn.click()
        await this.openModal.waitForDisplayed({ reverse: true, timeout: 8000 })
    }

    // ── Tab navigation ───────────────────────────────────────────────────────

    tab(href) { return $(`a[data-bs-toggle="tab"][href="${href}"]`) }

    async openTab(href) {
        const tab = this.tab(href)
        await tab.waitForDisplayed({ timeout: 5000 })
        await tab.click()
        await $(href).waitForDisplayed({ timeout: 5000 })
    }

    // ── Edit Class (shares the mdl-courseClass-modal DOM with the admin's
    // Classes list — same field ids as courseClasses.page.js) ───────────────

    get editClassBtn() { return $('.btn-edit-mdl-courseClass-modal') }
    get classModal() { return $('#mdl-courseClass-modal') }
    get classNameInput() { return $('#name') }
    get classSaveBtn() { return $('#btn-save-mdl-courseClass-modal') }

    async openEditClassModal() {
        await this.editClassBtn.waitForDisplayed({ timeout: 5000 })
        await this.editClassBtn.click()
        await this.classModal.waitForDisplayed({ timeout: 5000 })
        await this.classSaveBtn.waitForDisplayed({ timeout: 8000 })
        await browser.waitUntil(async () => (await this.classNameInput.getValue()) !== '', {
            timeout: 8000,
            timeoutMsg: 'Edit Class modal did not populate the Name field in time',
        })
    }

    // ── Announcement ─────────────────────────────────────────────────────────

    get newAnnouncementBtn() { return $('.btn-new-mdl-announcement-modal') }
    get announcementModal() { return $('#mdl-announcement-modal') }
    get announcementHeadlineInput() { return $('#headline') }
    get announcementStartDateInput() { return $('#announcement_start_date') }
    get announcementEndDateInput() { return $('#announcement_end_date') }
    get announcementDescriptionInput() { return $('#announcement_description') }
    get announcementFileInput() { return $('#announcement_file') }
    get announcementAudienceAllRadio() { return $('#all') }
    get announcementAudienceLecturerRadio() { return $('#lecturer') }
    get announcementAudienceStudentRadio() { return $('#student') }
    get announcementSaveBtn() { return $('#btn-save-mdl-announcement-modal') }

    async openNewAnnouncementModal() {
        await this.newAnnouncementBtn.waitForDisplayed({ timeout: 5000 })
        await this.newAnnouncementBtn.click()
        await this.announcementModal.waitForDisplayed({ timeout: 5000 })
        await this.announcementSaveBtn.waitForDisplayed({ timeout: 8000 })
    }

    // ── Reading Material ─────────────────────────────────────────────────────

    get newReadingMaterialBtn() { return $('.btn-new-mdl-reading_material-modal') }
    get readingMaterialModal() { return $('#mdl-reading_material-modal') }
    get readingMaterialTitleInput() { return $('#title_material') }
    get readingMaterialUrlInput() { return $('#reference_material_url') }
    get readingMaterialFileInput() { return $('#upload_file') }
    get readingMaterialDescriptionInput() { return $('#materia_description') }
    get readingMaterialSaveBtn() { return $('#btn-save-mdl-reading_material-modal') }

    async openNewReadingMaterialModal() {
        await this.newReadingMaterialBtn.waitForDisplayed({ timeout: 5000 })
        await this.newReadingMaterialBtn.click()
        await this.readingMaterialModal.waitForDisplayed({ timeout: 5000 })
        await this.readingMaterialSaveBtn.waitForDisplayed({ timeout: 8000 })
    }

    // ── Course Outline ────────────────────────────────────────────────────────

    get modifyOutlineBtn() { return $('.btn-edit-mdl-course_outline-modal') }
    get outlineModal() { return $('#mdl-course_outline-modal') }
    get outlineTextarea() { return $('#txt_outline_outline') }
    get outlineSaveBtn() { return $('#btn-save-mdl-course_outline-modal') }

    async openOutlineModal() {
        await this.modifyOutlineBtn.waitForDisplayed({ timeout: 5000 })
        await this.modifyOutlineBtn.click()
        await this.outlineModal.waitForDisplayed({ timeout: 5000 })
        await this.outlineSaveBtn.waitForDisplayed({ timeout: 8000 })
    }

    // ── Lecture ──────────────────────────────────────────────────────────────

    get newLectureBtn() { return $('.btn-new-mdl-lecture_start-modal') }
    get lectureModal() { return $('#mdl-lecture_start-modal') }
    get lectureNumberInput() { return $('#lecture_number') }
    get lectureTitleInput() { return $('#lecture_title') }
    get lectureDescriptionInput() { return $('#lecture_description') }
    get lectureFileInput() { return $('#lecture_file_material') }
    get lectureModeSelect() { return $('#lecture_mode') }
    get lectureDateInput() { return $('#lecture_date') }
    get lectureStartTimeInput() { return $('#lecture_start_time') }
    get lectureEndTimeInput() { return $('#lecture_end_time') }
    get lectureSaveBtn() { return $('#btn-save-mdl-lecture_start-modal') }

    async openNewLectureModal() {
        await this.newLectureBtn.waitForDisplayed({ timeout: 5000 })
        await this.newLectureBtn.click()
        await this.lectureModal.waitForDisplayed({ timeout: 5000 })
        await this.lectureSaveBtn.waitForDisplayed({ timeout: 8000 })
    }

    // ── Assignment ───────────────────────────────────────────────────────────

    get newAssignmentBtn() { return $('.btn-new-mdl-assignment-modal') }
    get assignmentModal() { return $('#mdl-assignment-modal') }
    get assignmentNumberInput() { return $('#assignment_number') }
    get assignmentTitleInput() { return $('#assignment_title') }
    get assignmentDueDateInput() { return $('#due_date') }
    get assignmentDueTimeInput() { return $('#due_time') }
    get assignmentMaxPointsInput() { return $('#grade_max_points') }
    get assignmentContributionInput() { return $('#grade_contribution') }
    get assignmentFileInput() { return $('#assignment_file') }
    get assignmentUrlInput() { return $('#assigment_url') }
    get assignmentDescriptionInput() { return $('#assignment_description') }
    get assignmentAllowLateCheckbox() { return $('#allow_late_submissions') }
    get assignmentSaveBtn() { return $('#btn-save-mdl-assignment-modal') }

    async openNewAssignmentModal() {
        await this.newAssignmentBtn.waitForDisplayed({ timeout: 5000 })
        await this.newAssignmentBtn.click()
        await this.assignmentModal.waitForDisplayed({ timeout: 5000 })
        await this.assignmentSaveBtn.waitForDisplayed({ timeout: 8000 })
    }

    // ── Assessment (quiz builder — dynamic question rows) ───────────────────

    get newAssessmentBtn() { return $('.btn-new-assessment-modal') }
    get assessmentModal() { return $('#mdl-assessments') }
    get assessmentTitleInput() { return $('#assessment_title') }
    get assessmentStartDateInput() { return $('#assessment_start_date') }
    get assessmentEndDateInput() { return $('#assessment_end_date') }
    get assessmentScoreTypeSelect() { return $('#score_type') }
    get assessmentScoreValueInput() { return $('#score_value') }
    get assessmentDurationInput() { return $('#duration') }
    get assessmentAttemptsInput() { return $('#attempts') }
    get assessmentRequiresAccessCodeCheckbox() { return $('#requires_access_code') }
    get assessmentAllowLateCheckbox() { return $('#a_allow_late_submission') }
    get assessmentEnableConditionsCheckbox() { return $('#enable_conditions') }
    get assessmentConditionTypeSelect() { return $('#condition_type') }
    get assessmentConditionValueInput() { return $('#assessment_condition_value') }
    get addQuestionBtn() { return $('#btn-add-assessment') }
    get removeQuestionBtns() { return $$('.remove-assessment') }
    get questionRows() { return $$('[name="assessment_question[]"]') }
    get assessmentSaveBtn() { return $('#btn-save-assessment') }

    async openNewAssessmentModal() {
        await this.newAssessmentBtn.waitForDisplayed({ timeout: 5000 })
        await this.newAssessmentBtn.click()
        await this.assessmentModal.waitForDisplayed({ timeout: 5000 })
        await this.assessmentSaveBtn.waitForDisplayed({ timeout: 8000 })
    }

    // ── Discussion Board (Forum) — existing entries only, no manual "New" ───

    get forumEditBtn() { return $('.btn-edit-mdl-forum-modal') }
    get forumDeleteBtn() { return $('.btn-delete-mdl-forum-modal') }
    get forumViewBtn() { return $('.btn-show-view-forum-modal') }
    get forumModal() { return $('#mdl-forum-modal') }
    get viewForumModal() { return $('#mdl-view-forum-modal') }
    get forumGroupNameInput() { return $('#forum_group_name') }
    get forumPostingInput() { return $('#forum_posting') }
    get forumSaveBtn() { return $('#btn-save-mdl-forum-modal') }

    async openEditForumModal() {
        await this.forumEditBtn.waitForDisplayed({ timeout: 5000 })
        await this.forumEditBtn.click()
        await this.forumModal.waitForDisplayed({ timeout: 5000 })
        await this.forumSaveBtn.waitForDisplayed({ timeout: 8000 })
        await browser.waitUntil(async () => (await this.forumGroupNameInput.getValue()) !== '', {
            timeout: 8000,
            timeoutMsg: 'Edit Discussion Board modal did not populate the group name in time',
        })
    }

    async openViewForumModal() {
        await this.forumViewBtn.waitForDisplayed({ timeout: 5000 })
        await this.forumViewBtn.click()
        await this.openModal.waitForDisplayed({ timeout: 5000 })
    }

    // ── Badges ───────────────────────────────────────────────────────────────

    get newBadgeBtn() { return $('.btn-mdl-badge-modal') }
    get badgeModal() { return $('#mdl-badges') }
    get badgeTypeSelect() { return $('#badge_type') }
    get badgeNameInput() { return $('#badge_name') }
    get badgeColorInput() { return $('#badge_color') }
    get badgeDescriptionInput() { return $('#badge_description') }
    get badgeSaveBtn() { return $('#btn-save-badge') }

    async openNewBadgeModal() {
        await this.newBadgeBtn.waitForDisplayed({ timeout: 5000 })
        await this.newBadgeBtn.click()
        await this.badgeModal.waitForDisplayed({ timeout: 5000 })
        await this.badgeSaveBtn.waitForDisplayed({ timeout: 8000 })
    }

    // ── Groups ───────────────────────────────────────────────────────────────

    get newGroupBtn() { return $('.btn-mdl-group-modal') }
    get groupModal() { return $('#mdl-student-group') }
    get groupNameInput() { return $('#group_name') }
    get groupMaxInput() { return $('#group_max') }
    get groupDescriptionInput() { return $('#group_description') }
    get groupSaveBtn() { return $('#btn-save-group') }

    async openNewGroupModal() {
        await this.newGroupBtn.waitForDisplayed({ timeout: 5000 })
        await this.newGroupBtn.click()
        await this.groupModal.waitForDisplayed({ timeout: 5000 })
        await this.groupSaveBtn.waitForDisplayed({ timeout: 8000 })
    }

    // ── Students / Badge assignment ──────────────────────────────────────────

    get studentRows() { return $$('#tab_student tbody tr') }
    get modifyStudentBadgeBtn() { return $('.student-badge') }
    get studentBadgeModal() { return $('#mdl-student-badge') }
    get studentBadgesSelect() { return $('#student-badges') }
    get studentBadgeSaveBtn() { return $('#btn-save-student-badge') }

    async openModifyStudentBadgeModal() {
        await this.modifyStudentBadgeBtn.waitForDisplayed({ timeout: 5000 })
        await this.modifyStudentBadgeBtn.click()
        await this.studentBadgeModal.waitForDisplayed({ timeout: 5000 })
    }

    // ── Grades ───────────────────────────────────────────────────────────────

    get gradeScoreInputs() { return $$('#tab_grades input[type="number"]') }

    // ── Analytics ────────────────────────────────────────────────────────────

    get analyticsTableHeaders() { return $$('#tab_analytics table thead th') }

    // ── Student read-only view ───────────────────────────────────────────────
    // A student visiting this same page has none of the edit/create controls
    // above, only these section headings.

    get readingMaterialsHeading() { return $('h6=Reading Materials') }
    get outlineHeading() { return $('h6=Outline') }
    get announcementsHeading() { return $('h6=Announcements') }
    get classDatesHeading() { return $('h6=Class Dates') }
}

export default new CourseClassWorkspacePage()
