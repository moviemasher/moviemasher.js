import React from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js"

export interface CanvasViewProps extends UnknownObject {
  children?: never
}

export const CanvasView = React.forwardRef<HTMLCanvasElement, CanvasViewProps>((props, ref) =>
  <canvas { ...props } ref={ref} />
)
