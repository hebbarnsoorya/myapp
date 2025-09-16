root: true,
env: { browser: true, es2022: true, jest: true },
parser: '@typescript-eslint/parser',
parserOptions: { ecmaFeatures: { jsx: true } },
plugins: ['@typescript-eslint', 'react', 'react-hooks'],
extends: [
'eslint:recommended',
'plugin:react/recommended',
'plugin:@typescript-eslint/recommended',
'plugin:react-hooks/recommended',
'prettier',
],module.exports = {
settings: { react: { version: 'detect' } },
};