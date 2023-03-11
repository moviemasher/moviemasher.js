import React from 'react'

import /* type */ { PropsClickable, WithOnClick } from '../../Types/Props'


import Show from '../../Framework/Show/Show.lite'
import Button from '../Button/Button'
import DivContainerClickable from '../Div/DivContainerClickable/DivContainerClickable.lite'


export interface ClickableProps extends PropsClickable, WithOnClick {
  
}
export default function Clickable (props: ClickableProps) {
  return <Show 
    when={props.button} 
    else={
      <DivContainerClickable 
        className={ props.className } 
        onClick={ event => props.onClick(event) } 
      >{props.children}</DivContainerClickable>
    }>
    <Button 
      className={ props.className } 
      onClick={ event => props.onClick(event) } 
    >{props.children}</Button>
  </Show>
}