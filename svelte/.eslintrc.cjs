module.exports = {
    extends: [
        'plugin:@typescript-eslint/recommended',
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
