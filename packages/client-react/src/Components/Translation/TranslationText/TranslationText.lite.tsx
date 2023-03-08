import React from 'react'

import /* type */ { TranslateArgs } from '@moviemasher/moviemasher.js'
import /* type */ { PropsContained } from '../../../Types/Props'

import { useClient } from '../../../Hooks/useClient'

export interface TranslationProps extends PropsContained, TranslateArgs {}

export default function TranslationText(props: TranslationProps) {
  const client = useClient()
  return <>{client.translate(props)}</>
}