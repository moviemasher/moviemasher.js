import React from "react"
import { assertObject, RawTypes } from "@moviemasher/moviemasher.js"

import { PropsAndChild, ReactResult } from "../../declarations"
import { MasherContext } from "../Masher/MasherContext"
import { useClient } from "../../Hooks/useClient"

const BrowserControlId = 'upload-control-id'

export function BrowserControl(props: PropsAndChild): ReactResult {
  const { children, ...rest } = props
  const fileInput = React.useRef<HTMLInputElement>(null)
  const client = useClient()
  const editorContext = React.useContext(MasherContext)
  const { drop } = editorContext


  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget
    if (files) drop(files)
  }

  const accept = client.accept()
  
  const inputProps = {
    accept,
    multiple: true,
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
