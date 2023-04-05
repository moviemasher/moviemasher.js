import React from 'react'

import type { TranslateArgs } from '@moviemasher/lib-core'
import type { PropsContained } from '../../../Types/Props'

import { useContext } from '@builder.io/mitosis'
import ClientContext from '../../Contexts/ClientContext/ClientContext.context'
export interface TranslationProps extends PropsContained, TranslateArgs {}

export default function TranslationText(props: TranslationProps) {
  return <>{useContext(ClientContext).client!.translate(props)}</>
}