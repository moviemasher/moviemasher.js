import { MediaType } from '@moviemasher/lib-core'
import React from 'react'


import { PropsAndChildren } from "../../Types/Props"
import { useMasher } from '../../Hooks/useMasher'
import { propsMediaTypes } from '../../Utilities/Props'

export interface MashingProps extends PropsAndChildren {
  type?: string
  types?: string | string[]
}

/**
 * @parents MasherApp
 */
export function Mashing(props: MashingProps) {
  const { type, types, children } = props
  const mediaTypes = propsMediaTypes(type, types)
  const editor = useMasher()
  return mediaTypes.includes(editor.mashingType as MediaType) ? <>{children}</> : null
}
