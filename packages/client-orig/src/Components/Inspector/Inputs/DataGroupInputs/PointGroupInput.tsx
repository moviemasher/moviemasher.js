import React from "react"
import { 
  assertSelectorType, assertTime, ClassButton, ClassSelected, DataGroup, 
  selectedPropertyObject, selectedPropertiesScalarObject, 
  PropertyTweenSuffix, ScalarRecord, assertTimeRange, tweenInputTime
} from "@moviemasher/moviemasher.js"

import { JsxElement } from "../../../../Framework/Framework"

import { InspectorContext } from "../../InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { DataTypeInputs } from "../DataTypeInputs/DataTypeInputs"
import { InputContext, InputContextInterface } from "../InputContext"
import { View } from "../../../../Utilities/View"
import { useMasher } from "../../../../Hooks/useMasher"
import MasherContext from "../../../Masher/MasherContext"
import { PropsAndChild } from "../../../../Types/Props"


export function PointGroupInput(props: DataGroupProps) {
  const masherContext = React.useContext(MasherContext)
  const { icons } = masherContext
  
  const editor = useMasher()
  const { selectType, selectedItems: propsItems, ...rest } = props
  assertSelectorType(selectType)

 

  const inspectorContext = React.useContext(InspectorContext)
  const selectedItems = propsItems || inspectorContext.selectedItems

  const { changeTweening, selectedInfo } = inspectorContext
  const { tweenDefined, tweenSelected, onEdge, time, nearStart, timeRange } = selectedInfo
  assertTimeRange(timeRange)
  assertTime(time)
  
  const endDefined = tweenDefined[DataGroup.Point]
  const endSelected = tweenSelected[DataGroup.Point]

  const byName = selectedPropertyObject(selectedItems, DataGroup.Point, selectType)
  const values: ScalarRecord = selectedPropertiesScalarObject(byName) 
  const { 
    offE, offW, offN, offS, x, y, 
    [`x${PropertyTweenSuffix}`]: xEnd,
    [`y${PropertyTweenSuffix}`]: yEnd
  } = byName 

  const xProperty = endSelected ? xEnd : x
  const yProperty = endSelected ? yEnd : y

  const { 
    offE: offEValue, offW: offWValue, offN: offNValue, offS: offSValue
  } = values

  const elementsByName: Record<string, JsxElement> = {}
  const inspectingProperties = [xProperty, yProperty]

  
  // go to first/last frame if needed and tween value defined...
  const goTime = tweenInputTime(timeRange, onEdge, nearStart, endDefined, endSelected)

  inspectingProperties.forEach(selectedProperty => {
    if (!selectedProperty) {
      console.error("PointInput", xProperty, yProperty)
      return
    }
    const { property, changeHandler, value, name: nameOveride } = selectedProperty
    const { type, name: propertyName } = property
    const name = nameOveride || propertyName
    const baseName = name.replace(PropertyTweenSuffix, '')
    const input = DataTypeInputs[type] 
    const key = `inspector-${selectType}-${name}`
    const inputContext: InputContextInterface = { 
      property, value, name, changeHandler, time: goTime
    }
 
    // if we're editing tween value, but it's not defined yet...
    if (endSelected) {
      // tell input to use start value as default, rather than the property's...
      inputContext.defaultValue = values[baseName] 
    }

    const providerProps = { key, value: inputContext, children: input }
    elementsByName[baseName] = <InputContext.Provider { ...providerProps } />  
  })

  const selectedButton = [ClassSelected, ClassButton].join(' ')
  const startProps = {
    children: icons.start,
    className: endSelected ? ClassButton : selectedButton,
    key: 'start',
    onClick: () => {
      editor.goToTime(timeRange.startTime)
      changeTweening(DataGroup.Point, false)
    }
  }

  const endProps = {
    key: 'end',
    className: endSelected ? selectedButton : ClassButton,
    children: endDefined ? icons.end : icons.endUndefined,
    onClick: () => {
      editor.goToTime(timeRange.lastTime)
      changeTweening(DataGroup.Point, true)
    }
  }

  const legendElements = [
    icons.point, 
    <View className="start-end" key={`${selectType}-point-start-end`}>
      <View { ...startProps } />
      <View { ...endProps } />
    </View>
  ]


  const xElements = [<View key="horz-icon" children={icons.horz} className={ClassButton} />]
  const yElements = [<View key="vert-icon" children={icons.vert} className={ClassButton} />]

  if (offE) {
    const lockOffEProps = { 
      key: "lock-east",
      className: ClassButton,
      children: offEValue ? icons.unlock : icons.lock, 
      onClick: () => { offE.changeHandler('offE', !offEValue) }
    }
    const lockOffE = <View { ...lockOffEProps } />

    xElements.push(lockOffE)
  }
  xElements.push( elementsByName.x)
  if (offW) {
    const lockOffWProps = { 
      key: "lock-west",
      className: ClassButton,
      children: offWValue ? icons.unlock : icons.lock, 
      onClick: () => { offW.changeHandler('offW', !offWValue) }
    }
    const lockOffW = <View { ...lockOffWProps } />
    xElements.push(lockOffW)
  }
  if (offN) {
    const lockOffNProps = { 
      key: "lock-north",
      className: ClassButton,
      children: offNValue ? icons.unlock : icons.lock, 
      onClick: () => { offN.changeHandler('offN', !offNValue) }
    }
    const lockOffN = <View { ...lockOffNProps } />

    yElements.push(lockOffN)
  }
  yElements.push(elementsByName.y)
  if (offS) {
    const lockOffSProps = { 
      key: "lock-south",
      className: ClassButton,
      children: offSValue ? icons.unlock : icons.lock, 
      onClick: () => { offS.changeHandler('offS', !offSValue) }
    }
    const lockOffS = <View { ...lockOffSProps } />
    yElements.push(lockOffS)
  }
  const elements = [
    <View key="x" children={xElements} />, 
    <View key="y" children={yElements} />
  ]

  const fieldsetProps = { ...rest }
  return <fieldset { ...fieldsetProps }>
    <legend key="legend"><View>{legendElements}</View></legend>
    {elements}
  </fieldset>

}

DataGroupInputs[DataGroup.Point] = <PointGroupInput key="point-input" />
