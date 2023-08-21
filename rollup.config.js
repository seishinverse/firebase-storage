
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json" assert { type: "json" };

export default [
    {
        input: "lib/index.ts",
        output: {
            name: "firebaseStorage",
            file: pkg.browser,
            format: "umd",
            file: "dist/index.js",
        },
        plugins: [
            resolve({ preferBuiltins: false }),
            commonjs(),
            json(),
            typescript({ tsconfig: "./tsconfig.json" }),
        ]
    },
    {
        input: "lib/index.ts",
        output: [
            { file: pkg.main, format: "cjs" },
            { file: pkg.module, format: "es" },
        ],
        plugins: [typescript({ tsconfig: "./tsconfig.json" })],
    }
];