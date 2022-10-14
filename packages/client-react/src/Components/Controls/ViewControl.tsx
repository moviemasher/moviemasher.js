import React from "react"
import { assertMash, EventType, isMash, urlForEndpoint } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"


export function ViewControl(props: PropsAndChild): ReactResult {
  const editor = useEditor()

  const getDisabled = () => {
  const { edited } = editor
    if (!isMash(edited)) return true

    const { rendering } = edited
    return !rendering
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
    const url = urlForEndpoint(editor.preloader.endpoint, edited.rendering)
    window.open(url)
  }
  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
