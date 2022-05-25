import React from 'react'

import { PropsWithChildren, ReactResult, WithClassName } from '../../declarations'
import { ShooterContext, ShooterContextInterface } from '../../Contexts/ShooterContext'
import { View } from '../../Utilities/View'

export interface ShooterProps extends PropsWithChildren, WithClassName {

}

export function Shooter(props: ShooterProps): ReactResult {
  // const { cast, ...rest } = props
  // const [requested, setRequested] = React.useState(false)
  // const [castEditor] = React.useState(() => castEditorInstance({}))
  // const apiContext = React.useContext(ApiContext)
  const getDevices = () => {
    navigator.mediaDevices.enumerateDevices().then(setDevices)
  }
  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([])

  // const { enabled, endpointPromise } = apiContext
  React.useEffect(getDevices, [])
  // React.useEffect(() => {

  //   if (cast) castEditor.edited = cast
  //   else if (!requested && enabled.includes(ServerType.Data)) {
  //     setRequested(true)
  //     const request: DataCastDefaultRequest = {}
  //     console.debug("DataCastDefaultRequest", Endpoints.data.cast.default, request)
  //     endpointPromise(Endpoints.data.cast.default, request).then((response: DataCastDefaultResponse) => {
  //       console.debug("DataCastDefaultResponse", Endpoints.data.cast.default, response)
  //       const { cast } = response
  //       castEditor.edited = castInstance(cast)
  //     })
  //   }
  // }, [enabled])

  const context: ShooterContextInterface = { devices }
  const viewProps = {
    children: devices.map(device => <View>{JSON.stringify(device)}</View>)
  }
  return (
    <ShooterContext.Provider value={context}>
      <View {...viewProps} />
    </ShooterContext.Provider>
  )
}
