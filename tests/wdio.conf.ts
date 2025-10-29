import type { Options } from '@wdio/types';
import * as path from 'path';

const apkPath = process.env.APK_PATH ||
                path.join(__dirname, '..', 'frontend/android/app/build/outputs/apk/debug/app-debug.apk');

console.log(`[Config] Attempting to use APK at: ${apkPath}`);

export const config: Options.Testrunner = {
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true
        }
    },

    specs: [
        './features/**/*.feature'
    ],
    exclude: [],

    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Medium Phone API 36.1',
        'appium:app': apkPath,
        'appium:autoGrantPermissions': true,
    }],

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: [
        ['appium', {
            command: 'appium',
            args: {
                port: 4723,
                address: 'localhost',
                // relaxedSecurity: true, // Descomente se precisar
            }
        }],
        ['rerun', {
             retries: 1
        }],
        'performancetotal' // Serviço para métricas de performance
        // Se precisar de debug: '@wdio/vscode-service' (instale antes)
    ],

    framework: 'cucumber',

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            useCucumberStepReporter: true
        }]
    ],

    cucumberOpts: {
        require: [
            './features/step-definitions/**/*.ts',
            './features/support/**/*.ts' // Para hooks (opcional)
        ],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 90000, // Timeout para um único step
        ignoreUndefinedDefinitions: false
    },

    // ===== HOOKS =====
    // Adicione hooks aqui conforme necessário
    /*
    afterStep: async function (step, scenario, { error }) {
        if (error) {
            await browser.takeScreenshot();
        }
    },
    */
};