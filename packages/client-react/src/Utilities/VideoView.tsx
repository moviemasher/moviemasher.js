import React from "react"
import { PropsWithoutChild } from "../declarations"


export const VideoView = React.forwardRef<HTMLVideoElement, PropsWithoutChild>((props, ref) =>
  <video { ...props } ref={ref} />
)
