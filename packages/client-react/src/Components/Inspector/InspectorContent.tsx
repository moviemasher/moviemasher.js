import React from 'react'

import { PropsWithChildren, ReactResult } from '../../declarations'
import { View } from '../../Utilities/View'

/**
 * @parents Inspector
 */
export function InspectorContent(props: PropsWithChildren): ReactResult {
  return <View {...props} />
}
