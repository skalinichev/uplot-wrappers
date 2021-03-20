module.exports = {
    parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    settings: {
        react: {version: "detect"}
    },
    extends: [
        'plugin:vue/recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    rules: {
        '@typescript-eslint/no-empty-function': 'off',
        'vue/component-definition-name-casing': 'off'
    }
}
