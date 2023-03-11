import React from "react"
import { View } from "../../Utilities/View"
import { PlayerContext } from "./PlayerContext"

import { PropsClickable, PropsWithChildren } from "../../Types/Props"
import { useContext } from "../../Framework/FrameworkFunctions"
import Show from "../../Framework/Show/Show.lite"
import Clickable from "../Clickable/Clickable.lite"
import MasherContext from "../Masher/MasherContext"


export function PlayerButton(props: PropsClickable) {
  const playerContext = useContext(PlayerContext)
  const masherContext = useContext(MasherContext)
  const { paused, changePaused } = playerContext

  if (!playerContext.paused) return null

  return  <Show when={playerContext.paused}>
    <Clickable key='player-button-play' 
      label={props.label}
      onClick={() => changePaused(!paused)}
      className={props.className}
    >{masherContext.icons.play}</Clickable>
  </Show>
  // <PlayerPlaying key='playing'>{icons.pause}</PlayerPlaying>
  // <PlayerNotPlaying key='not-playing'></PlayerNotPlaying>
  
  
  // <View 
  //   className={props.className} 
  //   key='player-button' 
  //   onClick={() => changePaused(!paused)}
  // >{props.children}</View>
}
