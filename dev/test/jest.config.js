module.exports = {
  projects: [
    {
      cache: false,
      automock: false,
      rootDir: "./",
      coverageDirectory: "./temporary/test/coverage",
      collectCoverageFrom: ["./src/**/*.ts"],
      setupFilesAfterEnv: ["<rootDir>/dev/test/jest.setup.js"],
      globals: {
        'ts-jest': {
          tsconfig: {
            "lib": ["DOM", "ESNext", "ES2020", "ES2019", "ES2018", "ES2017", "ES2016", "ES2015", "ES5"],
            "target": "ES2015",
            "esModuleInterop": true,
            "strict": true,
            "allowJs": true,
            "checkJs": false,
            "resolveJsonModule": true,
            "moduleResolution": "node",
            "allowSyntheticDefaultImports": true,
          }
        }
      },
      testEnvironment: 'jsdom',
      testRegex: `packages/.*\\.test?\\.ts$`,
      moduleFileExtensions: ['ts', 'js'],
      transform: { "^.+\\.[jt]s?$": 'ts-jest' }
    }
  ]
}
