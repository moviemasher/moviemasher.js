import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { ApiClient, Streamer, DefaultStreamerProps } from "@moviemasher/client-react"
import "@moviemasher/client-react/dist/moviemasher.css"

const applicationOptions = { previewDimensions: { width: 480, height: 270 } }
const options = DefaultStreamerProps(applicationOptions)
const caster = <Streamer {...options} />
const editor = <ApiClient>{caster}</ApiClient>
const strictMode = <StrictMode>{editor}</StrictMode>
ReactDOM.render(strictMode, document.getElementById('app'))
