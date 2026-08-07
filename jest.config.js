module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.(spec|test).{ts,tsx,js,jsx}"],
}
