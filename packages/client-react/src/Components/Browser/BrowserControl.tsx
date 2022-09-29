import React from "react"
import { ServerType, assertObject, UploadTypes } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { ApiContext } from "../ApiClient/ApiContext"
import { MasherContext } from "../Masher/MasherContext"

const BrowserControlId = 'upload-control-id'

export function BrowserControl(props: PropsAndChild): ReactResult {
  const fileInput = React.useRef<HTMLInputElement>(null)
  const apiContext = React.useContext(ApiContext)
  const editorContext = React.useContext(MasherContext)

  const { servers } = apiContext
  const { drop } = editorContext

  // const required = [ServerType.File, ServerType.Data, ServerType.Rendering]
  // if (!(enabled && required.every(type => servers[type]))) return null

  const { children, ...rest } = props

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget
    if (files) drop(files)
  }

  const { file = {} } = servers
  const { 
    extensions = Object.fromEntries(UploadTypes.map(type => [type, []])) 
  } = file
  assertObject(extensions)

  const accept = Object.entries(extensions).flatMap(([uploadType, noDots]) => {
    return [`${uploadType}/*`, ...noDots.map((noDot: string) => `.${noDot}`)]
  }).join(',')

  const inputProps = {
    accept,
    id: BrowserControlId,
    onChange,
    type: 'file',
    key: 'browser-control-input',
    ref: fileInput,
    ...rest,
  }
  const input = <input {...inputProps}/>

  if (!React.isValidElement(children)) return input

  const kids = [React.Children.only(children), input]

  const labelProps = {
    children: kids,
    key: 'browser-control',
    htmlFor: BrowserControlId
  }
  return <label {...labelProps} />
}
