import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { ReactThreeFiber } from '@react-three/fiber'

export default [
    { ignores: ['dist'] },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        settings: { react: { version: '18.3' } },
        plugins: {
            ReactThreeFiber,
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        extends: [
            'eslint:recommended',
            'plugin:react/recommended',
            'plugin:react-three-fiber/recommended'
        ],
        rules: {
            'no-undef': 'error',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            quotes: ['error', 'single', { avoidEscape: true }],
            'no-unused-vars': 'off', // Needed to make enums work.
            'no-console': 'error',
            'prefer-const': 'error',
            'prefer-destructuring': 'off',
            'no-unused-expressions': 'off',
            'no-duplicate-imports': 'error',
            'prefer-template': 'error',
            'no-var': 'error',
            'react/prop-types': 'off',
            'object-shorthand': 'error',
            'no-useless-escape': 'off',
            'no-constant-condition': 'warn',
            'no-extra-semi': 'off', // Needed incombination with the prettier no semi rule;
            'react-hooks/exhaustive-deps': [
                'warn',
                {
                    additionalHooks: 'useDebouncedEffect',
                },
            ],
            'no-unreachable': 'warn',
        },
    },
]
