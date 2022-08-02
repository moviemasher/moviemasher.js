import React from "react"
import { assertSelectType, assertTime, ClassButton, ClassSelected, DataGroup, isDefined, selectedPropertyObject } from "@moviemasher/moviemasher.js"
import { InspectorContext } from "../../Contexts/InspectorContext"
import { PropsAndChild, ReactResult, UnknownElement } from "../../declarations"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { DefaultIcons } from "@moviemasher/icons-default"
import { PropertyTweenSuffix } from "@moviemasher/moviemasher.js"
import { selectedPropertiesScalarObject } from "@moviemasher/moviemasher.js"
import { ScalarObject } from "@moviemasher/moviemasher.js"
import { DataTypeInputs } from "../DataTypeInputs/DataTypeInputs"
import { InputContext, InputContextInterface } from "../../Contexts/InputContext"
import { View } from "../../Utilities/View"
import { useEditor } from "../../Hooks/useEditor"

export function ColorGroupInput(props: DataGroupProps): ReactResult {  
  const editor = useEditor()

  const { selectType } = props
  assertSelectType(selectType)

  const inspectorContext = React.useContext(InspectorContext)
  const { selectedItems: properties, changeTweening, tweening } = inspectorContext
  const byName = selectedPropertyObject(properties, DataGroup.Color, selectType)
  const { color, [`color${PropertyTweenSuffix}`]: colorEnd } = byName 
  const { time } = color
  const { time: timeEnd } = colorEnd
  assertTime(time)
  assertTime(timeEnd)

  const colorProperty = tweening ? colorEnd : color

  const values: ScalarObject = selectedPropertiesScalarObject(byName) 
  const { color: colorValue, colorEnd: colorEndValue } = values
  const endsDefined = isDefined(colorEndValue) && colorValue !== colorEndValue
  
  const { property, changeHandler, value, name: nameOveride } = colorProperty
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
      editor.goToTime(time)
      changeTweening(false)
    }
  }

  const endProps: PropsAndChild = {
    key: 'end',
    className: tweening ? selectedButton : ClassButton,
    children: endsDefined ? DefaultIcons.end : DefaultIcons.endUndefined,
    onClick: () => {      
      editor.goToTime(timeEnd)
      changeTweening(true)
    }
  }
  const viewProps = {
    key, className: "color",
    children: [
      DefaultIcons.color, 
      <InputContext.Provider { ...providerProps } />, 
      <View className="start-end" key={`${key}start-end`}>
        <View { ...startProps } />
        <View { ...endProps } />
      </View>
    ]
  }
  return <View { ...viewProps } />
}

DataGroupInputs[DataGroup.Color] = <ColorGroupInput key="color-input" />
