import React from 'react'
import { EditType } from '@moviemasher/moviemasher.js'

import { PropsMethod } from '../../declarations'
import { Composer } from '../Composer/Composer'
import { EditorProps, MasherProps } from './Masher'
import { ComposerDefaultProps } from '../Composer/ComposerDefaultProps'
import { MasherDefaultProps } from './MasherDefaultProps'

export const MasherCastProps: PropsMethod<EditorProps, MasherProps> = function (props = {}) {
  props.className ||= 'editor caster'
  props.panels ||= {}
  props.panels.composer ||= {}
  props.panels.broadcaster ||= {}
  const mashProps = MasherDefaultProps(props)
  return { ...mashProps, editType: EditType.Cast }
}
