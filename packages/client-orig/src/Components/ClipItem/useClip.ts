import React from "react"
import { Clip } from "@moviemasher/lib-core"

import { ClipContext } from "./ClipContext"

export const useClip = (): Clip => React.useContext(ClipContext).clip!
