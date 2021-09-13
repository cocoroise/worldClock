module.exports = {
    env: {
        browser: true,
        es2021: true,
        commonjs: true
    },
    extends: [
        '@ecomfe/eslint-config',
        '@ecomfe/eslint-config/vue',
    ],
    rules: {
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: ['vue']
};
