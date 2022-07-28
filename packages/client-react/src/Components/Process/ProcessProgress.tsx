import React from 'react'

import { PropsWithoutChild, ReactResult } from '../../declarations'
import { ProcessContext } from '../../Contexts/ProcessContext'

/**
 * @parents Process, ProcessActive
 */
export function ProcessProgress(_: PropsWithoutChild): ReactResult {
  const processContext = React.useContext(ProcessContext)

  const { progress, processing } = processContext
  // if (!processing) return null

  const progressProps = {
    value: progress, max: 1.0, children: `${Math.round(100.0 * progress)}%`
  }
  return <progress {...progressProps} />
}
