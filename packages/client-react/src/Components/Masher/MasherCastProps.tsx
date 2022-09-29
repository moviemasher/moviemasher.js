import React from 'react'
import { EditType } from '@moviemasher/moviemasher.js'

import { PropsMethod } from '../../declarations'
import { Composer } from '../Composer/Composer'
import { EditorProps, MasherProps } from './Masher'
import { DefaultComposerProps } from '../Composer/ComposerPropsDefault'
import { MasherDefaultProps } from './MasherDefaultProps'

export const MasherCastProps: PropsMethod<EditorProps, MasherProps> = function (props = {}) {
  props.className ||= 'editor caster'
  const mashProps = MasherDefaultProps(props)
  const { panels = {} } = props
  const { composer = {} } = panels
  if (!composer) return mashProps

  composer.icons ||= props.icons
  const children = <>
    {mashProps.children}
    <Composer { ...DefaultComposerProps(composer) }  />
  </>
  return { ...mashProps, children, editType: EditType.Cast }
}
