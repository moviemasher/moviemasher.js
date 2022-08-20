import React from "react"
import { ClassSelected, AndId, assertPopulatedString, assertTrue } from "@moviemasher/moviemasher.js"

import { 
  PropsAndChild, ReactResult, WithClassName
 } from "../../declarations"
import { propsDefinitionTypes } from "../../Utilities/Props"
import { View } from "../../Utilities/View"
import { BrowserContext } from "./BrowserContext"
import { Problems } from "../../Setup/Problems"

export interface BrowserPickerProps extends PropsAndChild, AndId, WithClassName {
  type?: string
  types?: string | string[]
}

/**
 * @parents Browser
 */
export function BrowserPicker(props: BrowserPickerProps): ReactResult {
  const { children, type, types, className, id, ...rest } = props
  assertPopulatedString(id)

  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child), Problems.child)

  
  const browserContext = React.useContext(BrowserContext)

  const { pick, picked, addPicker, removePicker } = browserContext

  const classes = []
  if (className) classes.push(className)
  if (picked === id) classes.push(ClassSelected)

  const onClick = () => { pick(id) }

  React.useEffect(() => {
    addPicker(id, propsDefinitionTypes(type, types, id))
    return () => { removePicker(id) }
  }, [])


  const viewProps = { 
    ...rest, 
    className: classes.join(' '),
    key: `browser-picker-${id}`,
    onClick, 
   }
   
  return React.cloneElement(child, viewProps)
}
