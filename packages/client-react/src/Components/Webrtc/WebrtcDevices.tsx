import React from "react"

import { PropsWithoutChild, ReactResult, WithClassName } from "../../declarations"
import { useDevices } from "../../Hooks/useDevices"
import { View } from "../../Utilities/View"
import { WebrtcDevice } from "./WebrtcDevice"

export interface WebrtcDevicesProps extends PropsWithoutChild, WithClassName {}

/**
 * @parents WebrtcContent
 * @children WebrtcDevice
 */
export function WebrtcDevices(props: WebrtcDevicesProps): ReactResult {
  const devices = useDevices()

  const viewProps = {
    ...props, children: devices.map(device => {
      return <WebrtcDevice key={device.id} deviceInfo={device}/>
    })
  }
  return <View { ...viewProps } />
}
