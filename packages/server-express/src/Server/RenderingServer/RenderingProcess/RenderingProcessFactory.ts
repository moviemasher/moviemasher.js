import { RenderingProcessArgs } from "./RenderingProcess"
import { RenderingProcessClass } from "./RenderingProcessClass"

const renderingProcessInstance = (options: RenderingProcessArgs) => {
  return new RenderingProcessClass(options)
}

export { renderingProcessInstance }
