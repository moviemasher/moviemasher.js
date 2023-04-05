import React from 'react'

import type { PropsWithChildren, WithOnClick } from '../../Types/Props'
import { ClassDisabled, Labeled } from '@moviemasher/lib-core'
import Show from '../../Framework/Show/Show.lite'
import { WithIcon } from '@moviemasher/client-core'
import Text from '../Text/Text.lite'

export interface PropsButton extends PropsWithChildren, WithOnClick, Labeled, WithIcon {}
export default function Button(props: PropsButton) {
  return <button 
    onClick={event => props.onClick(event) }
    disabled={props.className?.includes(ClassDisabled)}
    className={props.className}
   >
    {props.children}
    <Show when={props.icon}>
      <span>{(props.icon)}</span>
    </Show>
    <Show when={props.label}>
      <Text label={props.label} />
    </Show>
  </button>
}
