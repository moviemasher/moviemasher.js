import React from 'react'
import { ProcessContext } from '../../Contexts/ProcessContext'
import { PropsWithChildren, ReactResult } from '../../declarations'

interface ProcessInactiveProps extends PropsWithChildren { }

/**
 * @parents Process
 */
function ProcessInactive(props: ProcessInactiveProps): ReactResult {
  const processContext = React.useContext(ProcessContext)
  if (processContext.processing) return null

  return <>{props.children}</>
}

export { ProcessInactive, ProcessInactiveProps }
