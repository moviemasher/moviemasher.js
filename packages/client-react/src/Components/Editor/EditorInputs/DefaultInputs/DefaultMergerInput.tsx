import React from 'react'
import { Definitions, Errors, Merger } from '@moviemasher/moviemasher.js'

import { InputContext } from '../../../../Contexts/InputContext'
import { InspectorProperties } from '../../../Inspector/InspectorProperties'
import { ReactResult } from '../../../../declarations'

function DefaultMergerInput(): ReactResult {
  const inputContext = React.useContext(InputContext)

  const { changeHandler, property, value } = inputContext
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
    console.log("DefaultMergerInput instance", instance)
    changeHandler(property, instance)
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
    name: property,
    onChange,
    value: definitionId,
    key: `${property}-select`
  }
  return <>
    <select {...mergerProps} />
    <InspectorProperties propertyPrefix='merger' key={`${property}-inspector`} inspected={value}><label /></InspectorProperties>
  </>
}

export { DefaultMergerInput }
