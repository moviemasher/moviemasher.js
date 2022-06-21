
const NodeEnvironment = require('jest-environment-jsdom')

class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context)
    this.testPath = context.testPath
  }

  async setup() {
    await super.setup()
    this.global.testPath = this.testPath
  }
}

module.exports = CustomEnvironment
