import React from 'react'

import { translateArgs, TranslateArgs } from '@moviemasher/moviemasher.js'
import /* type */ { PropsWithChildren } from '../../../Types/Props'
import { useClient } from '../../../Hooks/useClient'
import SpanContainer from '../../Span/SpanContainer/SpanContainer.lite'

export interface TranslationProps extends PropsWithChildren, TranslateArgs {}

export default function TranslationSpan(props: TranslationProps) {
  const client = useClient()
  return <SpanContainer key='translation'
    className={ props.className }
  >{client.translate(translateArgs(props))}</SpanContainer>
}