import React from "react"
import { 
  assertSelectType, assertTime, ClassButton, ClassSelected, DataGroup, 
  isDefined, selectedPropertyObject, selectedPropertiesScalarObject, 
  PropertyTweenSuffix, ScalarObject, assertTimeRange, tweenInputTime
} from "@moviemasher/moviemasher.js"
import { DefaultIcons } from "@moviemasher/icons-default"

import { PropsAndChild, ReactResult, UnknownElement } from "../../../../declarations"
import { InspectorContext } from "../../../Inspector/InspectorContext"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { DataTypeInputs } from "../DataTypeInputs/DataTypeInputs"
import { InputContext, InputContextInterface } from "../InputContext"
import { View } from "../../../../Utilities/View"
import { useEditor } from "../../../../Hooks/useEditor"


export function PointGroupInput(props: DataGroupProps): ReactResult {
  const editor = useEditor()
  const { selectType } = props
  assertSelectType(selectType)
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedItems: properties, changeTweening, selectedInfo } = inspectorContext
  const { tweenDefined, tweenSelected, onEdge, time, nearStart, timeRange } = selectedInfo
  assertTimeRange(timeRange)
  assertTime(time)
  
  const endDefined = tweenDefined[DataGroup.Point]
  const endSelected = tweenSelected[DataGroup.Point]

  const byName = selectedPropertyObject(properties, DataGroup.Point, selectType)
  const values: ScalarObject = selectedPropertiesScalarObject(byName) 
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

  const elementsByName: Record<string, UnknownElement> = {}
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
  const startProps: PropsAndChild = {
    children: DefaultIcons.start,
    className: endSelected ? ClassButton : selectedButton,
    key: 'start',
    onClick: () => {
      editor.goToTime(timeRange.startTime)
      changeTweening(DataGroup.Point, false)
    }
  }

  const endProps: PropsAndChild = {
    key: 'end',
    className: endSelected ? selectedButton : ClassButton,
    children: endDefined ? DefaultIcons.end : DefaultIcons.endUndefined,
    onClick: () => {
      editor.goToTime(timeRange.lastTime)
      changeTweening(DataGroup.Point, true)
    }
  }

  const legendElements = [
    DefaultIcons.point, 
    <View className="start-end" key={`${selectType}-point-start-end`}>
      <View { ...startProps } />
      <View { ...endProps } />
    </View>
  ]
  const lockOffEProps = { 
    key: "lock-east",
    className: ClassButton,
    children: offEValue ? DefaultIcons.unlock : DefaultIcons.lock, 
    onClick: () => { offE.changeHandler('offE', !offEValue) }
  }
  const lockOffE = <View { ...lockOffEProps } />

  const lockOffWProps = { 
    key: "lock-west",
    className: ClassButton,
    children: offWValue ? DefaultIcons.unlock : DefaultIcons.lock, 
    onClick: () => { offW.changeHandler('offW', !offWValue) }
  }
  const lockOffW = <View { ...lockOffWProps } />

  const lockOffNProps = { 
    key: "lock-north",
    className: ClassButton,
    children: offNValue ? DefaultIcons.unlock : DefaultIcons.lock, 
    onClick: () => { offN.changeHandler('offN', !offNValue) }
  }
  const lockOffN = <View { ...lockOffNProps } />

  const lockOffSProps = { 
    key: "lock-south",
    className: ClassButton,
    children: offSValue ? DefaultIcons.unlock : DefaultIcons.lock, 
    onClick: () => { offS.changeHandler('offS', !offSValue) }
  }
  const lockOffS = <View { ...lockOffSProps } />


  const elements = [
    <View key="x" className='point' children={[DefaultIcons.horz, lockOffE, elementsByName.x, lockOffW]} />, 
    <View key="y" className='point' children={[DefaultIcons.vert, lockOffN, elementsByName.y, lockOffS]} />
  ]

  return <fieldset><legend><View>{legendElements}</View></legend>{elements}</fieldset>

}

DataGroupInputs[DataGroup.Point] = <PointGroupInput key="point-input" />
