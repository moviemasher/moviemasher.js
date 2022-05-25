import { Errors } from '@moviemasher/moviemasher.js'
import React from 'react'

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from '../../Utilities/View'
import { PanelContent } from './PanelContent'
import { PanelFoot, PanelFootElement } from './PanelFoot'
import { PanelHead, PanelHeadElement } from './PanelHead'

// type PanelChild = PanelHeadElement | PanelFootElement
export interface PanelsProps extends PropsAndChildren, WithClassName {

}

export function Panels(props: PanelsProps): ReactResult {
  const { children, className } = props
  // const kids = React.Children.toArray(children)
  // const findElement = (functionComponent: React.FunctionComponent<PropsAndChildren>): React.ReactElement => {
  //   const headElement = kids.find(child => {
  //     if (!React.isValidElement(child)) return false


  //     const { type } = child
  //     return type === functionComponent
  //   })
  //   if (!headElement) throw Errors.internal

  //   return headElement as React.FunctionComponentElement<typeof functionComponent>
  // }

  // const head = findElement(PanelHead)
  // const foot = findElement(PanelFoot)
  // const content = findElement(PanelContent)

  const viewProps = {
    className,
    children
  }
  return <View { ...viewProps } />
}
