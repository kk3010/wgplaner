module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  resetMocks: false,
  setupFiles: ['jest-localstorage-mock'],
  collectCoverageFrom: ['./src/**/*.ts', '!**/*.spec.ts', '!**/*.d.ts'],
  coverageDirectory: './coverage',
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura', 'json-summary'],
}
