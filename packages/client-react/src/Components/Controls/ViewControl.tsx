import React from "react"
import { assertEndpoint, assertMashMedia, endpointFromUrl, endpointUrl, EventType, isMashMedia, urlForEndpoint } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"


export function ViewControl(props: PropsAndChild): ReactResult {
  const editor = useEditor()

  const getDisabled = () => {
    const { mashMedia } = editor
    if (!isMashMedia(mashMedia)) return true

    const { encodings } = mashMedia
  
    return !encodings.length
  }
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => setDisabled(getDisabled())
  useListeners({
    [EventType.Render]: updateDisabled,
    [EventType.Loaded]: updateDisabled
  })

  const { children, ...rest } = props

  const onClick = () => {
    if (disabled) return

    const { mashMedia } = editor
    assertMashMedia(mashMedia)
    
    const { encodings } = mashMedia
    const [encoding] = encodings
    const {endpoint} = encoding.request
    assertEndpoint(endpoint)
    
    const url = endpointUrl(endpoint)
    window.open(url)
  }
  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
