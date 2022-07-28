import React from "react"
import { assertSelectType, ClassButton, ClassSelected, DataGroup, Directions, isDefined, selectedPropertiesGroupedByName } from "@moviemasher/moviemasher.js"
import { InspectorContext } from "../../Contexts/InspectorContext"
import { PropsAndChild, ReactResult, UnknownElement } from "../../declarations"
import { InspectorPropertiesProps,  } from "../Inspector/InspectorProperties"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { InspectorProperty, InspectorPropertyProps } from "../Inspector/InspectorProperty"
import { DefaultIcons } from "@moviemasher/icons-default"
import { sessionGet, sessionSet } from "../../Utilities/Session"
import { PropertyTweenSuffix } from "@moviemasher/moviemasher.js"
import { selectedPropertiesScalarObject } from "@moviemasher/moviemasher.js"
import { ScalarObject } from "@moviemasher/moviemasher.js"
import { DataTypeInputs } from "../DataTypeInputs/DataTypeInputs"
import { InputContext, InputContextInterface } from "../../Contexts/InputContext"
import { View } from "../../Utilities/View"


const OpacityInputKey = 'opacity-input-tween'
export function OpacityInput(props: DataGroupProps): ReactResult {
  const { selectType } = props
  assertSelectType(selectType)
  const [tweening, setTweening] = React.useState(!!sessionGet(OpacityInputKey))
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedProperties: properties } = inspectorContext
  const byName = selectedPropertiesGroupedByName(properties, DataGroup.Opacity, selectType)
  

  const { 
    opacity, 
    [`opacity${PropertyTweenSuffix}`]: opacityEnd,
  } = byName 
  const opacityProperty = tweening ? opacityEnd : opacity

  const values: ScalarObject = selectedPropertiesScalarObject(byName) 
  const { 
    opacity: opacityValue, 
    opacityEnd: opacityEndValue, 
  } = values
  const endsDefined = isDefined(opacityEndValue) && opacityValue !== opacityEndValue
  
  const { property, changeHandler, value, name: nameOveride } = opacityProperty
  const { type, name: propertyName } = property
  const name = nameOveride || propertyName
  const input = DataTypeInputs[type] 
  const key = `inspector-${selectType}-${name}`
  const inputContext: InputContextInterface = { property, value, name, changeHandler }
  const providerProps = { key, value: inputContext, children: input }
  const selectedButton = [ClassSelected, ClassButton].join(' ')
  const startProps: PropsAndChild = {
    children: DefaultIcons.start,
    className: tweening ? ClassButton : selectedButton,
    key: 'start',
    onClick: () => {
      setTweening(false)
      sessionSet(OpacityInputKey, '')
    }
  }

  const endProps: PropsAndChild = {
    key: 'end',
    className: tweening ? selectedButton : ClassButton,
    children: endsDefined ? DefaultIcons.end : DefaultIcons.endUndefined,
    onClick: () => {
      setTweening(true)
      sessionSet(OpacityInputKey, 1)
    }
  }
  const viewProps = {
    key, className: "opacity",
    children: [
      DefaultIcons.opacity, 
      <InputContext.Provider { ...providerProps } />, 
      <View className="start-end" key={`${key}start-end`}>
        <View { ...startProps } />
        <View { ...endProps } />
      </View>
    ]
  }
  return <View { ...viewProps } />
}

DataGroupInputs[DataGroup.Opacity] = <OpacityInput key="opacity-input" />
