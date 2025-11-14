// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist', 'eslint.config.mjs'],
  },
  
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,

  {
    files: ['src/**/*.ts', 'test/**/*.ts'], 
    
    extends: [...tseslint.configs.recommendedTypeChecked], 
    
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          tabWidth: 2,
          semi: true,
          singleQuote: true,
          trailingComma: 'es5',
          printWidth: 100,
        },
      ],
    },
  },
);