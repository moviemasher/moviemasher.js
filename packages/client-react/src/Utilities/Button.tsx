import React from "react"
import { UnknownObject } from "@moviemasher/moviemasher.js"
import { ReactResult } from "../declarations"

interface ButtonProps extends UnknownObject {
  onClick? : (event : React.MouseEvent<HTMLButtonElement>) => void
  startIcon? : React.ReactElement
  endIcon? : React.ReactElement
  children? : React.ReactElement | React.ReactText
}

function Button(props: ButtonProps): ReactResult {
  const { startIcon, endIcon, children, ...rest } = props
  const kids = []
  if (children) {
    if (typeof children === 'string' || typeof children === 'number') {
      if (startIcon) kids.push(React.cloneElement(startIcon, { key: 'start' }))
      kids.push(children)
      if (endIcon) kids.push(React.cloneElement(endIcon, { key: 'end' }))
    } else kids.push(React.cloneElement(children as React.ReactElement, { key: 'child' }))
  }
  return <button children={kids} { ...rest } />
}

export { Button, ButtonProps }
