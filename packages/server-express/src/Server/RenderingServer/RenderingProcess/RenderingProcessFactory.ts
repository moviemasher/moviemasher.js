import { RenderingProcessArgs } from "./RenderingProcess"
import { RenderingProcessClass } from "./RenderingProcessClass"

export const renderingProcessInstance = (options: RenderingProcessArgs) => {
  return new RenderingProcessClass(options)
}
