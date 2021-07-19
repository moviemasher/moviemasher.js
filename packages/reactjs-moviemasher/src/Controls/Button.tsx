import React, {ReactElement, FC, MouseEvent, ReactText } from "react"

interface KeyClass {
  key: string
  className: string
}
interface ButtonProps extends Partial<KeyClass> {
  onClick? : (event : MouseEvent<HTMLButtonElement>) => void
  startIcon? : ReactElement
  endIcon? : ReactElement
  children? : ReactElement | ReactText
}

const ButtonCloneElement = (element : ReactElement, values : KeyClass) => {
  const { props } = element
  const { className, ...rest } = props
  const { className: valuesClassName, ...valuesRest } = values
  const classes = [valuesClassName]
  if (className) classes.push(className)

  const options = { ...rest, ...valuesRest, className: classes.join(' ') }
  return React.cloneElement(element, options)
}
const ButtonCloneOptions = (key : string) => ({
  key, className: `${ButtonIconClass} ${ButtonIconClass}-${key}`
})

const ButtonClass = 'moviemasher-button'
const ButtonIconClass = `${ButtonClass}-icon`

const Button : FC<ButtonProps> = (props) => {
  const { startIcon, endIcon, children, className, ...rest } = props
  const classes = ['moviemasher-control']
  if (className) classes.push(className)
  const kids = []
  if (children) {
    if (typeof children === 'string' || typeof children === 'number') {
      if (startIcon) kids.push(ButtonCloneElement(startIcon, ButtonCloneOptions('start')))
      kids.push(children)
      if (endIcon) kids.push(ButtonCloneElement(endIcon, ButtonCloneOptions('end')))
      if (startIcon || endIcon) classes.push(`${ButtonClass}-text`)

    } else kids.push(ButtonCloneElement(children as ReactElement, ButtonCloneOptions('child')))
  }

  return <button children={kids} className={classes.join(' ')} { ...rest } />
}

export { Button, ButtonProps }
