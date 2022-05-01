import React from "react"
import {
  DataDefinitionRetrieveRequest, DataDefinitionRetrieveResponse,
  DefinitionBase, Endpoints, ServerType
} from '@moviemasher/moviemasher.js'
import { View } from "../../Utilities/View"
import { BrowserContext } from "../../Contexts/BrowserContext"
import { ReactResult } from "../../declarations"
import { propsDefinitionTypes } from "../../Utilities/Props"
import { ApiContext } from "../../Contexts/ApiContext"
import { BrowserSourceProps } from "./BrowserSource"

/**
 * @parents Browser
 */
export function BrowserDataSource(props: BrowserSourceProps): ReactResult {
  const browserContext = React.useContext(BrowserContext)
  const apiContext = React.useContext(ApiContext)
  const [requested, setRequested] = React.useState(false)

  const { enabled, endpointPromise } = apiContext

  const { type, types, className, id, ...rest } = props
  const { sourceId, setDefinitions, setSourceId, setDefinitionId } = browserContext

  const classes = []
  if (className) classes.push(className)

  if (sourceId === id) {
    // TODO: get from props or context
    classes.push('selected')
  }

  const onClick = () => {
    if (requested) return

    if (sourceId !== id) setSourceId(id)
    setDefinitionId('')
    setDefinitions(undefined)
    setRequested(true)
    // console.debug("BrowserDataSource onClick")
    const definitionTypes = propsDefinitionTypes(type, types, id)
    const request: DataDefinitionRetrieveRequest = { types: definitionTypes }
    // console.debug("DataDefinitionRetrieveRequest", Endpoints.data.definition.retrieve, request)
    endpointPromise(
      Endpoints.data.definition.retrieve, request
    ).then((response: DataDefinitionRetrieveResponse) => {
      // console.debug("DataDefinitionRetrieveResponse", Endpoints.data.definition.retrieve, response)
      const { definitions } = response
      setDefinitions(
        definitions.map(definition => DefinitionBase.fromObject(definition))
      )
      setRequested(false)
    })
  }

  React.useEffect(() => {
    // console.log("BrowserDataSource useEffect", enabled.includes(ServerType.Data), sourceId, id)
    if (enabled.includes(ServerType.Data) && sourceId === id) onClick()
  }, [enabled, sourceId])

  const viewProps = { ...rest, onClick, className: classes.join(' ') }
  return <View {...viewProps}/>
}
