import stylistic from "@stylistic/eslint-plugin";
import _import from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/build",
        "**/coverage",
        "**/.git",
        "**/node_modules",
        "**/.data",
        "**/logs",
        "**/.husky",
        "**.prettier*.*"
    ],
}, ...compat.extends(
    "plugin:@stylistic/disable-legacy",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "prettier",
), {
    plugins: {
        "@stylistic": stylistic,
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
            "@stylistic/parser": [".ts", ".tsx"],
        },

        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: ["./"],
            },

            node: {
                extensions: [".js", ".ts"],
                moduleDirectory: ["node_modules", "./"],
            },
        },
    },

    rules: {
        "@stylistic/max-len": ["error", {
            code: 120,
        }],

        curly: ["error", "all"],
        "@stylistic/semi": ["error", "always"],
        "@stylistic/lines-between-class-members": ["error", "always"],
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
        "default-param-last": "warn",
        "@typescript-eslint/default-param-last": "warn",
        "import/newline-after-import": "error",
        "import/no-unresolved": "error",
        "no-duplicate-imports": "error",
    },
}];