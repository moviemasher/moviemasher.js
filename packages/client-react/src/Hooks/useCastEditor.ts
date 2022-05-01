import React from "react"
import { CastEditor } from "@moviemasher/moviemasher.js"
import { CasterContext } from "../Contexts/CasterContext"

export const useCastEditor = (): CastEditor => React.useContext(CasterContext).castEditor!
