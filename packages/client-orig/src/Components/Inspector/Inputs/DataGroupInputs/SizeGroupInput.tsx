import React from "react"

import { 
  selectedPropertiesScalarObject, ClassButton, ClassSelected, 
  PropertyTweenSuffix, assertLock, 
  selectedPropertyObject, ScalarRecord, assertSelectorType, assertTime, 
  assertTimeRange, tweenInputTime, EmptyFunction,
  LockWidth, LockHeight, LockNone, DataGroupSize, 
} from "@moviemasher/lib-core"


import { JsxElement } from "../../../../Framework/Framework"

import { InspectorContext } from "../../InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { DataTypeInputs } from "../DataTypeInputs/DataTypeInputs"
import { InputContext, InputContextInterface } from "../InputContext"
import { View } from "../../../../Utilities/View"
import { useMasher } from "../../../../Hooks/useMasher"
import MasherContext from "../../../Masher/MasherContext"


export function SizeGroupInput(props: DataGroupProps) {
  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
  const editor = useMasher()
  const { selectType, selectedItems: propsItems, ...rest } = props
  assertSelectorType(selectType, 'selectType')
  const inspectorContext = React.useContext(InspectorContext)
  const selectedItems = propsItems || inspectorContext.selectedItems
  const { selectedInfo, changeTweening } = inspectorContext
  const { tweenDefined, tweenSelected, onEdge, time, nearStart, timeRange } = selectedInfo
  assertTimeRange(timeRange)
  assertTime(time)
  
  const endDefined = tweenDefined[DataGroupSize]
  const endSelected = tweenSelected[DataGroupSize]

  const byName = selectedPropertyObject(selectedItems, DataGroupSize, selectType)
  
  const { 
    lock, width, height, 
    [`width${PropertyTweenSuffix}`]: widthEnd,
    [`height${PropertyTweenSuffix}`]: heightEnd
  } = byName 
  
  const widthProperty = endSelected ? widthEnd : width
  const heightProperty = endSelected ? heightEnd : height
  const values: ScalarRecord = selectedPropertiesScalarObject(byName) 

  const { lock: lockValue = LockNone } = values
  assertLock(lockValue, 'lock')
 
  
  const elementsByName: Record<string, JsxElement> = {}
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
      property, value, name, time: goTime, changeHandler: EmptyFunction
    }

    // if we're editing tween value, but it's not defined yet...
    if (endSelected) {
      // tell input to use start value as default, rather than the property's...
      inputContext.defaultValue = values[baseName] 
    }

    if (baseName !== lockValue) {
      inputContext.changeHandler = changeHandler
    }
    const providerProps = { 
      key, value: inputContext, children: input
    }
    elementsByName[baseName] = <InputContext.Provider { ...providerProps } />  
  })
  const lockWidthProps = { 
    key: "lock-width",
    className: ClassButton,
    children: lockValue === LockWidth ? icons.lock : icons.unlock, 
    onClick: () => {
      const value = lockValue === LockWidth ? LockNone : LockWidth
      lock.changeHandler('lock', value)
    }
  }
  const lockWidth = <View { ...lockWidthProps } />
  const lockHeightProps = { 
    key: "lock-height",
    className: ClassButton,
    children: lockValue === LockHeight ? icons.lock : icons.unlock, 
    onClick: () => {
      const value = lockValue === LockHeight ? LockNone : LockHeight
      lock.changeHandler('lock', value)
    }
  }
  const selectedButton = [ClassSelected, ClassButton].join(' ')
  const lockHeight = <View { ...lockHeightProps } />
  const startProps = {
    children: icons.start,
    className: endSelected ? ClassButton : selectedButton,
    key: 'start',
    onClick: () => {
      editor.goToTime(timeRange.startTime)
      changeTweening(DataGroupSize, false)
    }
  }
  const endProps = {
    key: 'end',
    className: endSelected ? selectedButton : ClassButton,
    children: endDefined ? icons.end : icons.endUndefined,
    onClick: () => {
      editor.goToTime(timeRange.lastTime)
      changeTweening(DataGroupSize, true)
    }
  }
  const legendElements = [
    icons.size,
    <View className="start-end" key={`${selectType}-size-start-end`}>
      <View { ...startProps } />
      <View { ...endProps } />
    </View>
  ]
  const widthElements = [
    <View key="width-icon" children={icons.width} className={ClassButton} />, 
    elementsByName.width, 
    lockWidth
  ]
  const heightElements = [
    <View key="height-icon" children={icons.height} className={ClassButton} />, 
    elementsByName.height, 
    lockHeight
  ]
  const elements = [
    <View key="width" children={widthElements} />, 
    <View key="height" children={heightElements} />
  ]

  const fieldsetProps = { ...rest }
  return <fieldset { ...fieldsetProps }>
    <legend key="legend"><View>{legendElements}</View></legend>
    {elements}
  </fieldset>
}

DataGroupInputs[DataGroupSize] = <SizeGroupInput key="size-group-input" />
