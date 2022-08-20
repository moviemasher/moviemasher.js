import { ClassButton, ClassDisabled, ClassSelected } from "@moviemasher/moviemasher.js"
import React from "react"
import { PropsAndChildren, ReactResult, WithClassName } from "../declarations"
import { View } from "./View"

export interface ButtonProps extends PropsAndChildren, WithClassName {
  onClick? : (event : React.MouseEvent) => void
  useView?: boolean
  disabled?: boolean
  selected?: boolean
}

export function Button(props: ButtonProps): ReactResult {
  const { useView, selected, ...rest } = props
  if (!useView) return <button { ...rest } />

  const { disabled, className, ...pruned } = rest
  const classes = [ClassButton]
  if (className) classes.push(className)
  if (disabled) classes.push(ClassDisabled)
  else if (selected) classes.push(ClassSelected)
  const viewProps = {
    ...pruned,
    className: classes.join(' ')
  }
  return <View { ...viewProps } />
}
