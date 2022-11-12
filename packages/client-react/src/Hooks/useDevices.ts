import React from "react"
import { 
  DefinitionType, arraySet 
} from "@moviemasher/moviemasher.js"


const DevicesEvent = 'devicechange'


export interface WebrtcDeviceInfo {
  audioinput?: MediaDeviceInfo
  videoinput?: MediaDeviceInfo
  id: string
}

export const useDevices = (): WebrtcDeviceInfo[] => {
  const { mediaDevices } = globalThis.navigator

  const [array, setArray] = React.useState<WebrtcDeviceInfo[]>([])
  const updateDevices = (value: MediaDeviceInfo[]) => {
    console.log("updateDevices MediaDeviceInfo[]", value)
    // const { current } = devices
    const byGroupId: Record<string, WebrtcDeviceInfo> = {}
    value.forEach(info => {
      const { groupId = 'ungrouped', kind } = info
      if (kind === 'audiooutput') return
      byGroupId[groupId] ||= { id: info.deviceId}
      byGroupId[groupId][kind] = info
    })
    const values = Object.values(byGroupId)
    setArray(values)
  }
  const refresh = () => {
    console.log("refresh")

    globalThis.navigator.mediaDevices.enumerateDevices().then(value => {
      updateDevices(value)
    })
  }
  const snapshotGet = () => { 
    return array
  }

  React.useEffect(() => {
    // const { getUserMedia } = globalThis.navigator.mediaDevices
    // const promise = getUserMedia({ audio: true, video: true })
    // promise.then(stream => {
      console.log("useDevices.useEffect")
      refresh() 
    // })
  }, [])

  const externalStore = React.useSyncExternalStore<WebrtcDeviceInfo[]>((callback) => {

    mediaDevices.addEventListener(DevicesEvent, callback)
    
    return () => {
      mediaDevices.removeEventListener(DevicesEvent, callback)
    }
  }, snapshotGet)
  
  return externalStore
}