import React from 'react'
import { assertEditType, EditType } from '@moviemasher/moviemasher.js'

import { PropsAndChildren, ReactResult } from '../../declarations'
import { useEditor } from '../../Hooks/useEditor'

export interface MashingProps extends PropsAndChildren {
  editType: string | EditType
}

/**
 * @parents Masher
 */
export function Mashing(props: MashingProps): ReactResult {
  const { editType, children } = props
  assertEditType(editType)

  const editor = useEditor()
  return editType === editor.editType ? <>{children}</> : null
}
