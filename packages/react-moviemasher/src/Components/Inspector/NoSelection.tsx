import React from 'react'

import { InspectorContext } from '../../Contexts/InspectorContext'

const NoSelection: React.FunctionComponent = props => {
  const inspectorContext = React.useContext(InspectorContext)
  const { track } = inspectorContext

  if (track) return null

  const { children } = props
  return <>{children}</>
}

export { NoSelection }
