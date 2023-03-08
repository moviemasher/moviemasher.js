import React from "react"

import /* type */ { Identified, Strings } from "@moviemasher/moviemasher.js"
import /* type */ { ClickableProps } from "../Clickable/Clickable.lite"

import { ClassSelected } from "@moviemasher/moviemasher.js"
import { className } from "@moviemasher/client-core"
import { propsMediaTypes } from "../../Utilities/Props"
import { BrowserContext } from "./BrowserContext"
import { useContext } from "../../Framework/FrameworkFunctions"
import Clickable from "../Clickable/Clickable.lite"
import { PropsClickable } from "../../Types/Props"

export interface BrowserPickerProps extends PropsClickable, Identified {
  type?: string
  types?: string | Strings
}

export function BrowserPicker(props: BrowserPickerProps) {
  const { type, types, id } = props

  const browserContext = useContext(BrowserContext)
  const { pick, picked, addPicker, removePicker } = browserContext

  React.useEffect(() => {
    addPicker(id, propsMediaTypes(type, types, id))
    return () => { removePicker(id) }
  }, [])

  return <Clickable key={`browser-picker-${id}`}
    button={props.button}
    label={props.label}
    onClick={ () => pick(id) }
    className={className(picked === props.id, props.className, ClassSelected)}
  >{props.children}</Clickable>
}
