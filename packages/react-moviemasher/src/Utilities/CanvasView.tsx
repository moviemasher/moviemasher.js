import React from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js"

const CanvasView = React.forwardRef<HTMLCanvasElement, UnknownObject>((props, reference) => (
  <canvas { ...props } ref={reference} />
))

export { CanvasView }
