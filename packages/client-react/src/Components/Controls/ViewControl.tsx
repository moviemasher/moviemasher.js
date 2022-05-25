import React from "react"
import { assertMash, EventType, GraphFile, LoadType } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"


export function ViewControl(props: PropsAndChild): ReactResult {
  const editor = useEditor()

  const { mash } = editor.selection
  const getDisabled = () => mash ? !mash.rendering : true
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
    const graphFile: GraphFile = { file: edited.rendering, type: LoadType.Video }
    const url = edited.preloader.key(graphFile)
    window.open(url)
  }
  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
