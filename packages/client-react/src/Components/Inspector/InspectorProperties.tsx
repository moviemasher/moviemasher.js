import React from "react"
import { SelectType, NumberObject, SelectedProperty, isVisibleClip } from "@moviemasher/moviemasher.js"

import { PropsAndChildren, PropsWithoutChild, ReactResult, WithClassName } from "../../declarations"
import { InspectorProperty, InspectorPropertyProps } from "./InspectorProperty"
import { InspectorContext } from "../../Contexts/InspectorContext"
import { InspectorEffects } from "./InspectorEffects"
import { useSelected } from "../../Hooks/useSelected"

export interface InspectorPropertiesProps extends PropsWithoutChild, WithClassName {}

/**
 * @parents InspectorContent
 */
export function InspectorProperties(props: InspectorPropertiesProps): ReactResult {
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedProperties } = inspectorContext
  const selectedClip = useSelected()

  const counts: NumberObject = {}
  const types = selectedProperties.map(selectedProperty => {
    const { selectType } = selectedProperty as SelectedProperty
    const type = String(selectType)
    counts[type] ||= 0
    counts[type]++
    return type
  })

  const kidsByType: Record<string, React.ReactChild[]> = {}

  if (counts.clip) {
    if (isVisibleClip(selectedClip)) {
      const effectIndex = types.findIndex(type => type === SelectType.Effect)
      const index = effectIndex === -1 ? types.length : effectIndex
      types.splice(index, 0, 'effects')
      kidsByType.effects = [<InspectorEffects key="inspector-effects" />]
    }
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
    const summaryProps = { key: `summary-${type}`, children: type }
    const detailsProps = {
      key: `details-${type}`,
      open: true,
      children: [<summary { ...summaryProps } />, ...kidsByType[type]]
    }
    return <details { ...detailsProps } />
  })

  return <>{kids}</>
}
