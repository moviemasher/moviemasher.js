import React from 'react'
import { ProcessContext } from '../../Contexts/ProcessContext'
import { PropsWithChildren, ReactResult } from '../../declarations'

export interface ProcessActiveProps extends PropsWithChildren { }

/**
 * @parents Process
 */
export function ProcessActive(props: ProcessActiveProps): ReactResult {
  const processContext = React.useContext(ProcessContext)
  const { processing, error } = processContext
  if (!(processing || error)) return null

  return <>{props.children}</>
}
