import React from 'react'
import ReactDOM from 'react-dom/client'
import { MasherApp, MasherAppDefaultProps } from "@moviemasher/client-react"

const element = document.getElementById('root')!
const options = { previewSize: { width: 480, height: 270 } }
const props = MasherAppDefaultProps(options)
const masher = <MasherApp {...props} />
ReactDOM.createRoot(element).render(masher)
