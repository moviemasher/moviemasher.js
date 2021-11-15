import React from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js"

const CanvasView = React.forwardRef<HTMLCanvasElement, UnknownObject>((props, ref) =>
  <canvas { ...props } ref={ref} />
)

export { CanvasView }
