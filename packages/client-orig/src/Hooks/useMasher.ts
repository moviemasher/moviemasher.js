import React from "react"
import { Masher } from "@moviemasher/lib-core"
import MasherContext from "../Components/Masher/MasherContext"

export const useMasher = (): Masher => React.useContext(MasherContext).masher!
