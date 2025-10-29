import { $ } from '@wdio/globals';

class LoginScreen {
    // --- Seletores XPath (Exemplos - Use Appium Inspector para os XPaths corretos!) ---

    /**
     * Encontra o TextInput pelo placeholder (menos ideal, pode quebrar com tradução)
     * Ou por uma combinação de classe e índice (mais frágil ainda)
     */
    public get emailInput() {
        // Exemplo 1: Procurando pelo placeholder (Android)
        // return $('//android.widget.EditText[@text="Email"]');

        // Exemplo 2: Procurando pela classe e talvez índice (MUITO FRÁGIL)
        // Você precisará inspecionar a árvore para achar o caminho correto
        return $('//android.widget.EditText[1]'); // Pode não ser o primeiro!
    }

    public get passwordInput() {
        // Exemplo 1: Procurando pelo placeholder (Android)
        // return $('//android.widget.EditText[@text="Senha"]');

        // Exemplo 2: Procurando pela classe e índice (MUITO FRÁGIL)
        return $('//android.widget.EditText[2]'); // Pode não ser o segundo!
    }

    /**
     * Encontra o botão pelo Texto visível dentro dele (Android)
     */
    public get loginButton() {
        // Exemplo: Procurando um botão clicável que contém um TextView com o texto "Login"
        return $('//android.view.ViewGroup[@clickable="true"]//android.widget.TextView[@text="Login"]');
    }

    /**
     * Seletor para verificar a próxima tela (E-commerce)
     * PRECISA SER AJUSTADO com XPath da sua tela de E-commerce
     */
    public get ecommerceHeaderTitle() {
        // Exemplo de XPath para o título (VERIFIQUE COM APPIUM INSPECTOR)
        return $('//android.widget.TextView[@text="☕ Coffeemon Store"]');
    }

    // --- Ações (permanecem as mesmas) ---

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