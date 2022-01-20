import React from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js"

interface VideoViewProps extends UnknownObject {
  children?: never
}

const VideoView = React.forwardRef<HTMLVideoElement, VideoViewProps>((props, ref) =>
  <video { ...props } ref={ref} />
)

export { VideoView, VideoViewProps }
