import React from "react"
import { Effect, Propertied } from "@moviemasher/moviemasher.js"

import { InspectorContext } from "../Contexts/InspectorContext"

export const useSelectedEffect = (propertied?: Propertied): Effect | undefined => {
  if (propertied) return propertied as Effect

  const inspectorContext = React.useContext(InspectorContext)
  return inspectorContext.effect as Effect
}
