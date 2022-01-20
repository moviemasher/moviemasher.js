import React from 'react'
import { ProcessContext } from '../../Contexts/ProcessContext'
import { PropsWithoutChild, ReactResult } from '../../declarations'

interface ProcessStatusProps extends PropsWithoutChild { }

/**
 * @parents Process
 */
function ProcessStatus(_: ProcessStatusProps): ReactResult {
  const processContext = React.useContext(ProcessContext)
  const { status } = processContext
  return <>{status}</>
}

export { ProcessStatus, ProcessStatusProps }
