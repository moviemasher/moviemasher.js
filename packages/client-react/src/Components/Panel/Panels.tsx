import React from 'react'

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from '../../Utilities/View'

export interface PanelsProps extends PropsAndChildren, WithClassName {}

export function Panels(props: PanelsProps): ReactResult {
  return <View { ...props } />
}
