import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["node_modules/**", ".open-next/**", ".next/**", "out/**"],
  },
];

export default eslintConfig;
