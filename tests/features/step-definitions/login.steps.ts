import { Given, Then, When } from "@wdio/cucumber-framework";

import LoginScreen from "../pageobjects/login.screen";

Given("que estou na tela de login do Coffeemon", async () => {
  await LoginScreen.waitForScreen();
});

When("eu insiro o email {string}", async (email: string) => {
  await LoginScreen.emailInput.setValue(email);
});

When("eu insiro a senha {string}", async (password: string) => {
  await LoginScreen.passwordInput.setValue(password);
});

When("eu toco no botão de login", async () => {
  await LoginScreen.loginButton.click();
});

Then("eu devo ser redirecionado para a tela de E-commerce", async () => {
  await LoginScreen.verifyLoginSuccess();
});
