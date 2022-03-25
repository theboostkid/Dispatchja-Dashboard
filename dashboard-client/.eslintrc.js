module.exports = {
  root: true,
  env: {
    node: true
  },
  rules: {
    "no-console": 1
  },
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint',
    allowImportExportEverywhere: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
  ],
}