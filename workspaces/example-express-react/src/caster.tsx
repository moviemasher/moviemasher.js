import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { ApiClient, Caster, DefaultCasterProps } from "@moviemasher/client-react"
import "@moviemasher/client-react/dist/moviemasher.css"

const applicationOptions = { previewSize: { width: 480, height: 270 } }
const options = DefaultCasterProps(applicationOptions)
const caster = <Caster {...options} />
const editor = <ApiClient>{caster}</ApiClient>
const strictMode = <StrictMode>{editor}</StrictMode>
ReactDOM.render(strictMode, document.getElementById('app'))
