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


const PointInputKey = 'point-input-tween'
export function PointInput(props: DataGroupProps): ReactResult {
  const { selectType } = props
  assertSelectType(selectType)
  const [tweening, setTweening] = React.useState(!!sessionGet(PointInputKey))
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedProperties: properties } = inspectorContext
  const byName = selectedPropertiesGroupedByName(properties, DataGroup.Point, selectType)
  

  const { 
    offE, offW, offN, offS, x, y, 
    [`x${PropertyTweenSuffix}`]: xEnd,
    [`y${PropertyTweenSuffix}`]: yEnd
  } = byName 
  const xProperty = tweening ? xEnd : x
  const yProperty = tweening ? yEnd : y

  const values: ScalarObject = selectedPropertiesScalarObject(byName) 
  const { 
    offE: offEValue, offW: offWValue, offN: offNValue, offS: offSValue, 
    x: xValue, 
    y: yValue, 
    xEnd: xEndValue, 
    yEnd: yEndValue 
  } = values
  const xTween = isDefined(xEndValue) && xValue !== xEndValue
  const yTween = isDefined(yEndValue) && yValue !== yEndValue
  const endsDefined = xTween || yTween
  const elementsByName: Record<string, UnknownElement> = {}
  const inspectingProperties = [xProperty, yProperty]
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
    const inputContext: InputContextInterface = { property, value, name, changeHandler }
 
    const providerProps = { key, value: inputContext, children: input }
    elementsByName[baseName] = <InputContext.Provider { ...providerProps } />  
  })

  const selectedButton = [ClassSelected, ClassButton].join(' ')
  const startProps: PropsAndChild = {
    children: DefaultIcons.start,
    className: tweening ? ClassButton : selectedButton,
    key: 'start',
    onClick: () => {
      setTweening(false)
      sessionSet(PointInputKey, '')
    }
  }

  const endProps: PropsAndChild = {
    key: 'end',
    className: tweening ? selectedButton : ClassButton,
    children: endsDefined ? DefaultIcons.end : DefaultIcons.endUndefined,
    onClick: () => {
      setTweening(true)
      sessionSet(PointInputKey, 1)
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
    className: "icon-button",
    children: offEValue ? DefaultIcons.unlock : DefaultIcons.lock, 
    onClick: () => { offE.changeHandler('offE', !offEValue) }
  }
  const lockOffE = <View { ...lockOffEProps } />

  const lockOffWProps = { 
    key: "lock-west",
    className: "icon-button",
    children: offWValue ? DefaultIcons.unlock : DefaultIcons.lock, 
    onClick: () => { offW.changeHandler('offW', !offWValue) }
  }
  const lockOffW = <View { ...lockOffWProps } />

  const lockOffNProps = { 
    key: "lock-north",
    className: "icon-button",
    children: offNValue ? DefaultIcons.unlock : DefaultIcons.lock, 
    onClick: () => { offN.changeHandler('offN', !offNValue) }
  }
  const lockOffN = <View { ...lockOffNProps } />

  const lockOffSProps = { 
    key: "lock-south",
    className: "icon-button",
    children: offSValue ? DefaultIcons.unlock : DefaultIcons.lock, 
    onClick: () => { offS.changeHandler('offS', !offSValue) }
  }
  const lockOffS = <View { ...lockOffSProps } />


  const elements = [
    <View key="x" className='point' children={[DefaultIcons.horz, lockOffE, elementsByName.x, lockOffW]} />, 
    <View key="y" className='point' children={[DefaultIcons.vert, lockOffN, elementsByName.y, lockOffS]} />
  ]

  return <fieldset><legend>{legendElements}</legend>{elements}</fieldset>

}

DataGroupInputs[DataGroup.Point] = <PointInput key="point-input" />
