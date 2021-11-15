import React from "react"

import { InspectorContext } from "./InspectorContext"

const useSelected = () => {
  const inspectorContext = React.useContext(InspectorContext)
  return inspectorContext.clip || inspectorContext.mash
}

export { useSelected }
