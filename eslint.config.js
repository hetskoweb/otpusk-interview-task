import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({ typescript: true });

export default [
  ...compat.extends([
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ]),
  
  {
    files: ["*.ts", "*.tsx"],
    rules: {
      "react/react-in-jsx-scope": "off", // React 17+
      "@typescript-eslint/explicit-module-boundary-types": "off"
    }
  },

  // Настройка JSX-файлов
  {
    files: ["*.tsx"],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } }
    }
  }
];
