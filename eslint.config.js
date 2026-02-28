module.exports = [
  {
    files: ["**/*.js"],
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      ".env",
      "*.log"
    ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module"
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off"
    }
  }
];
