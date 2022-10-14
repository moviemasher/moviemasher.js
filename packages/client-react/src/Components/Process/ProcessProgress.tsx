import React from 'react'

import { PropsWithoutChild, ReactResult } from '../../declarations'
import { ProcessContext } from '../../Contexts/ProcessContext'
import { View } from '../../Utilities/View'

/**
 * @parents Process, ProcessActive
 */
export function ProcessProgress(_: PropsWithoutChild): ReactResult {
  const processContext = React.useContext(ProcessContext)

  const { progress, processing } = processContext
  if (!processing) return <View className="progress-holder"/>

  const progressProps = {
    value: progress, max: 1.0, children: `${Math.round(100.0 * progress)}%`
  }
  return <progress {...progressProps} />
}
