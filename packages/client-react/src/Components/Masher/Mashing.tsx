import { MediaType } from '@moviemasher/moviemasher.js'
import React from 'react'

import { PropsAndChildren, ReactResult } from '../../declarations'
import { useEditor } from '../../Hooks/useEditor'
import { propsMediaTypes } from '../../Utilities/Props'

export interface MashingProps extends PropsAndChildren {
  type?: string
  types?: string | string[]
}

/**
 * @parents Masher
 */
export function Mashing(props: MashingProps): ReactResult {
  const { type, types, children } = props
  const mediaTypes = propsMediaTypes(type, types)
  const editor = useEditor()
  return mediaTypes.includes(editor.editType as MediaType) ? <>{children}</> : null
}
