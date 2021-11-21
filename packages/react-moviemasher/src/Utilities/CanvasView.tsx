import React from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js"

interface CanvasViewProps extends UnknownObject {
  children?: never
}
const CanvasView = React.forwardRef<HTMLCanvasElement, CanvasViewProps>((props, ref) =>
  <canvas { ...props } ref={ref} />
)

export { CanvasView, CanvasViewProps }
