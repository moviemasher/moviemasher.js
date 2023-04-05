import React from "react"

import type { PropsClickable } from "../../Types/Props"

import type { MashIndex, UnknownRecord } from "@moviemasher/lib-core"
import { assertPopulatedString, DefaultContentId, EventType } from "@moviemasher/lib-core"


import { useMasher } from "../../Hooks/useMasher"
import { useListeners } from "../../Hooks/useListeners"
import MasherContext from "../Masher/MasherContext"
import { className } from "@moviemasher/client-core"
import Clickable from "../Clickable/Clickable.lite"


export function TimelineAddClipControl(props:PropsClickable) {
  const masher = useMasher()
  const masherContext = React.useContext(MasherContext)
  const { current, drop } = masherContext
  const getDisabled = () => !masher.selection.mash
  const [disabled, setDisabled] = React.useState(getDisabled)
  const updateDisabled = () => { setDisabled(getDisabled())}
  useListeners({ [EventType.Selection]: updateDisabled })
  
  const { children, ...rest } = props
  const cloneProps: UnknownRecord = { 
    ...rest, 
    disabled,
  }
  cloneProps.onClick = () => { 
    const { selection, mashMedia } = masher
    const { clip, track } = selection
    const id = current.mediaId || DefaultContentId
    assertPopulatedString(id)
    const object = { id }
    const editorIndex: MashIndex = {
      clip: 0, track: -1
    }
    if (clip && track) {
      editorIndex.clip = track.dense ? track.clips.indexOf(clip) : clip.endFrame
      editorIndex.track = track.index
    } else {
      editorIndex.clip = masher.time.scale(mashMedia!.quantize).frame
    }
    drop(object, editorIndex)
  }

  return <Clickable key='add-clip'
    button={props.button}
    label={props.label}
    onClick={ () => masher.undo() }
    className={ className(disabled, props.className) }
  >{props.children}</Clickable>
}
