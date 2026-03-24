import { createTypescriptReactBabelPreset } from '@exodus/eslint-config-exodus'

const config = [
  { ignores: ['lib', 'node_modules'] },
  createTypescriptReactBabelPreset({ project: ['./tsconfig.test.json'] }),
  {
    settings: {
      'import/ignore': ['node_modules/react-native/index\\.js$'],
    },
    rules: {
      'unicorn/expiring-todo-comments': 'off',
      'sonarjs/no-one-iteration-loop': 'off',
    },
  },
  {
    files: ['jest.config.js', 'jest-setup.js'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  {
    files: ['**/*.type-test.ts{x,}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
].flat()

export default config
