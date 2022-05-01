import React from "react"
import { EventType, GraphFile, LoadType } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { useMashEditor } from "../../Hooks/useMashEditor"
import { useListeners } from "../../Hooks/useListeners"


export function ViewControl(props: PropsAndChild): ReactResult {
  const masher = useMashEditor()
  const getDisabled = () => !masher.mash.rendering
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => setDisabled(getDisabled())
  useListeners({
    [EventType.Render]: updateDisabled,
    [EventType.Mash]: updateDisabled
  })

  const { children, ...rest } = props

  const onClick = () => {
    if (disabled) return

    const { mash } = masher
    const graphFile: GraphFile = { file: mash.rendering, type: LoadType.Video }
    const url = mash.preloader.key(graphFile)
    window.open(url)
  }
  const buttonOptions = { ...rest, onClick, disabled }
  return React.cloneElement(React.Children.only(children), buttonOptions)
}
