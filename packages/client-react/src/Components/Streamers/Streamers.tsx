import React from "react"
import { PropsWithChildren, ReactResult, WithClassName } from "../../declarations"
import { View } from "../../Utilities/View"

export interface StreamersProps extends PropsWithChildren, WithClassName  {

}
export function Streamers(props: StreamersProps): ReactResult {


  return (
    <View {...props} />
  )
}
