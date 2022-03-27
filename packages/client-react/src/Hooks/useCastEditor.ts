import React from "react"
import { CastEditor } from "@moviemasher/moviemasher.js"
import { CasterContext } from "../Contexts/CasterContext"

const useCastEditor = (): CastEditor => React.useContext(CasterContext).castEditor!

export { useCastEditor }
