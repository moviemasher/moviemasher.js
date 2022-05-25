import React from "react"
import { Layer } from "@moviemasher/moviemasher.js"
import { LayerContext } from "../Contexts/LayerContext"

export const useLayer = (): Layer => React.useContext(LayerContext).layer!
