import React from "react"
import { View } from "../../Utilities/View"
import { PropsWithoutChild, ReactResult, WithClassName } from "../../declarations"
import { EventType, stringSeconds } from "@moviemasher/moviemasher.js"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"

export interface PlayerTimeProps extends PropsWithoutChild, WithClassName {}

/**
 *
 * @parents Editor
 */
export function PlayerTime(props: PlayerTimeProps): ReactResult {
  const editor = useEditor()
  const getTimeRange = () => editor.timeRange
  const [timeRange, setTimeRange] = React.useState(getTimeRange)
  const update = () => { setTimeRange(getTimeRange())}

  useListeners({
    [EventType.Time]: update, [EventType.Duration]: update,
  }, editor.eventTarget)

  const {seconds, fps, lengthSeconds } = timeRange

  const viewChildren = [
    stringSeconds(seconds, fps, lengthSeconds), "/",
    stringSeconds(lengthSeconds, fps, lengthSeconds),
  ]

  const viewProps = { ...props, key: 'player-time', children: viewChildren }

  return <View {...viewProps} />
}
