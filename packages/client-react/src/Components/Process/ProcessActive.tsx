import React from 'react'
import { ProcessContext } from '../../Contexts/ProcessContext'
import { PropsWithChildren, ReactResult } from '../../declarations'

interface ProcessActiveProps extends PropsWithChildren { }

/**
 * @parents Process
 */
function ProcessActive(props: ProcessActiveProps): ReactResult {
  const processContext = React.useContext(ProcessContext)
  if (!processContext.processing) return null

  return <>{props.children}</>
}

export { ProcessActive, ProcessActiveProps }
