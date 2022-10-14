import React from "react"
import { WithClassName, ReactResult, SliderChangeHandler } from "../declarations";

export interface SliderProps extends WithClassName {
  value? : number
  step? : number
  max? : number
  min? : number
  onChange? : SliderChangeHandler
}

export function Slider(props: SliderProps): ReactResult {
  const { className, onChange } = props
  const options : WithClassName = { ...props }
  const classes = ['slider']
  if (className) classes.push(className)
  options.className = classes.join(' ')
  if (onChange) {
    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
      onChange(event, event.currentTarget.valueAsNumber)
    }
    options.onChange = handleChange
  }

  const input = <input type='range' { ...options } />
  return input
}
