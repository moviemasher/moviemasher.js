import React from "react"
import { MashEditor } from "@moviemasher/moviemasher.js"
import { MasherContext } from "../Contexts/MasherContext"

export const useMashEditor = (): MashEditor => React.useContext(MasherContext).mashEditor!
