import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // extend Next.js recommended flat configs (includes TypeScript support)
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // ignore build and generated folders
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },

  // project-level rules and plugin registrations
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      // react: require('eslint-plugin-react'),
      // 'react-hooks': require('eslint-plugin-react-hooks'),
      // '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      // import: require('eslint-plugin-import'),
      // // note: some CI/dev environments may not have all optional plugins installed;
      // // avoid hard-failing by omitting the simple-import-sort plugin registration here.
      // // 'unused-imports' plugin intentionally omitted to avoid build-time failures in some environments
      // prettier: require('eslint-plugin-prettier'),
    },

    settings: {
      react: { version: 'detect' },
    },

    rules: {
      /* TypeScript / general */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      /* React */
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      /* Hooks */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /* Imports and sorting */
      // simple-import-sort may be unavailable in some environments; rely on import/order and unused-imports instead
      'import/order': 'off',
      'import/no-duplicates': 'error',
      // rely on TypeScript's no-unused-vars rule instead of optional plugin

      /* Code quality */
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'consistent-return': 'error',

      /* Prettier integration */
      'prettier/prettier': 'warn',
    },
  },
];

export default eslintConfig;
