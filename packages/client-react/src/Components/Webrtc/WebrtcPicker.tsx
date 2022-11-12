import React from "react"
import { 
  ClassSelected, AndId, assertPopulatedString, 
} from "@moviemasher/moviemasher.js"

import { 
  PropsAndChild, ReactResult, WithClassName
 } from "../../declarations"
import { WebrtcContext } from "./WebrtcContext"
import { View } from "../../Utilities/View"

export interface WebrtcPickerProps extends PropsAndChild, AndId, WithClassName {}

/**
 * @parents Webrtc
 */
export function WebrtcPicker(props: WebrtcPickerProps): ReactResult {
  const { className, id, ...rest } = props
  assertPopulatedString(id)

  const webrtcContext = React.useContext(WebrtcContext)
  const { pick, picked } = webrtcContext

  const classes = []
  if (className) classes.push(className)
  if (picked === id) classes.push(ClassSelected)

  const viewProps = { 
    ...rest, 

    className: classes.join(' '),
    key: `webrtc-picker-${id}`,
    onClick: () => { pick(id) }, 
    
  }
  return <View { ...viewProps } />
}
