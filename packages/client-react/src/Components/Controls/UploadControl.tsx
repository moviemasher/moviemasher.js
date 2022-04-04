import React from "react"
import {
  Endpoints, fetchCallback,
  FileStoreResponse, ServerType,
  RenderingUploadRequest, RenderingUploadResponse, ApiCallback, ApiCallbackResponse, LoadType, DataDefinitionPutRequest, RenderingStatusRequest, RenderingStatusResponse, OutputTypes
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { ApiContext } from "../../Contexts/ApiContext"
import { ProcessContext } from "../../Contexts/ProcessContext"
import { BrowserContext } from "../../Contexts/BrowserContext"

const UploadControlId = 'upload-control-id'

function UploadControl(props: PropsAndChild): ReactResult {
  const fileInput = React.useRef<HTMLInputElement>(null)
  const apiContext = React.useContext(ApiContext)
  const processContext = React.useContext(ProcessContext)
  const browserContext = React.useContext(BrowserContext)
  const loadTypeRef = React.useRef('')
  const { endpointPromise, servers, enabled } = apiContext
  const required = [ServerType.File, ServerType.Data, ServerType.Rendering]
  if (!required.every(serverType => enabled.includes(serverType))) return null

  const { children, ...rest } = props
  const { processing, setProcessing, setProgress, setError } = processContext

  const handleApiCallback = (callback: ApiCallback) => {
    setTimeout(() => {
      // console.debug("handleApiCallback request", apiCallback)
      fetchCallback(callback).then((response: ApiCallbackResponse) => {
        const { apiCallback, error } = response
        // console.debug("handleApiCallback request", response)
        if (error) handleError(callback.endpoint.prefix!, error)
        else if (apiCallback) {
          const { request, endpoint } = apiCallback
          if (endpoint.prefix === Endpoints.data.definition.put) {
            const putRequest: DataDefinitionPutRequest = request!.body!
            const { type } = putRequest.definition
            if (type) loadTypeRef.current = type
          }
          if (callback.endpoint.prefix === Endpoints.rendering.status) {
            const statusResponse: RenderingStatusResponse = response
            let total = 0
            let completed = 0
            OutputTypes.forEach(type => {
              const state = statusResponse[type]
              if (!state) return

              total += state.total
              completed += state.completed
            })
            if (total) setProgress(completed / total)
            else console.warn("handleApiCallback", total, completed, statusResponse)
          }
          handleApiCallback(apiCallback)
        }
        else if (loadTypeRef.current) {
          // refresh browser view...
          const { setSourceId, setDefinitions } = browserContext
          setDefinitions(undefined)
          setProcessing(false)
          setSourceId('')
          setTimeout(() => { setSourceId(loadTypeRef.current) }, 10)
        }
      })
    }, 2000)
  }
  const handleError = (endpoint: string, error: string) => {
    setProcessing(false)
    setError(error)
    console.error(endpoint, error)
  }

  const startProcessing = (file: File) => {
    if (processing) return

    const { type, name, size } = file
    // console.log("startProcessing", file)
    setProcessing(true)
    loadTypeRef.current = ''
    const request: RenderingUploadRequest = { type, name, size }
    // console.debug("RenderingUploadRequest", Endpoints.rendering.upload, request)
    endpointPromise(Endpoints.rendering.upload, request).then((response: RenderingUploadResponse) => {
      // console.debug("RenderingUploadResponse", Endpoints.rendering.upload, response)
      const { error, fileApiCallback, apiCallback, fileProperty } = response
      if (error) return handleError(Endpoints.rendering.upload, error)
      if (fileApiCallback && fileApiCallback.request) {
        if (fileProperty) {
          // console.debug(`SETTING body.${fileProperty}`)
          fileApiCallback.request.body![fileProperty] = file
        } else {
          // console.debug("SETTING BODY")
          fileApiCallback.request.body = file
        }
        // console.debug("FileStoreRequest", fileApiCallback)
        fetchCallback(fileApiCallback).then((response: FileStoreResponse) => {
          // console.debug("FileStoreResponse", response)
          const { error } = response
          if (error) return handleError(fileApiCallback.endpoint.prefix!, error)

          handleApiCallback(apiCallback!)
        })
      } else handleApiCallback(apiCallback!)
    })
  }

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget
    if (!(files && files.length)) return

    startProcessing(files[0])
  }

  const inputProps = {
    accept: String(servers.file?.accept),
    id: UploadControlId,
    onChange,
    type: 'file',
    key: 'upload-input',
    ref: fileInput,
    disabled: processing,
    ...rest,
  }
  const input = <input {...inputProps}/>

  if (!React.isValidElement(children)) return input

  const kids = [React.Children.only(children), input]

  const labelProps = {
    children: kids,
    key: 'label',
    htmlFor: UploadControlId
  }
  return <label {...labelProps} />
}

export { UploadControl }

//   function readVideo(event) {
//   if (event.target.files && event.target.files[0]) {
//     var reader = new FileReader();

//     reader.onload = function(e) {
//       videoSrc.src = e.target.result
//       videoTag.load()
//     }.bind(this)

//     reader.readAsDataURL(event.target.files[0]);
//   }
// }
