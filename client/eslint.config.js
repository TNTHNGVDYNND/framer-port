import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      'react/react-in-jsx-scope': 'off', // React 19+ uses new JSX transform
      // Disable strict prop-types validation (adds noise with React 19)
      'react/prop-types': 'off',
      // Disable set-state-in-effect for media query initialization patterns
      'react-hooks/set-state-in-effect': 'off',
      // Allow Three.js/R3F custom properties like 'args' and shader uniforms
      'react/no-unknown-property': 'off',
      // Allow hook dependencies for refs in cleanup
      'react-hooks/exhaustive-deps': 'warn',
      // Allow apostrophes and quotes in JSX (ESLint false positives)
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    ignores: ['dist'],
  },
];
