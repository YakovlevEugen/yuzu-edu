import { fixupConfigRules } from '@eslint/compat'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
})

export default [...fixupConfigRules(compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
)).map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx']
})),

...fixupConfigRules(compat.extends(
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:react-hooks/recommended',
  'plugin:storybook/recommended',
  'prettier'
)).map(config => ({
    ...config,
    files: [
        'src/**/*.mdx',
        'src/**/*.stories.@(js|jsx|ts|tsx)'
    ]
})),

{
    files: ['**/*.ts', '**/*.tsx'],

    ignores: ['src/components/ui/*'],

    plugins: {
        'react-refresh': reactRefresh,
        prettier
    },

    languageOptions: {
        globals: {
            ...globals.browser
        },

        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
    },

    rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        'react-refresh/only-export-components': 'warn',
        'prettier/prettier': ['error']
    }
}
]
