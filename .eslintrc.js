module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "no-console": "error",
    "no-debugger": "error",
  },
  ignorePatterns: ["node_modules", "dist", ".next", "build", "*.config.js", ".eslintrc.js"],
};
