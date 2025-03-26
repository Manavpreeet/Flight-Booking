// jest.config.ts
import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    globals: {
        "ts-jest": {
            isolatedModules: true,
        },
    },
};

export default config;
