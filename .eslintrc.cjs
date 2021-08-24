module.exports = {
    extends: [
        'eslint-config-dougkulak',
        'prettier',
    ],
    ignorePatterns: ['src/test/temp/*'],
    overrides: [
        {
            files: ['./src/test/**/*.ts'],
            rules: {
                'unicorn/no-null': 'off',
            }
        }
    ]
};
