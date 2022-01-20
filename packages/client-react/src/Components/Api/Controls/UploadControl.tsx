import React from "react"
import { urlForServerOptions, UploadDescription, ContentGetStoreResponse, ContentGetStoredResponse, ServerType } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../../declarations"
import { ApiContext } from "../../../Contexts/ApiContext"
import { ProcessContext } from "../../../Contexts/ProcessContext"

const UploadControlId = 'upload-control-id'

function UploadControl(props: PropsAndChild): ReactResult {
  const fileInput = React.useRef<HTMLInputElement>(null)
  const apiContext = React.useContext(ApiContext)
  const processContext = React.useContext(ProcessContext)

  const { children, ...rest } = props
  const { processing, setProcessing } = processContext
  const { serverOptionsPromise } = apiContext

  const startProcessing = (file: File) => {
    if (processing) return

    const { type, name, size } = file
    console.log("startProcessing", file)
    setProcessing(true)
    serverOptionsPromise(ServerType.Content).then(serverOptions => {
      const storeUrl = urlForServerOptions(serverOptions, '/store')
      const decodeJob: UploadDescription = { type, name, size }
      const storeOptions = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(decodeJob),
      }
      console.log("POST request", storeUrl, JSON.parse(storeOptions.body))
      fetch(storeUrl, storeOptions).then(response => response.json()).then((json: ContentGetStoreResponse) => {
        console.log("POST response", storeUrl, json)
        const { server, headers, method } = json
        const uploadUrl = urlForServerOptions(server)
        const uploadOptions = { headers, method, body: file }
        fetch(uploadUrl, uploadOptions).then(() => {
          const storedUrl = urlForServerOptions(serverOptions, '/stored')
          fetch(storedUrl).then(response => response.json()).then((json: ContentGetStoredResponse) => {
            console.log("json", json)

            setProcessing(false)
          })
        })
      })
    })
  }

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
