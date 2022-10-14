import React from "react"
import {
  DataMashRetrieveRequest, DataRetrieveResponse, DataGetRequest,
  Endpoints, EventType, MasherAction, ServerType, DataCastGetResponse, 
  DataMashGetResponse, isEventType, isSelectType, assertObject, 
  isPopulatedString, LabelAndId, isPositive, assertTrue,
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"
import { ApiContext } from "../ApiClient/ApiContext"
import { InspectorContext } from "../Inspector/InspectorContext"
import { labelInterpolate, labelTranslate } from "../../Utilities/Label"
import { View } from "../../Utilities/View"

export interface SelectEditedControlProps extends PropsAndChild, WithClassName {}

export function SelectEditedControl(props: SelectEditedControlProps): ReactResult {
  const editor = useEditor()
  const [requested, setRequested] = React.useState(false)
  const [described, setDescribed] = React.useState<LabelAndId[]>(() => [])

  const [editedId, setEditedId] = React.useState(editor.edited?.id || '')
  const apiContext = React.useContext(ApiContext)
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedInfo } = inspectorContext
  const { selectedType } = selectedInfo

  const [editedLabel, setEditedLabel] = React.useState(editor.edited?.label || '')
  const getDisabled = () => editor.can(MasherAction.Save)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const { enabled, servers, endpointPromise } = apiContext

  const updateDisabled = () => { setDisabled(getDisabled()) }

  const handleEdited = (event: Event) => {
    const { type } = event
    if (!(isEventType(type) && isSelectType(type))) return
    
    if (type !== selectedType) return

    const { edited } = editor
    assertObject(edited)

    const { id, label } = edited
    setDescribed(original => {
      const copy = original.filter(object => isPopulatedString(object.label))
      const index = copy.findIndex(object => object.id === id)
      if (isPositive(index)) copy.splice(index, 1, edited)
      else copy.push(edited)
      setEditedId(id)
      setEditedLabel(label)
      return copy
    })
  }

  const handleAction = () => {
    const { edited } = editor
    assertObject(edited)

    const { label } = edited
    if (editedLabel !== label) {
      setDescribed(original => [...original])
      setEditedLabel(label)
    }
    updateDisabled()
  }

  useListeners({
    [EventType.Action]: handleAction,
    [EventType.Mash]: handleEdited,
    [EventType.Cast]: handleEdited,
    [EventType.Save]: updateDisabled,
  }, editor.eventTarget)

  const onChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (disabled) return

    const { selectedIndex } = event.target
    const object = described[selectedIndex]
    assertObject(object)

    const { id } = object
    const request: DataGetRequest = { id }
    const { editType } = editor
    const endpoint = Endpoints.data[editType].get
    console.debug("GetRequest", endpoint, request)
    endpointPromise(endpoint, request).then((response: DataMashGetResponse | DataCastGetResponse) => {
      console.debug("GetResponse", endpoint, response)
      const { error } = response
      if (error) console.error("GetResponse", endpoint, error)
      else return editor.load(response)
    })
  }

  React.useEffect(() => {
    if (!(enabled && servers[ServerType.Data])) return
    if (requested) return

    setRequested(true)
    const request: DataMashRetrieveRequest = { partial: true }
    const endpoint = Endpoints.data[editor.editType].retrieve
    console.debug("RetrieveRequest", endpoint, request)
    endpointPromise(endpoint, request).then((response: DataRetrieveResponse) => {
      console.debug("RetrieveResponse", endpoint, response)
      const { described, error } = response
      if (error) console.error("RetrieveResponse", endpoint, error)
      else setDescribed(original => {
        const copy = [...original]
        described.forEach(object => {
          const { id, label } = object
          const found = copy.find(object => object.id === id)
          if (found || !isPopulatedString(label)) return
          
          copy.push(object as LabelAndId)
        })
        return copy
      })
    })
  }, [servers, enabled])

  if (described.length < 2) return null

  const describedOptions = () => {
    const { editType, edited } = editor
    const elements = [<optgroup key="group" label={labelTranslate('open')}/>]
    if (!edited) return elements

    const { id: editedId, label: editedLabel } = edited
    elements.push(...described.map(object => {
      const { label: objectLabel, id } = object
      const label = (id === editedId) ? editedLabel : objectLabel
      const children = isPopulatedString(label) ? label : labelInterpolate('unlabeled', { type: editType }) 
      const optionProps = { children, value: id, key: id }
      const option = <option {...optionProps} />
      return option
    }))

    return elements
  }

  const { children, ...rest } = props
  const child = React.Children.only(children)
  assertTrue(React.isValidElement(child))

  const selectOptions = {
    key: "edited-select",
    onChange, disabled, children: describedOptions(), value: editedId
  }
  const viewProps = { ...rest, children: [child, <select {...selectOptions} />] }
  return <View { ...viewProps } />
}
