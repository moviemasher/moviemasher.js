import React from "react"
import { View } from "../../Utilities/View"

import { WithClassName } from "../../Types/Core"
import { PropsWithoutChild } from "../../Types/Props"
import { EventType, stringSeconds } from "@moviemasher/moviemasher.js"
import { useMasher } from "../../Hooks/useMasher"
import { useListeners } from "../../Hooks/useListeners"

export interface PlayerTimeProps extends PropsWithoutChild, WithClassName {}

/**
 *
 * @parents MasherApp
 */
export function PlayerTime(props: PlayerTimeProps) {
  const editor = useMasher()
  const getTimeRange = () => editor.timeRange
  const [timeRange, setTimeRange] = React.useState(getTimeRange)
  const update = () => { setTimeRange(getTimeRange()) }

  useListeners({
    [EventType.Time]: update, [EventType.Duration]: update,
  })

  const { seconds, fps, lengthSeconds } = timeRange

  const viewChildren = [
    stringSeconds(seconds, fps, lengthSeconds), "/",
    stringSeconds(lengthSeconds, fps, lengthSeconds),
  ]

  const viewProps = { ...props, key: 'player-time', children: viewChildren }

  return <View {...viewProps} />
}
