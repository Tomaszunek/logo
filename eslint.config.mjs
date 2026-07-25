import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["node_modules/**", "build/**", "dist/**", "coverage/**"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [js.configs.all],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.all, tseslint.configs.all],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "id-length": ["error", { min: 1 }],
      "max-lines": "off",
      "max-lines-per-function": "off",
      "max-statements": "off",
      "no-ternary": "off",
      "no-undefined": "off",
      "one-var": ["error", "never"],
      "sort-imports": "off",
      "sort-keys": ["error", "asc", { minKeys: 20, natural: true }],
      "sort-vars": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/max-params": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          selector: "default",
          trailingUnderscore: "allow",
        },
        {
          format: ["PascalCase"],
          selector: "typeLike",
        },
      ],
      "@typescript-eslint/no-magic-numbers": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/prefer-readonly-parameter-types": "off",
      "@typescript-eslint/strict-void-return": "off",
    },
  },
]);
