class LoginPage {

    get emailInput() { return $('#email') }
    get passwordInput() { return $('#password') }
    get loginBtn() { return $('button=Log In') }
    get dashboardMenu() { return $('#mnu_el_dashboard') }

    async open() {
        await browser.url('https://nda.scola.ng/login')
    }

    async login(email, password) {
        await this.emailInput.waitForDisplayed({ timeout: 5000 })
        await this.emailInput.setValue(email)

        await this.passwordInput.waitForDisplayed({ timeout: 5000 })
        await this.passwordInput.setValue(password)

        await this.loginBtn.waitForDisplayed({ timeout: 5000 })
        await this.loginBtn.click()

        await this.dashboardMenu.waitForDisplayed({ timeout: 10000 })
    }
}

export default new LoginPage()
