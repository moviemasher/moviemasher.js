import React from 'react'
import { DataType, isDefined, UnknownObject } from '@moviemasher/moviemasher.js'

import { ReactResult } from '../../../../declarations'
import { InputContext } from '../InputContext'
import { DataTypeInputs } from '../DataTypeInputs/DataTypeInputs'
import { useEditor } from '../../../../Hooks/useEditor'
import { DefaultIcons } from '@moviemasher/icons-default'

export function RgbTypeInput(): ReactResult {
  const inputContext = React.useContext(InputContext)
  const editor = useEditor()
  const { changeHandler, property, value: contextValue, name, time, defaultValue: contextDefault } = inputContext
  if (!property) return null

  const { defaultValue: propertyDefault } = property

  const value = isDefined(contextValue) ? contextValue : (isDefined(contextDefault) ? contextDefault : propertyDefault)
  const colorProps: UnknownObject = {
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
