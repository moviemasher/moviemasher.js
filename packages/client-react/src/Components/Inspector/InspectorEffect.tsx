import { Effect } from '@moviemasher/moviemasher.js'
import React from 'react'

import { ReactResult, WithClassName } from '../../declarations'
import { View } from '../../Utilities'

interface InspectorEffectProps extends WithClassName {
  effect: Effect
}

/**
 * @parents DefaultEffectsInput
 */
function InspectorEffect(props: InspectorEffectProps): ReactResult {
  const { effect } = props
  const viewProps = {
    children: effect.label,
    className: 'effect',
  }
  return <View {...viewProps} />
}

export { InspectorEffect, InspectorEffectProps }
