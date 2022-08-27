import React from "react"
import { ServerType, assertObject } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { ApiContext } from "../ApiClient/ApiContext"
import { EditorContext } from "../../Components/Masher/EditorContext"

const BrowserControlId = 'upload-control-id'

export function BrowserControl(props: PropsAndChild): ReactResult {
  const fileInput = React.useRef<HTMLInputElement>(null)
  const apiContext = React.useContext(ApiContext)
  const editorContext = React.useContext(EditorContext)

  const { servers, enabled } = apiContext
  const { dropFiles } = editorContext
  const required = [ServerType.File, ServerType.Data, ServerType.Rendering]
  if (!required.every(serverType => enabled.includes(serverType))) return null

  const { children, ...rest } = props

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget
    if (files) dropFiles(files)
  }

  const { file } = servers
  assertObject(file)

  const { extensions } = file
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
