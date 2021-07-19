import React from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js";
import { SliderChangeHandler } from "../declarations";

interface SliderProps {
  className?: string
  value? : number
  step? : number
  max? : number
  min? : number
  onChange? : SliderChangeHandler
}
// React.ChangeEventHandler<HTMLInputElement>
const Slider : React.FC<SliderProps> = (props) => {

  const { className, onChange } = props
  const options : UnknownObject = { ...props }
  const classes = ['moviemasher-slider']
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

export { Slider }
