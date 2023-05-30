import { RenderingProcessArgs } from "./RenderingProcess.js"
import { RenderingProcessClass } from "./RenderingProcessClass.js"

export const renderingProcessInstance = (options: RenderingProcessArgs) => {
  return new RenderingProcessClass(options)
}
