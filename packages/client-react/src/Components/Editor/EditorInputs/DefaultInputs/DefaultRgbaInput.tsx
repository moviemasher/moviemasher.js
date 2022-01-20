import React from 'react'
import { colorAlphaColor, colorRgbaToHex, colorToRgb } from '@moviemasher/moviemasher.js'
import { InputContext } from '../../../../Contexts/InputContext'
import { View } from '../../../../Utilities/View'
import { ReactResult } from '../../../../declarations'

function DefaultRgbaInput(): ReactResult {
    const colorInputRef = React.useRef<HTMLInputElement>(null)
  const alphaInputRef = React.useRef<HTMLInputElement>(null)
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  const { alpha, color } = colorAlphaColor(String(value))

  const onChange = () => {
    const colorValue = colorInputRef.current?.value || ''
    const alphaValue = alphaInputRef.current?.value || ''

    const rgb = colorToRgb(colorValue)
    const rgba = { a: Number(alphaValue), ...rgb }
    const value = colorRgbaToHex(rgba)
    changeHandler(property, value)
  }

  const colorProps = {
    type: 'color',
    name: `${property}-color`,
    key: `${property}-color`,
    value: color,
    onChange,
    ref: colorInputRef,
  }

  const alphaProps = {
    type: 'range',
    min: 0.0,
    max: 1.0,
    step: 0.01,
    name: `${property}-alpha`,
    key: `${property}-alpha`,
    value: alpha,
    onChange,
    ref: alphaInputRef,
  }

  return <View><input {...colorProps} /><input {...alphaProps} /></View>

}

export { DefaultRgbaInput }
