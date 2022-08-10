import React from "react"
import { 
  selectedPropertiesScalarObject, ClassButton, assertString, ClassSelected, 
  DataGroup, isDefined, Orientation, PropertyTweenSuffix, isOrientation, 
  selectedPropertyObject, ScalarObject, assertSelectType, assertTime, assertTimeRange, tweenInputTime 
} from "@moviemasher/moviemasher.js"
import { DefaultIcons } from "@moviemasher/icons-default"


import { PropsAndChild, ReactResult, UnknownElement } from "../../../../declarations"
import { InspectorContext } from "../../../Inspector/InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { DataTypeInputs } from "../DataTypeInputs/DataTypeInputs"
import { InputContext, InputContextInterface } from "../InputContext"
import { View } from "../../../../Utilities/View"
import { useEditor } from "../../../../Hooks/useEditor"

const SizeInputOrientations: Record<Orientation, string> = {
  [Orientation.H]: 'width', [Orientation.V]: 'height'
}

export function SizeGroupInput(props: DataGroupProps): ReactResult {
  const editor = useEditor()
  const { selectType } = props
  assertSelectType(selectType)
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedItems: properties, selectedInfo, changeTweening } = inspectorContext
  const { tweenDefined, tweenSelected, onEdge, time, nearStart, timeRange } = selectedInfo
  assertTimeRange(timeRange)
  assertTime(time)
  
  const endDefined = tweenDefined[DataGroup.Size]
  const endSelected = tweenSelected[DataGroup.Size]

  const byName = selectedPropertyObject(properties, DataGroup.Size, selectType)
  
  const { 
    lock, width, height, 
    [`width${PropertyTweenSuffix}`]: widthEnd,
    [`height${PropertyTweenSuffix}`]: heightEnd
  } = byName 
  
  const widthProperty = endSelected ? widthEnd : width
  const heightProperty = endSelected ? heightEnd : height
  const values: ScalarObject = selectedPropertiesScalarObject(byName) 

  const { lock: lockValue } = values
  assertString(lockValue)
    
  const orientation = isOrientation(lockValue) ? lockValue as Orientation : undefined
  
  const elementsByName: Record<string, UnknownElement> = {}
  const inspectingProperties = [widthProperty, heightProperty]

  // go to first/last frame if needed and tween value defined...
  const goTime = tweenInputTime(timeRange, onEdge, nearStart, endDefined, endSelected)

  inspectingProperties.forEach(selectedProperty => {
    const { property, changeHandler, value, name: nameOveride } = selectedProperty
    const { type, name: propertyName } = property
    const name = nameOveride || propertyName
    const baseName = name.replace(PropertyTweenSuffix, '')
    const input = DataTypeInputs[type] 
    const key = `inspector-${selectType}-${name}`
    const inputContext: InputContextInterface = { 
      property, value, name, time: goTime
    }

    // if we're editing tween value, but it's not defined yet...
    if (endSelected) {
      // tell input to use start value as default, rather than the property's...
      inputContext.defaultValue = values[baseName] 
    }

    if (!(orientation && baseName === SizeInputOrientations[orientation])) {
      inputContext.changeHandler = changeHandler
    }
    const providerProps = { 
      key, value: inputContext, children: input
    }
    elementsByName[baseName] = <InputContext.Provider { ...providerProps } />  
  })
  const lockWidthProps = { 
    key: "lock-width",
    className: "icon-button",
    children: orientation === Orientation.H ? DefaultIcons.lock : DefaultIcons.unlock, 
    onClick: () => {
      const value = orientation === Orientation.H ? "" : Orientation.H
      lock.changeHandler('lock', value)
    }
  }
  const lockWidth = <View { ...lockWidthProps } />
  const lockHeightProps = { 
    key: "lock-height",
    className: "icon-button",
    children: orientation === Orientation.V ? DefaultIcons.lock : DefaultIcons.unlock, 
    onClick: () => {
      const value = orientation === Orientation.V ? "" : Orientation.V
      lock.changeHandler('lock', value)
    }
  }
  const selectedButton = [ClassSelected, ClassButton].join(' ')
  const lockHeight = <View { ...lockHeightProps } />
  const startProps: PropsAndChild = {
    children: DefaultIcons.start,
    className: endSelected ? ClassButton : selectedButton,
    key: 'start',
    onClick: () => {
      editor.goToTime(timeRange.startTime)
      changeTweening(DataGroup.Size, false)
    }
  }
  const endProps: PropsAndChild = {
    key: 'end',
    className: endSelected ? selectedButton : ClassButton,
    children: endDefined ? DefaultIcons.end : DefaultIcons.endUndefined,
    onClick: () => {
      editor.goToTime(timeRange.lastTime)
      changeTweening(DataGroup.Size, true)
    }
  }
  const legendElements = [
    DefaultIcons.size,
    <View className="start-end" key={`${selectType}-size-start-end`}>
      <View { ...startProps } />
      <View { ...endProps } />
    </View>
  ]
  const elements = [
    <View key="width" className='size' children={[DefaultIcons.horz, elementsByName.width, lockWidth]} />, 
    <View key="height" className='size' children={[DefaultIcons.vert, elementsByName.height, lockHeight]} />
  ]
  return <fieldset><legend>{legendElements}</legend>{elements}</fieldset>
}

DataGroupInputs[DataGroup.Size] = <SizeGroupInput key="size-input" />
