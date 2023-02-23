const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^.+\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js"
    },
    transform: {
        ...tsjPreset.transform,
        "\\.(js|jsx|ts|tsx)$": "babel-jest",
        "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js",
    },
    globals: {
        "ts-jest": {
            babelConfig: true,
            tsconfig: "tsconfig.json"
        }
    },
    setupFilesAfterEnv: ["<rootDir>/test-setup.js"]
};