module.exports = {
  extends: ["next/core-web-vitals", "../../.eslintrc.js"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  ignorePatterns: [".eslintrc.js", "next.config.js", "postcss.config.js", "tailwind.config.ts"],
  rules: {
    "@next/next/no-html-link-for-pages": ["error", "src/app"],
  },
};
