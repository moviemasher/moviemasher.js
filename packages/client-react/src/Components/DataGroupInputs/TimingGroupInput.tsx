import React from "react"
import { assertSelectType, DataGroup, selectedPropertyObject } from "@moviemasher/moviemasher.js"
import { InspectorContext } from "../../Contexts/InspectorContext"
import { ElementRecord, ReactResult } from "../../declarations"
import { DataGroupInputs, DataGroupProps } from "./DataGroupInputs"
import { View } from "../../Utilities/View"
import { useEditor } from "../../Hooks/useEditor"
import { InspectorProperty, InspectorPropertyProps } from "../Inspector/InspectorProperty"


const TimingInputKey = 'opacity-input-tween'
export function TimingGroupInput(props: DataGroupProps): ReactResult {
  const editor = useEditor()
  const { selectType } = props
  assertSelectType(selectType)

  const inspectorContext = React.useContext(InspectorContext)
  const { selectedItems: properties } = inspectorContext
  const byName = selectedPropertyObject(properties, DataGroup.Timing, selectType)
  const { 
    frame, 
    frames, 
    timing,
  } = byName

  const elementsByName: ElementRecord = Object.fromEntries(Object.entries(byName).map(([key, selectedProperty]) => {
    const { property, changeHandler, selectType, value, name: nameOveride } = selectedProperty
      const { name: propertyName } = property
      const name = nameOveride || propertyName
    
      const propertyProps: InspectorPropertyProps = {
        key: `inspector-${selectType}-group-${name}`,
        property, value, changeHandler, name,
        ...props
      }
      

    return [key, <InspectorProperty {...propertyProps} />]
  }))

  return <View>{Object.values(elementsByName)}</View>
 

  // return <InspectorProperties selectedItems={Object.values(byName)}/>


  // const { property, value, changeHandler } = timing as SelectedProperty

  // const { time: timeEnd } = opacityEnd
  // assertTime(time)
  // assertTime(timeEnd)

  // const values: ScalarObject = selectedPropertiesScalarObject(byName) 
  // const { 
  //   opacity: opacityValue, 
  //   opacityEnd: opacityEndValue, 
  // } = values
  // const endsDefined = isDefined(opacityEndValue) && opacityValue !== opacityEndValue
  
  // const { property, changeHandler, value, name: nameOveride } = opacityProperty
  // const { type, name: propertyName } = property
  // const name = nameOveride || propertyName
  // const input = DataTypeInputs[type] 
  // const key = `inspector-${selectType}-${name}`
  // const inputContext: InputContextInterface = { property, value, name, changeHandler }
  // const providerProps = { key, value: inputContext, children: input }
  // const selectedButton = [ClassSelected, ClassButton].join(' ')
  
  // const viewProps = {
  //   key, className: "opacity",
  //   children: [
  //     DefaultIcons.opacity, 
  //     <InputContext.Provider { ...providerProps } />, 
  //     <View className="start-end" key={`${key}start-end`}>
        
  //     </View>
  //   ]
  // }
  // return <View { ...viewProps } />
}

DataGroupInputs[DataGroup.Timing] = <TimingGroupInput key="timing-input" />
