import React from 'react'

import { PropsWithoutChild, ReactResult, WithClassName } from '../../declarations'
import { ProcessContext } from '../../Contexts/ProcessContext'
import { View } from '../../Utilities/View'

export interface ProcessStatusProps extends PropsWithoutChild, WithClassName {}
/**
 * @parents Process, ProcessActive
 */
export function ProcessStatus(props: ProcessStatusProps): ReactResult {
  const { className, ...rest } = props
  const processContext = React.useContext(ProcessContext)
  const { status, error, setError } = processContext

  const classes = ['process-status']
  if (className) classes.push(className)
  if (error) classes.push('error')

  const onClick = () => { if (error) setError('') }

  const viewProps = {
    ...rest, onClick, key: 'process-status',
    className: classes.join(' '),
    children: error || status || 'hello world'
  }
  return < View {...viewProps} />
}
