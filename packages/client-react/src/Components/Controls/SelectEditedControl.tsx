import React from "react"
import {
  DataMashRetrieveRequest, DataRetrieveResponse, DataGetRequest,
  Endpoints, EventType, MasherAction, ServerType, 
  DataMashGetResponse, isEventType, isSelectType, assertObject, 
  isPopulatedString, isPositive, assertTrue, Identified,
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult, WithClassName } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"
import { ApiContext } from "../../../client-react-deleted/ApiClient/ApiContext"
import { InspectorContext } from "../Inspector/InspectorContext"
import { labelInterpolate, labelTranslate } from "../../Utilities/Label"
import { View } from "../../Utilities/View"


interface AndLabel {
  label: string
}

interface LabelAndId extends Identified, AndLabel {}

export interface SelectEditedControlProps extends PropsAndChild, WithClassName {}

export function SelectEditedControl(props: SelectEditedControlProps): ReactResult {
  const editor = useEditor()
  const [requested, setRequested] = React.useState(false)
  const [described, setDescribed] = React.useState<LabelAndId[]>(() => [])

  const [editedId, setEditedId] = React.useState(editor.mashMedia?.id || '')
  const apiContext = React.useContext(ApiContext)
  const inspectorContext = React.useContext(InspectorContext)
  const { selectedInfo } = inspectorContext
  const { selectedType } = selectedInfo

  const [editedLabel, setEditedLabel] = React.useState(editor.mashMedia?.label || '')
  const getDisabled = () => editor.can(MasherAction.Save)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const { enabled, servers, endpointPromise } = apiContext

  const updateDisabled = () => { setDisabled(getDisabled()) }

  const handleEdited = (event: Event) => {
    const { type } = event
    if (!(isEventType(type) && isSelectType(type))) return
    
    if (type !== selectedType) return

    const { mashMedia } = editor
    assertObject(mashMedia, 'mashMedia')

    const { id, label } = mashMedia
    setDescribed(original => {
      const copy = original.filter(object => isPopulatedString(object.label))
      const index = copy.findIndex(object => object.id === id)
      if (isPositive(index)) copy.splice(index, 1, mashMedia)
      else copy.push(mashMedia)
      setEditedId(id)
      setEditedLabel(label)
      return copy
    })
  }

  const handleAction = () => {
    const { mashMedia } = editor
    assertObject(mashMedia, 'mashMedia')

    const { label } = mashMedia
    if (editedLabel !== label) {
      setDescribed(original => [...original])
      setEditedLabel(label)
    }
    updateDisabled()
  }

  useListeners({
    [EventType.Action]: handleAction,
    [EventType.Loaded]: handleEdited,
    [EventType.Save]: updateDisabled,
  })

  const onChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (disabled) return

    const { selectedIndex } = event.target
    const object = described[selectedIndex]
    assertObject(object, 'described[selectedIndex]')

    const { id } = object
    const request: DataGetRequest = { id }
    const { editType } = editor
    const endpoint = Endpoints.data[editType].get
    console.debug("GetRequest", endpoint, request)
    endpointPromise(endpoint, request).then((response: DataMashGetResponse) => {
      console.debug("GetResponse", endpoint, response)
      const { error, mash } = response
      if (error) console.error("GetResponse", endpoint, error)
      else return editor.load(mash)
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
    const { editType, mashMedia } = editor
    const elements = [<optgroup key="group" label={labelTranslate('open')}/>]
    if (!mashMedia) return elements

    const { id: editedId, label: editedLabel } = mashMedia
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
    key: "mashMedia-select",
    onChange, disabled, children: describedOptions(), value: editedId
  }
  const viewProps = { ...rest, children: [child, <select {...selectOptions} />] }
  return <View { ...viewProps } />
}
