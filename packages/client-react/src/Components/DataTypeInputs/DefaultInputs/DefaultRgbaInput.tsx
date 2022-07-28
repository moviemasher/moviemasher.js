import React from 'react'
import { colorAlphaColor, colorRgbaToHex, colorToRgb, DataType, UnknownObject } from '@moviemasher/moviemasher.js'
import { InputContext } from '../../../Contexts/InputContext'
import { View } from '../../../Utilities/View'
import { ReactResult } from '../../../declarations'
import { DataTypeInputs } from '../DataTypeInputs'

export function DefaultRgbaInput(): ReactResult {
  const colorInputRef = React.useRef<HTMLInputElement>(null)
  const alphaInputRef = React.useRef<HTMLInputElement>(null)
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value, name } = inputContext
  if (!property) return null

  const { defaultValue } = property
  const { alpha, color } = colorAlphaColor(String(value || defaultValue))

  const colorProps: UnknownObject = {
    type: 'color',
    name: `${name}-color`,
    key: `${name}-color`,
    value: color,
    ref: colorInputRef,
  }

  const alphaProps: UnknownObject = {
    type: 'range',
    min: 0.0,
    max: 1.0,
    step: 0.01,
    name: `${name}-alpha`,
    key: `${name}-alpha`,
    value: alpha,
    ref: alphaInputRef,
  }

  if (changeHandler) {
    alphaProps.onChange = colorProps.onChange = () => {
      const colorValue = colorInputRef.current?.value || ''
      const alphaValue = alphaInputRef.current?.value || ''
      const rgb = colorToRgb(colorValue)
      const rgba = { a: Number(alphaValue), ...rgb }
      const value = colorRgbaToHex(rgba)
      changeHandler(name, value)
    }
  } else {
    alphaProps.disabled = colorProps.disabled = true
  }
  return <View><input {...colorProps} /><input {...alphaProps} /></View>
}

DataTypeInputs[DataType.Rgba] = <DefaultRgbaInput />
