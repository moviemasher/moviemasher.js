import React from "react"
import { 
  selectedPropertiesScalarObject, ClassButton, assertString, ClassSelected, 
  DataGroup, isDefined, Orientation, PropertyTweenSuffix, isOrientation, 
  selectedPropertyObject, ScalarObject, assertSelectType, assertTime 
} from "@moviemasher/moviemasher.js"
import { InspectorContext } from "../../Contexts/InspectorContext"
import { PropsAndChild, ReactResult, UnknownElement } from "../../declarations"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { DefaultIcons } from "@moviemasher/icons-default"
import { DataTypeInputs } from "../DataTypeInputs/DataTypeInputs"
import { InputContext, InputContextInterface } from "../../Contexts/InputContext"
import { View } from "../../Utilities/View"
import { sessionGet, sessionSet } from "../../Utilities/Session"
import { useEditor } from "../../Hooks/useEditor"

const SizeInputOrientations: Record<Orientation, string> = {
  [Orientation.H]: 'width', [Orientation.V]: 'height'
}
const SizeInputKey = 'size-input-tween'

export function SizeGroupInput(props: DataGroupProps): ReactResult {
  const editor = useEditor()
  const { selectType } = props
  assertSelectType(selectType)
  const [tweening, setTweening] = React.useState(!!sessionGet(SizeInputKey))
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedItems: properties } = inspectorContext
  const byName = selectedPropertyObject(properties, DataGroup.Size, selectType)
  
  const { 
    lock, width, height, 
    [`width${PropertyTweenSuffix}`]: widthEnd,
    [`height${PropertyTweenSuffix}`]: heightEnd
  } = byName 
  const { time } = width
  const { time: timeEnd } = widthEnd
  assertTime(time)
  assertTime(timeEnd)
  const widthProperty = tweening ? widthEnd : width
  const heightProperty = tweening ? heightEnd : height
  const values: ScalarObject = selectedPropertiesScalarObject(byName) 
  if (!(widthProperty && heightProperty)) {
    console.log("SizeInput properties.length", selectType, properties.length, Object.keys(byName), selectType, values)
    return null
  }

  const { 
    lock: lockValue, 
    width: widthValue, 
    height: heightValue, 
    widthEnd: widthEndValue, 
    heightEnd: heightEndValue 
  } = values

  assertString(lockValue)
    
  const orientation = isOrientation(lockValue) ? lockValue as Orientation : undefined
  const widthTween = isDefined(widthEndValue) && widthValue !== widthEndValue
  const heightTween = isDefined(heightEndValue) && heightValue !== heightEndValue
  const endsDefined = widthTween || heightTween
  const elementsByName: Record<string, UnknownElement> = {}
  const inspectingProperties = [widthProperty, heightProperty]
  inspectingProperties.forEach(selectedProperty => {
    const { property, changeHandler, value, name: nameOveride } = selectedProperty
    const { type, name: propertyName } = property
    const name = nameOveride || propertyName
    const baseName = name.replace(PropertyTweenSuffix, '')
    const input = DataTypeInputs[type] 
    const key = `inspector-${selectType}-${name}`
    const inputContext: InputContextInterface = { property, value, name }
    if (!(orientation && baseName === SizeInputOrientations[orientation])) {
      inputContext.changeHandler = changeHandler
    }
    const providerProps = { key, value: inputContext, children: input }
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
    className: tweening ? ClassButton : selectedButton,
    key: 'start',
    onClick: () => {
      editor.goToTime(time)
      setTweening(false)
      sessionSet(SizeInputKey, '')
    }
  }
  const endProps: PropsAndChild = {
    key: 'end',
    className: tweening ? selectedButton : ClassButton,
    children: endsDefined ? DefaultIcons.end : DefaultIcons.endUndefined,
    onClick: () => {
      editor.goToTime(timeEnd)
      setTweening(true)
      sessionSet(SizeInputKey, 1)
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
