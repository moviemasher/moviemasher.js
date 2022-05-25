import React from "react"
import {
  DataMashRetrieveRequest, DataRetrieveResponse, DataGetRequest,
  Endpoints, EventType, MasherAction, ServerType, Described,
  DataCastGetResponse, DataMashGetResponse, Errors, EditType
} from "@moviemasher/moviemasher.js"

import { PropsWithoutChild, ReactResult } from "../../declarations"
import { useEditor } from "../../Hooks/useEditor"
import { useListeners } from "../../Hooks/useListeners"
import { ApiContext } from "../../Contexts/ApiContext"

export function SelectEditedControl(props: PropsWithoutChild): ReactResult {
  const [requested, setRequested] = React.useState(false)
  const described = React.useRef<Described[]>([])
  const apiContext = React.useContext(ApiContext)
  const editor = useEditor()
  const [editedId, setEditedId] = React.useState(editor.edited?.id || '')
  const [editedLabel, setEditedLabel] = React.useState(editor.edited?.label || '')
  const getDisabled = () => editor.can(MasherAction.Save)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const { enabled, endpointPromise } = apiContext

  const updateDisabled = () => { setDisabled(getDisabled()) }

  const findDescribed = (id: string): Described | undefined => {
    return described.current.find(object => object.id === id)
  }

  const handleSave = () => {
    if (!editedId) {
      // saved new
      const { edited } = editor
      if (!edited) return

      const { id, label, createdAt } = edited
      const object = findDescribed(id)
      if (!object) {
        described.current.push({ id, label, createdAt })
      }
      setEditedId(id)
    }
    updateDisabled()
  }

  const handleMash = () => {
    setEditedId(editor.edited?.id || '')
    setEditedLabel(editor.edited?.label || '')
  }

  const handleAction = () => {
    const { edited } = editor
    if (!edited) return

    const { label, id } = edited
    if (editedLabel !== label) {
      const object = findDescribed(id)
      if (object) object.label = label
      setEditedLabel(label)
    }
    updateDisabled()
  }

  useListeners({
    [EventType.Action]: handleAction,
    [EventType.Mash]: handleMash,
    [EventType.Save]: handleSave,
  })

  const describedOptions = () => {
    const { edited } = editor

    const editedId = edited?.id || ''

    let editedFound = false
    const children = described.current.map(object => {
      const { label, id } = object
      const selected = id === editedId
      editedFound ||= selected
      const children = selected ? editedLabel : label || id
      const optionProps = { children, value: id, key: id }
      const option = <option {...optionProps} />
      return option
    })
    if (!editedFound) {
      children.push(<option key={editedId} value={editedId}>{editedLabel}</option>)
    }
    return children
  }

  const options = React.useMemo(describedOptions, [described.current, editedId, editedLabel])

  const onChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (disabled) return

    const { selectedIndex } = event.target
    const object = described.current[selectedIndex]
    if (!object) throw Errors.internal

    const id = object.id!
    const request: DataGetRequest = { id }
    const { editType } = editor
    const endpoint = Endpoints.data[editType].get
    // console.debug("GetRequest", endpoint, request)
    endpointPromise(endpoint, request).then((response: DataMashGetResponse | DataCastGetResponse) => {
      // console.debug("GetResponse", endpoint, response)
      return editor.load(response)
    })
  }

  React.useEffect(() => {
    if (requested) return
    if (!enabled.includes(ServerType.Data)) return

    setRequested(true)
    const request: DataMashRetrieveRequest = { partial: true }
    const endpoint = Endpoints.data[editor.editType].retrieve
    // console.debug("RetrieveRequest", endpoint, request)
    endpointPromise(endpoint, request).then((response: DataRetrieveResponse) => {
      // console.debug("RetrieveResponse", endpoint, response)
      described.current = response.described
    })
  }, [enabled])

  if (!options.length) return null

  const selectOptions = {
    ...props, onChange, disabled, children: options, value: editedId
  }
  return <select {...selectOptions} />
}
