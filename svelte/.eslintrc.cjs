module.exports = {
    extends: [
        'plugin:svelte/recommended'
    ],
    parserOptions: {
        extraFileExtensions: ['.svelte']
    },
    overrides: [
        {
            files: ['*.svelte'],
            parser: 'svelte-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser'
            }
        }
    ]
};
