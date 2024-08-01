import nextJest from "next/jest.js";
import type { Config } from 'jest'

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",

});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config: Config = {
    // Add more setup options before each test is run
    preset: "ts-jest",
    setupFiles: ["<rootDir>/jest.setupFiles.js"],
    setupFilesAfterEnv: ["<rootDir>/jest.setupFilesAfterEnv.js"],
    moduleNameMapper: {
        "^dexie$": "<rootDir>/node_modules/dexie",
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    testEnvironment: "jsdom",
    globals: { fetch },
    coverageProvider: "v8",
    collectCoverageFrom: [
        "src/**/*.ts",
        "src/**/*.tsx"
    ],
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0
        }
    }
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
