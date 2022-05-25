import React from "react"
import { PropsWithChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"

export interface StreamerProps extends PropsWithChildren, WithClassName  {

}
export function Streamer(props: StreamerProps): ReactResult {


  return (
    <View {...props} />
  )
}
