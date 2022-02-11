import React from "react"
import { MashEditor } from "@moviemasher/moviemasher.js"
import { MasherContext } from "../Contexts/MasherContext"

const useMashEditor = (): MashEditor => React.useContext(MasherContext).mashEditor!

export { useMashEditor }
