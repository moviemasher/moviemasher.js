import React from 'react'

import type { PropsWithChildren, WithOnClick } from '../../../Types/Props'

export interface PropsDivContainerClickable extends PropsWithChildren, WithOnClick {}

export default function DivContainerClickable(props: PropsDivContainerClickable) {
  return <div 
    className={ props.className } 
    onClick={ event => props.onClick(event) }
  >{props.children}</div>
}