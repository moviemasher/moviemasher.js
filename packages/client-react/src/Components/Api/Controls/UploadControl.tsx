import React from "react"
import {
  Endpoints, fetchCallback,
  DataDefinitionPutRequest, DataDefinitionPutResponse,
  FileStoreResponse, RenderingStartResponse,
} from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../../declarations"
import { ApiContext } from "../../../Contexts/ApiContext"
import { ProcessContext } from "../../../Contexts/ProcessContext"

const UploadControlId = 'upload-control-id'

function UploadControl(props: PropsAndChild): ReactResult {
  const fileInput = React.useRef<HTMLInputElement>(null)
  const apiContext = React.useContext(ApiContext)
  const processContext = React.useContext(ProcessContext)

  const { children, ...rest } = props
  const { processing, setProcessing, setStatus } = processContext
  const { endpointPromise } = apiContext

  const startProcessing = (file: File) => {
    if (processing) return

    const { type, name, size } = file
    console.log("startProcessing", file)
    setProcessing(true)
    const request: DataDefinitionPutRequest = { type, name, size }
    console.debug("DataDefinitionPutRequest", Endpoints.data.definition.put, request)
    endpointPromise(Endpoints.data.definition.put, request).then((response: DataDefinitionPutResponse) => {
      console.debug("DataDefinitionPutResponse", Endpoints.data.definition.put, response)
      const { fileCallback, renderingCallback, fileProperty } = response
      if (fileCallback && fileCallback.request) {

        if (fileProperty) {
          console.debug(`SETTING body.${fileProperty}`)
          fileCallback.request.body![fileProperty] = file
        } else {
          console.debug("SETTING BODY")
          fileCallback.request.body = file
        }

        console.debug("FileStoreRequest", fileCallback)
        fetchCallback(fileCallback).then((response: FileStoreResponse) => {
          console.debug("FileStoreResponse", response)
          if (renderingCallback) {
            console.debug("RenderingStartRequest", renderingCallback)
            fetchCallback(renderingCallback).then((response: RenderingStartResponse) => {
              console.debug("RenderingStartResponse", response)
              setProcessing(false)
            })
          } else setProcessing(false)
        })
      } else setProcessing(false)
    })
  }

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget
    if (!(files && files.length)) return

    startProcessing(files[0])
  }

  const inputProps = {
    accept: 'audio/*,video/*,image/*',
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
