// @ts-check
import eslint from "@eslint/js";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import astroPlugin from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

const sharedRules = {
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    },
  ],
  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      alphabetize: {
        order: "asc",
        caseInsensitive: true,
      },
      pathGroups: [
        {
          pattern: "@/**",
          group: "internal",
          position: "before",
        },
      ],
      pathGroupsExcludedImportTypes: ["builtin"],
    },
  ],
  "import/no-unused-modules": "error",
  "import/no-duplicates": "error",
  "@typescript-eslint/consistent-type-imports": [
    "error",
    {
      prefer: "type-imports",
      fixStyle: "inline-type-imports",
      disallowTypeAnnotations: false,
    },
  ],
  "@typescript-eslint/no-explicit-any": "warn",
  "no-console": "warn",
  "no-debugger": "error",
  "prefer-const": "error",
  "no-var": "error",
  "object-shorthand": "error",
  "prefer-template": "error",
};

export default [
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // Astro recommended rules (includes its parser config)
  // Note: If astroPlugin.configs.recommended causes issues, you might need to configure it manually
  ...astroPlugin.configs.recommended,

  // Prettier integration (disables formatting rules)
  prettierConfig,

  {
    // Base language settings
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser, // Browser globals including window, document, etc.
        ...globals.node, // Node globals for build scripts
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },

  {
    // TypeScript files
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.browser, // Ensure browser globals are available for TS/JS files
      },
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
    },
    rules: {
      ...(tseslintPlugin.configs.recommended?.rules ?? {}),
      ...sharedRules,
    },
  },

  {
    // Astro files
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.browser, // Ensure browser globals are available for Astro files
      },
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
    },
    rules: {
      ...(tseslintPlugin.configs.recommended?.rules ?? {}),
      ...sharedRules,
    },
  },

  {
    ignores: ["dist/", "node_modules/", ".astro/"],
  },
];
