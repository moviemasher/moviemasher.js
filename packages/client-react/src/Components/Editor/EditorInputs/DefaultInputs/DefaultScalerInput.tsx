import React from 'react'
import { DataType, Definitions, Errors, Scaler } from '@moviemasher/moviemasher.js'

import { InputContext } from '../../../../Contexts/InputContext'
import { InspectorProperties } from '../../../Inspector/InspectorProperties'
import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'

function DefaultScalerInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  if (!property) return null

  if (typeof value !== 'object' || Array.isArray(value)) return null

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value
    const definition = Definitions.scaler.find(scaler => scaler.id === id)
    if (!definition) throw Errors.invalid.definition.id + id

    const existing = value.properties.map(property => property.name)
    const instance = definition.instance

    instance.properties.forEach(property => {
      const { name } = property
      if (!existing.includes(name)) return
      instance.setValue(name, value.value(name))
    })
    // console.log("DefaultScalerInput instance", instance)
    changeHandler(property.name, instance)
  }
  const { definitionId } = value as Scaler

  const options = Definitions.scaler.map(scaler => {
    const optionProps = {
      value: scaler.id,
      key: scaler.id,
      children: scaler.label,
    }
    return <option {...optionProps}/>
  })

  const scalerProps = {
    children: options,
    name: property.name,
    onChange,
    value: definitionId,
    key: `${property.name}-select`
  }
  return <>
    <select {...scalerProps} />
    <InspectorProperties propertyPrefix='scaler' key={`${property.name}-inspector`} inspected={value}><label /></InspectorProperties>
  </>
}


DataTypeInputs[DataType.Scaler] = <DefaultScalerInput />


export { DefaultScalerInput }
