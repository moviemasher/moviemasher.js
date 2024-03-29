import React from "react"
import { 
  selectedPropertiesScalarObject, ClassButton, assertString, ClassSelected, 
  DataGroup, isDefined, Orientation, PropertyTweenSuffix, isOrientation, 
  selectedPropertyObject, ScalarObject, assertSelectType, assertTime, assertTimeRange, tweenInputTime 
} from "@moviemasher/moviemasher.js"


import { PropsAndChild, ReactResult, UnknownElement } from "../../../../declarations"
import { InspectorContext } from "../../../Inspector/InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { DataTypeInputs } from "../DataTypeInputs/DataTypeInputs"
import { InputContext, InputContextInterface } from "../InputContext"
import { View } from "../../../../Utilities/View"
import { useEditor } from "../../../../Hooks/useEditor"
import { MasherContext } from "../../../Masher/MasherContext"

const SizeInputOrientations: Record<Orientation, string> = {
  [Orientation.H]: 'width', [Orientation.V]: 'height'
}

export function SizeGroupInput(props: DataGroupProps): ReactResult {
  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
  const editor = useEditor()
  const { selectType } = props
  assertSelectType(selectType, 'selectType')
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
  assertString(lockValue, 'lockValue')
    
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
    className: ClassButton,
    children: orientation === Orientation.H ? icons.lock : icons.unlock, 
    onClick: () => {
      const value = orientation === Orientation.H ? "" : Orientation.H
      lock.changeHandler('lock', value)
    }
  }
  const lockWidth = <View { ...lockWidthProps } />
  const lockHeightProps = { 
    key: "lock-height",
    className: ClassButton,
    children: orientation === Orientation.V ? icons.lock : icons.unlock, 
    onClick: () => {
      const value = orientation === Orientation.V ? "" : Orientation.V
      lock.changeHandler('lock', value)
    }
  }
  const selectedButton = [ClassSelected, ClassButton].join(' ')
  const lockHeight = <View { ...lockHeightProps } />
  const startProps: PropsAndChild = {
    children: icons.start,
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
    children: endDefined ? icons.end : icons.endUndefined,
    onClick: () => {
      editor.goToTime(timeRange.lastTime)
      changeTweening(DataGroup.Size, true)
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
  return <fieldset>
    <legend key="legend"><View>{legendElements}</View></legend>
    {elements}
  </fieldset>
}

DataGroupInputs[DataGroup.Size] = <SizeGroupInput key="size-group-input" />
