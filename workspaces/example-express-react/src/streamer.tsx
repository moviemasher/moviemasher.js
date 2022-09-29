import React from 'react'
import ReactDOM from 'react-dom'

const { createRoot } = ReactDOM


import { ApiClient, Streamer, DefaultStreamerProps } from "@moviemasher/client-react"
import "@moviemasher/theme-default/moviemasher.css"

const element = document.getElementById('app')
const applicationOptions = { previewSize: { width: 480, height: 270 } }
const options = DefaultStreamerProps(applicationOptions)
const caster = <Streamer {...options} />
const editor = <ApiClient>{caster}</ApiClient>
createRoot(element).render(editor)


