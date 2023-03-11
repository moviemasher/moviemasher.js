import React from 'react'


import { PropsWithChildren } from "../../Types/Props"
import { View } from '../../Utilities/View'

export interface PanelsProps extends PropsWithChildren {}

export function Panels(props: PanelsProps) {
  return <View { ...props } />
}
