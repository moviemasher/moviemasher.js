import React from 'react'
import { DataType, isDefined, UnknownRecord } from '@moviemasher/lib-core'


import { InputContext } from '../InputContext'
import { DataTypeInputs } from './DataTypeInputs'
import { useMasher } from '../../../../Hooks/useMasher'
import MasherContext from '../../../Masher/MasherContext'

export function RgbTypeInput() {
  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
  const inputContext = React.useContext(InputContext)
  const editor = useMasher()
  const { changeHandler, property, value: contextValue, name, time, defaultValue: contextDefault } = inputContext
  if (!property) return null

  const { defaultValue: propertyDefault } = property

  const value = isDefined(contextValue) ? contextValue : (isDefined(contextDefault) ? contextDefault : propertyDefault)
  const colorProps: UnknownRecord = {
    type: 'color', name, value: String(value),
  }
  if (changeHandler) {

    colorProps.onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      if (time) await editor.goToTime(time)
      changeHandler(name, value)
    }
  } else colorProps.disabled = true
  return <input {...colorProps} />
}

DataTypeInputs[DataType.Rgb] = <RgbTypeInput />
