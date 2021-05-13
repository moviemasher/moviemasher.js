
module.exports = { 
  preset: "rollup-jest",
  // collectCoverage: true,
  coverageReporters: ["text", "text-summary", "lcov"],
  // transform: {
  //   "\\.js$": ["rollup-jest", {"configFile": "./rollup.config.js"}]
  // }
  "automock": false,
  "setupFiles": ["./test/setupJest.js"]

}
 

