import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApiClient, Masher, MasherDefaultProps } from "@moviemasher/client-react"

const element = document.getElementById('root')!
const options = { previewSize: { width: 480, height: 270 } }
const props = MasherDefaultProps(options)
const masher = <Masher {...props} />
const editor = <ApiClient>{masher}</ApiClient>
ReactDOM.createRoot(element).render(editor)
