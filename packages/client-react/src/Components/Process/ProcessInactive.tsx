import React from 'react'
import { ProcessContext } from '../../Contexts/ProcessContext'
import { PropsWithChildren, ReactResult } from '../../declarations'

export interface ProcessInactiveProps extends PropsWithChildren { }

/**
 * @parents Process
 */
export function ProcessInactive(props: ProcessInactiveProps): ReactResult {
  const processContext = React.useContext(ProcessContext)
  if (processContext.processing) return null

  return <>{props.children}</>
}
