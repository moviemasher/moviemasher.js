module.exports = {
  bail: 1,
  roots: ["./src"],
  coverageDirectory: "./test/coverage",
  setupFilesAfterEnv: ["./test/jest.setup.js"],
  globals: {
    'ts-jest': {
      tsconfig: {
        "lib": ["ESNext", "DOM"],
        "target": "ES2015",
        "esModuleInterop": true,
        "strict": false,
        "allowJs": true,
        "checkJs": false,
        "resolveJsonModule": true,
        "moduleResolution": "node",
        "allowSyntheticDefaultImports": true,
      }
    }
  },
  testEnvironment: 'jsdom',
  testRegex: '.*\\.test?\\.[jt]s$',
  moduleFileExtensions: ['ts', 'js'],
  transform: { "^.+\\.[jt]s?$": 'ts-jest' },
}
