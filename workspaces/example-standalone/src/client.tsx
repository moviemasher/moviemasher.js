import React from 'react'
import ReactDOM from 'react-dom/client'
import { Masher, MasherDefaultProps } from "@moviemasher/client-react"

const element = document.getElementById('root')!
const options = { previewSize: { width: 480, height: 270 } }
const props = MasherDefaultProps(options)
const masher = <Masher {...props} />
ReactDOM.createRoot(element).render(masher)
