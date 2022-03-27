import React from 'react'
import { DataType, Definitions, Errors, Merger } from '@moviemasher/moviemasher.js'

import { InputContext } from '../../../../Contexts/InputContext'
import { InspectorProperties } from '../../../Inspector/InspectorProperties'
import { ReactResult } from '../../../../declarations'
import { DataTypeInputs } from './DataTypeInputs'

function DefaultMergerInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
  if (!property) return null
  if (typeof value !== 'object' || Array.isArray(value)) return null

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value
    const definition = Definitions.merger.find(merger => merger.id === id)
    if (!definition) throw Errors.invalid.definition.id + id

    const existing = value.properties.map(property => property.name)
    const instance = definition.instance

    instance.properties.forEach(property => {
      const { name } = property
      if (!existing.includes(name)) return
      instance.setValue(name, value.value(name))
    })
    // console.log("DefaultMergerInput instance", instance)
    changeHandler(property.name, instance)
  }
  const { definitionId } = value as Merger

  const options = Definitions.merger.map(merger => {
    const optionProps = {
      value: merger.id,
      key: merger.id,
      children: merger.label,
    }
    return <option {...optionProps}/>
  })

  const mergerProps = {
    children: options,
    name: property.name,
    onChange,
    value: definitionId,
    key: `${property.name}-select`
  }
  return <>
    <select {...mergerProps} />
    <InspectorProperties propertyPrefix='merger' key={`${property.name}-inspector`} inspected={value}><label /></InspectorProperties>
  </>
}

DataTypeInputs[DataType.Merger] = <DefaultMergerInput />


export { DefaultMergerInput }
