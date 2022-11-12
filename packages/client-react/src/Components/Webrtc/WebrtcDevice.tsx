import { ClassDisabled, ClassItem, ClassSelected, UnknownObject } from "@moviemasher/moviemasher.js"
import React from "react"

import { PropsWithChildren, ReactResult, WithClassName } from "../../declarations"
import { WebrtcDeviceInfo } from "../../Hooks/useDevices"
import { Button } from "../../Utilities"
import { View } from "../../Utilities/View"
import { MasherContext } from "../Masher/MasherContext"
import { WebrtcContext } from "./WebrtcContext"

export interface WebrtcDeviceProps extends PropsWithChildren, WithClassName {
  deviceInfo: WebrtcDeviceInfo
}

/**
 * @parents WebrtcDevices
 */
export function WebrtcDevice(props: WebrtcDeviceProps): ReactResult {

  const webrtcContext = React.useContext(WebrtcContext)
  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
  const { 
    audioDeviceId, videoDeviceId, setAudioDeviceId, setVideoDeviceId 
  } = webrtcContext
  const { deviceInfo, ...rest } = props

  const { id, audioinput: audio, videoinput: video } = deviceInfo

  const audioOrVideo = audio || video
  if (!audioOrVideo) return null

  const label = audioOrVideo.label || audioOrVideo.deviceId

  const viewChildren = [<label key="label" children={label}/>]
  const audioKey = audio ? 'mic' : 'micDisabled'
  const videoKey = video ? 'cam' : 'camDisabled'
  const audioClasses = []
  const videoClasses = []
  const audioProps: UnknownObject = { key: 'audio' }
  const videoProps: UnknownObject = { key: 'video' }

  if (audio) {
    const aPicked = audio.deviceId === audioDeviceId
    if (aPicked) audioClasses.push(ClassSelected)
    audioProps.onClick = () => { setAudioDeviceId(aPicked ? '' : audio.deviceId)}
  } else audioClasses.push(ClassDisabled)

  if (video) {
    const vPicked = video.deviceId === videoDeviceId
    if (vPicked) videoClasses.push(ClassSelected)
    videoProps.onClick = () => { setVideoDeviceId(vPicked ? '' : video.deviceId)}
  } else videoClasses.push(ClassDisabled)

  
  audioProps.className = audioClasses.join(' ')
  audioProps.children = React.cloneElement(icons[audioKey])
  videoProps.className = videoClasses.join(' ')
  videoProps.children = React.cloneElement(icons[videoKey])

  viewChildren.push(<View { ...audioProps } />)
  viewChildren.push(<View { ...videoProps } />)

  const viewProps = {
    className: ClassItem,
    ...rest, children: viewChildren,
    key: id
  }

  return <View { ...viewProps } />
}
