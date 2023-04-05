import React from 'react'
import { translateArgs, isTranslateArgs } from '@moviemasher/lib-core'

import type { Labeled } from '@moviemasher/lib-core'
import type { PropsContained } from '../../Types/Props'

import Show from '../../Framework/Show/Show.lite'
import TranslationLabel from '../Translation/TranslationLabel/TranslationLabel.lite'

export interface TextProps extends PropsContained, Labeled {}

export default function Text(props: TextProps) {
  return <Show 
    when={ isTranslateArgs(props.label) }
    else={ <>{ String(props.label) }</> }
  ><TranslationLabel label={translateArgs(props.label)} /></Show>
}