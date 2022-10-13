import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApiClient, Masher, MasherCastProps } from "@moviemasher/client-react"

const element = document.getElementById('root')!
const applicationOptions = { previewSize: { width: 480, height: 270 } }
const options = MasherCastProps(applicationOptions)
const caster = <Masher {...options} />
const editor = <ApiClient>{caster}</ApiClient>
ReactDOM.createRoot(element).render(editor)
