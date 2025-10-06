// functions/.eslintrc.cjs
module.exports = {
  env: { es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { project: ['./tsconfig.json'] },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  ignorePatterns: ['lib/**', 'node_modules/**'],
};
