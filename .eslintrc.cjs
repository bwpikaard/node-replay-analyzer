module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    plugins: [
        "@typescript-eslint",
        "simple-import-sort",
    ],
    env: {
        es2021: true,
        jest: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
        project: ["tsconfig.json"],
        tsconfigRootDir: __dirname,
    },
    rules: {
        "@typescript-eslint/consistent-type-imports": ["error", {
            "prefer": "type-imports"
        }],

        "@typescript-eslint/no-unnecessary-condition": "error",

        "@typescript-eslint/return-await": "error",

        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "object-shorthand": ["error", "consistent"],

        // TODO turn back on after cleaning up code
        "@typescript-eslint/no-non-null-assertion": "off",

        // Configure import sorting since eslint sort-imports doesn"t autofix
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",

        //  Blank lines between class members improves readability, prettier doesn"t enforce this
        "lines-between-class-members": ["error", "always"],

        // Don"t allow `src/` imports
        "no-restricted-imports": ["error", { "patterns": ["src/*"] }],

        // Don"t allow duplicate imports
        // "@typescript-eslint/no-duplicate-imports": "error",

        // Extra parentheses can improve clarity in complex expressions
        "@typescript-eslint/no-extra-parens": "off",

        // Empty interfaces can be useful for aliasing types and allowing for future extension
        "@typescript-eslint/no-empty-interface": "off",

        // Allow unused variables when they are prefixed with `_`, useful for array destructuring and method overrides
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                destructuredArrayIgnorePattern: "^_",
            },
        ],

        // explicit-function-return-type includes explicit-module-boundary-types, with both enabled we get duplicates
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/explicit-function-return-type": [
            "error",
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
            },
        ],

        "@typescript-eslint/consistent-type-imports": ["error", {
            "prefer": "type-imports"
        }],

        "@typescript-eslint/no-unnecessary-condition": "error",

        "@typescript-eslint/return-await": "error",

        "@typescript-eslint/no-unnecessary-type-assertion": "error",
    }
}
