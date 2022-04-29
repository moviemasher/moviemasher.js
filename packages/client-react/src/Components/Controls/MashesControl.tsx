import React from "react"
import {
  DataMashRetrieveRequest, DataMashRetrieveResponse,
  Endpoints, EventType, MasherAction, ServerType, MashFactory, MashObject, DataMashGetResponse, DataMashGetRequest
} from "@moviemasher/moviemasher.js"

import { PropsWithoutChild, ReactResult } from "../../declarations"
import { useMashEditor } from "../../Hooks/useMashEditor"
import { useListeners } from "../../Hooks/useListeners"
import { ApiContext } from "../../Contexts/ApiContext"

function MashesControl(props: PropsWithoutChild): ReactResult {
  const [requested, setRequested] = React.useState(false)
  const mashObjects = React.useRef<MashObject[]>([])
  // const [mashObjects, setMashObjects] = React.useState<MashObject[]>([])
  const apiContext = React.useContext(ApiContext)
  const masher = useMashEditor()
  const [mash, setMash] = React.useState(masher.mash)
  const [mashLabel, setMashLabel] = React.useState(masher.mash.label)

  const [mashId, setMashId] = React.useState(masher.mash.id)

  const getDisabled = () => masher.can(MasherAction.Save)
  const [disabled, setDisabled] = React.useState(getDisabled)
  const { enabled, endpointPromise } = apiContext


  const updateDisabled = () => { setDisabled(getDisabled()) }

  const findMashObject = (id: string): MashObject | undefined => {
    const found = mashObjects.current.find(object => object.id === id)
    if (!found) console.log("findMashObject not found", id, mashObjects.current.length)
    return found
  }

  const assureMashObject = () => {

    const { id } = masher.mash
    const mashObject = findMashObject(id)
    if (!mashObject) {

    }

  }

  const handleSave = () => {
    updateDisabled()

  }

  const handleMash = () => {
    console.log("handleMash", masher.mash.id, masher.mash.label)
    setMash(masher.mash)
    setMashLabel(masher.mash.label)
    setMashId(masher.mash.id)
  }

  useListeners({
    [EventType.Action]: () => {
    // assureMashObject()
    console.log("handleAction", masher.mash.id, masher.mash.label, mashLabel)
    const { label, id } = masher.mash
    if (mashLabel !== label) {
      const mashObject = findMashObject(id)
      if (mashObject) {
        mashObject.label = label
        setMashLabel(label)
      }
    }
    updateDisabled()
  },
    [EventType.Mash]: handleMash,
    [EventType.Save]: handleSave,
  })

  const mashDefinitionsOptions = () => {
    console.log("mashDefinitionsOptions", mashLabel)
    const children = mashObjects.current.map(mashObject => {
      const { id: mashId } = mash
      const { label, id } = mashObject
      const selected = id === mashId
      const children = selected ? mashLabel : label || id
      const optionProps = { children, value: id!, selected }
      const option = <option {...optionProps} />
      return option
    })
    children.push(<option value=''>New...</option>)
    return children
  }

  const options = React.useMemo(mashDefinitionsOptions, [mashObjects.current, mash, mashLabel])

  const onChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (disabled) return

    const { selectedIndex } = event.target
    const mashObject = mashObjects.current[selectedIndex]
    if (!mashObject) {
      const mashInstance = MashFactory.instance()
      mashObjects.current.push(JSON.parse(JSON.stringify(mashInstance)))
      // setMashObjects(current => {
      //   masher.mash = mashInstance
      //   return [...current, JSON.parse(JSON.stringify(mashInstance))]
      // })
    } else {
      const id = mashObject.id!
      const request: DataMashGetRequest = { id }
      console.debug("DataMashGetRequest", Endpoints.data.mash.retrieve, request)
      endpointPromise(Endpoints.data.mash.get, request).then((response: DataMashGetResponse) => {
        console.debug("DataMashGetResponse", Endpoints.data.mash.retrieve, response)
        const { mash, definitions } = response
        masher.mash = MashFactory.instance(mash, definitions)
      })
    }
  }

  React.useEffect(() => {
    if (requested) return
    if (!enabled.includes(ServerType.Data)) return

    setRequested(true)
    const request: DataMashRetrieveRequest = { partial: true }
    console.debug("DataMashRetrieveRequest", Endpoints.data.mash.retrieve, request)
    endpointPromise(Endpoints.data.mash.retrieve, request).then((response: DataMashRetrieveResponse) => {
      console.debug("DataMashRetrieveResponse", Endpoints.data.mash.retrieve, response)
      mashObjects.current = response.mashObjects
      // setMashObjects(() => response.mashObjects)
    })
  }, [enabled])

  const selectOptions = { ...props, onChange, disabled, children: options }
  return <select {...selectOptions} />
}

export { MashesControl }
