import React from "react"
import { EventType, SelectType, assertSelectType, isEffect, isClip, isTrack } from "@moviemasher/moviemasher.js"
import { useListeners } from "../../Hooks/useListeners"
import { PropsAndChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"

export interface EditorRemoveButtonProps extends PropsAndChild {
  type: string
}

export function EditorRemoveButton(props: EditorRemoveButtonProps): ReactResult {
  const { children, type, ...rest } = props
  const selectType = type || SelectType.Clip
  assertSelectType(selectType)

  const editor = useEditor()
  const [disabled, setDisabled] = React.useState(!editor.selection[selectType])
  useListeners({
    [EventType.Selection]: () => { setDisabled(!editor.selection[selectType]) }
  })

  const onClick = () => {
    if (disabled) return

    const selectable = editor.selection[selectType]
    if (isEffect(selectable)) editor.removeEffect(selectable)
    else if (isClip(selectable)) editor.removeClip(selectable)
    else if (isTrack(selectable)) editor.removeTrack(selectable)
  }

  const cloneProps = { ...rest, onClick, disabled }
  return  React.cloneElement(React.Children.only(children), cloneProps)
}
