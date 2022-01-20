import { Output, OutputObject } from "./Output"
import { OutputClass } from "./OutputClass"

const outputInstance = (object : OutputObject) : Output => new OutputClass(object)

/**
 * @category Factory
 */
const OutputFactory = { instance: outputInstance }

export { OutputFactory }
