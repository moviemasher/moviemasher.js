import { isActionEvent, EventType, isChangeAction } from "@moviemasher/moviemasher.js"
import React from "react"
import { ListenerCallback, PropsWithoutChild, ReactResult } from "../../declarations"
import { useLayer } from "../../Hooks/useLayer"
import { useListeners } from "../../Hooks/useListeners"

export function ComposerLayerLabel(props: PropsWithoutChild): ReactResult {
  const layer = useLayer()
  const [label, setLabel] = React.useState(layer.label)

  const handleAction: ListenerCallback = event => {
    if (!isActionEvent(event)) return

    const { action } = event.detail
    if (isChangeAction(action) && layer === action.target) setLabel(layer.label)
  }

  useListeners({ [EventType.Action]: handleAction })

  const labelProps = { ...props, children: label }
  return <label { ...labelProps } />
}
