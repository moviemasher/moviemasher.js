import React from "react"
import { Editor } from "@moviemasher/moviemasher.js"
import { MasherContext } from "../Components/Masher/MasherContext"

export const useEditor = (): Editor => React.useContext(MasherContext).editor!
