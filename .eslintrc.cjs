module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  plugins: ['@typescript-eslint', 'import', 'yml', 'jsonc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  overrides: [
    {
      files: ['**/*.ts'],
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    {
      files: ['**/*.yml'],
      parser: 'yaml-eslint-parser',
      extends: ['plugin:yml/standard'],
      rules: {
        'yml/no-empty-mapping-value': 'off',
      },
    },
    {
      files: ['**/*.json'],
      parser: 'jsonc-eslint-parser',
      extends: ['plugin:jsonc/recommended-with-json']
    },
    {
      files: [
        '**/*.js',
        '**/.*.js',
        '**/*.cjs',
        '**/.*.cjs'
      ],
      parser: 'espree',
      parserOptions: {
        project: null, 
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      rules: {
        'indent': ['error', 2],
        'quotes': ['error', 'single'],
        'curly': ['error', 'all'],
        'brace-style': ['error', '1tbs'],
        'object-curly-spacing': ['error', 'always']
      }
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',
    'import/no-duplicates': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': 'off',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'eol-last': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
};
