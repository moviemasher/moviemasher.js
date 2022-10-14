import React from "react"
import { Clip } from "@moviemasher/moviemasher.js"

import { ClipContext } from "./ClipContext"

export const useClip = (): Clip => React.useContext(ClipContext).clip!
