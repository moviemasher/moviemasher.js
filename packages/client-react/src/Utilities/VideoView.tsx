import React from "react"
import { PropsWithoutChild } from "../Types/Props"


export const VideoView = React.forwardRef<HTMLVideoElement, PropsWithoutChild>((props, ref) =>
  <video { ...props } ref={ref} />
)
