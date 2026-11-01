import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["build/**", ".react-router/**", "node_modules/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        window: "readonly",
        document: "readonly",
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: { "no-undef": "off" }, // TypeScript checks undefined names.
  },
);
