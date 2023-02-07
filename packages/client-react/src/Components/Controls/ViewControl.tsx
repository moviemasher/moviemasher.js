import React from "react"
import { assertMash, endpointFromUrl, endpointUrl, EventType, isMash, urlForEndpoint } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"


export function ViewControl(props: PropsAndChild): ReactResult {
  const editor = useEditor()

  const getDisabled = () => {
    const { edited } = editor
    if (!isMash(edited)) return true

    const { encodings } = edited
  
    return !encodings.length
  }
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => setDisabled(getDisabled())
  useListeners({
    [EventType.Render]: updateDisabled,
    [EventType.Mash]: updateDisabled
  })

  const { children, ...rest } = props

  const onClick = () => {
    if (disabled) return

    const { edited } = editor
    assertMash(edited)
    
    const { encodings } = edited
    const [encoding] = encodings
    const url = endpointUrl(encoding.request.endpoint)
    window.open(url)
  }
  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
