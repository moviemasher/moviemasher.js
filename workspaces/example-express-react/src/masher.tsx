import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApiClient, Masher, MasherDefaultProps } from "@moviemasher/client-react"
import "@moviemasher/theme-default/moviemasher.css"
import { Defined, DefinitionType } from '@moviemasher/moviemasher.js'

Defined.define({
  type: DefinitionType.Font,
  id: 'font.valken',
  label: 'Valken',
  source: "../shared/font/valken/valken.ttf",
  url: "../shared/font/valken/valken.woff2",
})
const element = document.getElementById('app')!
const options = { previewSize: { width: 480, height: 270 } }
const props = MasherDefaultProps(options)
const masher = <Masher {...props} />
const editor = <ApiClient>{masher}</ApiClient>
ReactDOM.createRoot(element).render(editor)
