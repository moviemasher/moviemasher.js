import { Scalar, StringSetter } from "@moviemasher/moviemasher.js"
import React from "react"

import { WithClassName } from "../Types/Core"

export interface SliderProps extends WithClassName {
  max? : number
  min? : number
  onChange: StringSetter
  step? : number
  value : Scalar
  name?: string
  disabled?: boolean
}

export function Slider(props: SliderProps) {
  const { className, max, min, onChange, step, value, name, disabled } = props
  const options: WithClassName = { ...props }
  const classes = ['slider']
  if (className) classes.push(className)
  options.className = classes.join(' ')
 
  return <input type='range' max={max} min={min} step={step} name={name}
    value={Number(value)} disabled={disabled}
    onChange={event => onChange(event.currentTarget.value)} 
    className={classes.join(' ')} 
  />
}
