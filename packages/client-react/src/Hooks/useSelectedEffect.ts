import React from "react"
import { Effect } from "@moviemasher/moviemasher.js"

import { InspectorContext } from "../Contexts/InspectorContext"

export const useSelectedEffect = (): Effect | undefined => {
  const inspectorContext = React.useContext(InspectorContext)
  return inspectorContext.effect!
}
