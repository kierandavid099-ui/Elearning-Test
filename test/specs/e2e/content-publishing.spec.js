import { addFeature, addSeverity } from '../../helpers/allureHelper.js'
import LoginPage from '../../page objects/login.page.js'
import WebsiteContentPage from '../../page objects/websiteContent.page.js'
import { ADMIN_USER } from '../../helpers/testData.js'
import { uniqueName } from '../../helpers/random.js'

// ─────────────────────────────────────────────────────────────────────────────
// E2E — Content publishing: adds a brand-new page via Website Content ->
// Other Pages -> Add New Pages, then confirms it's actually listed.
//
// Regression deliberately never saves here, since editing the *existing*
// landing page content has no confirmed revert path (see website-content.spec.js
// and settings.spec.js). This journey stays on the safe side of that same
// line by only ever adding a new, additional page — it never touches existing
// published content, so there's nothing to restore.
//
// The New Page form's exact fields aren't confirmed anywhere else in this
// suite, so WebsiteContentPage.fillAndSaveNewPage() fills whatever text/
// textarea/select controls the modal actually renders instead of guessing
// specific ids. If the save fails or the new page never appears in the list,
// that's left as a genuine failure to investigate, not papered over.
//
// Leaves behind: one new content page — there's no confirmed delete path.
// ─────────────────────────────────────────────────────────────────────────────

describe('E2E — Content Publishing', () => {

    const pageTitle = uniqueName('E2E Page')

    before(async () => {
        await LoginPage.open()
        await LoginPage.login(ADMIN_USER.email, ADMIN_USER.password)
        await WebsiteContentPage.open()
    })

    it('E2E-CNT-001 | A new page can be added from Other Pages', async () => {
        addFeature('Content Publishing'); addSeverity('blocker')
        await WebsiteContentPage.openAddNewPageModal()
        await WebsiteContentPage.fillAndSaveNewPage(pageTitle)
        await expect(WebsiteContentPage.addNewPageLink).toBeDisplayed()
    })

    it('E2E-CNT-002 | The new page appears under Other Pages', async () => {
        addFeature('Content Publishing'); addSeverity('critical')
        await expect($(`*=${pageTitle}`)).toBeDisplayed()
    })
})
