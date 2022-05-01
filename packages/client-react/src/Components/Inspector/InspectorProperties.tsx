import React from "react"
import { SelectType, NumberObject } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, ReactResult, WithClassName } from "../../declarations"
import { InspectorProperty, InspectorPropertyProps } from "./InspectorProperty"
import { InspectorContext } from "../../Contexts/InspectorContext"
import { InspectorEffects } from "./InspectorEffects"

export interface InspectorPropertiesProps extends PropsAndChildren, WithClassName {}

/**
 * @parents InspectorContent
 */
export function InspectorProperties(props: InspectorPropertiesProps): ReactResult {
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedProperties } = inspectorContext


  const counts: NumberObject = {}
  const types = selectedProperties.map(selectedProperty => {
    const { selectType } = selectedProperty
    const type = String(selectType)
    counts[type] ||= 0
    counts[type]++
    return type
  })

  const kidsByType: Record<string, React.ReactChild[]> = {}

  if (counts.merger || counts.scaler) {
    const effectIndex = types.findIndex(type => type === SelectType.Effect)

    const index = effectIndex === -1 ? types.length : effectIndex

    types.splice(index, 0, 'effects')
    kidsByType.effects = [<InspectorEffects />]
  }


  selectedProperties.forEach(selectedProperty => {
    const { property, changeHandler, selectType, value } = selectedProperty
    kidsByType[selectType] ||= []
    const kids = kidsByType[selectType]
    const { name } = property
    const propertyProps: InspectorPropertyProps = {
      key: `inspector-${selectType}-${name}`,
      property,
      value,
      changeHandler,
      ...props
    }
    kids.push(<InspectorProperty {...propertyProps} />)
  })

  const kids: React.ReactChild[] = [...new Set(types)].map(type => {
    return <details open>
      <summary>{type}</summary>
      {kidsByType[type]}
    </details>
  })

  return <>{kids}</>
}
