import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApiClient, Masher, MasherCastProps } from "@moviemasher/client-react"
import "@moviemasher/theme-default/moviemasher.css"

const element = document.getElementById('app')!
const applicationOptions = { previewSize: { width: 480, height: 270 } }
const options = MasherCastProps(applicationOptions)
const caster = <Masher {...options} />
const editor = <ApiClient>{caster}</ApiClient>
ReactDOM.createRoot(element).render(editor)
