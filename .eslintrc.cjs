module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "import/order": [
      "error",
      {
        groups: [
          "external",
          "internal",
          "type",
          ["parent", "sibling", "index"],
        ],
        "newlines-between": "always",
      },
    ],
  },
};
