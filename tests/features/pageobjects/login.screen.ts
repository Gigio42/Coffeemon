import { $ } from "@wdio/globals";

class LoginScreen {

  public get emailInput() {
    return $("~emailInput");
  }

  public get passwordInput() {
    return $("~passwordInput");
  }

  public get loginButton() {
    return $("~loginButton");
  }

  public get ecommerceHeaderTitle() {
    const selector = 'android=new UiSelector().resourceId("ecommerceTitle")';
    return $(selector);
  }

  public async waitForScreen(): Promise<void> {
    await this.emailInput.waitForExist({ timeout: 15000 });
  }

  public async login(email: string, password: string): Promise<void> {
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  public async verifyLoginSuccess(): Promise<void> {
    await this.ecommerceHeaderTitle.waitForExist({ timeout: 20000 });
    await expect(this.ecommerceHeaderTitle).toBeDisplayed();
  }
}

export default new LoginScreen();
