module.exports = {
  plugins: [
    'unused-imports',
    'workspaces',
    '@typescript-eslint',
    'eslint-comments',
    'sonarjs',
    'promise',
    'unicorn',
    'simple-import-sort',
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'next/core-web-vitals', // https://nextjs.org/docs/basic-features/eslint#core-web-vitals
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:eslint-comments/recommended', // https://mysticatea.github.io/eslint-plugin-eslint-comments
    'plugin:promise/recommended', // https://www.npmjs.com/package/eslint-plugin-promise*/
    'plugin:unicorn/recommended',
    'plugin:sonarjs/recommended', // https://github.com/SonarSource/eslint-plugin-sonarjs
    'plugin:workspaces/recommended',
    'plugin:prettier/recommended', // Formating & Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    // 'prettier',
  ],
  env: {
    node: true,
    browser: true,
    // jest: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        bracketSpacing: true,
        bracketSameLine: false,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        endOfLine: 'auto',
      },
    ],
    'no-restricted-syntax': 'off',
    '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'off',
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    'react/destructuring-assignment': 'off',
    // No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    // Use function hoisting to improve code readability
    // eslint-disable-next-line prettier/prettier
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    // Allow most functions to rely on type inference. If the function is exported, then `@typescript-eslint/explicit-module-boundary-types` will ensure it's typed.
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
    // Common abbreviations are known and readable
    'unicorn/prevent-abbreviations': 'off',
    // Airbnb prefers forEach
    'unicorn/no-array-for-each': 'off',
    // It's not accurate in the monorepo style
    'unicorn/no-useless-undefined': 'off',
    'unicorn/no-null': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-explicit-any': 'off',
    'no-return-assign': ['error', 'except-parens'],
    'no-alert': 'warn',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
        checksConditionals: false,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/unbound-method': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/ban-ts-comment': [
      'warn',
      { 'ts-ignore': 'allow-with-description', minimumDescriptionLength: 2 },
    ],
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'generic',
        readonly: 'generic',
      },
    ],
    'unicorn/filename-case': 'off',
    'simple-import-sort/imports': 'error',
    'import/order': 'off', // to prevent conflicts use simple-import-sort/sort for imports sort instead
    'sort-imports': 'off', // to prevent conflicts use simple-import-sort/sort for imports sort instead
    'no-cond-assign': ['warn', 'except-parens'],
    'no-plusplus': 'off',
    curly: ['error', 'all'],
    'max-depth': ['error', 2],
    complexity: ['error', 16],
    'no-console': ['error', { allow: ['warn', 'error', 'info', 'log'] }],
    'promise/catch-or-return': [
      'error',
      { terminationMethod: ['catch', 'asCallback', 'finally'] },
    ],
    'sonarjs/no-small-switch': 'off',
  },
  overrides: [
    {
      files: ['pages/**/*.tsx', 'pages/api/**/*.ts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['*.js'],
      rules: {
        // Allow CJS until ESM support improves
        '@typescript-eslint/no-var-requires': 'off',
        'unicorn/prefer-module': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        'eslint-disable unicorn/no-null': 'off',
        'unicorn/no-useless-undefined': 'off',
      },
    },
  ],
};