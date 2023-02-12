import React from "react"
import { 
  ClassSelected, Identified, assertPopulatedString, assertTrue 
} from "@moviemasher/moviemasher.js"

import { 
  PropsAndChild, ReactResult, WithClassName
 } from "../../declarations"
import { propsMediaTypes } from "../../Utilities/Props"
import { BrowserContext } from "./BrowserContext"
import { Problems } from "../../Setup/Problems"

export interface BrowserPickerProps extends PropsAndChild, Identified, WithClassName {
  type?: string
  types?: string | string[]
}

/**
 * @parents Browser
 */
export function BrowserPicker(props: BrowserPickerProps): ReactResult {
  const { children, type, types, className, id, ...rest } = props
  assertPopulatedString(id)

  const browserContext = React.useContext(BrowserContext)
  const { pick, picked, addPicker, removePicker } = browserContext

  const classes = []
  if (className) classes.push(className)
  if (picked === id) classes.push(ClassSelected)

  React.useEffect(() => {
    addPicker(id, propsMediaTypes(type, types, id))
    return () => { removePicker(id) }
  }, [])

  const viewProps = { 
    ...rest, 
    className: classes.join(' '),
    key: `browser-picker-${id}`,
    onClick: () => { pick(id) }, 
  }
  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child), Problems.child)
   
  return React.cloneElement(child, viewProps)
}
