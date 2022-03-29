import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Masher, MasherDefaultProps } from "@moviemasher/client-react"
import "@moviemasher/client-react/dist/moviemasher.css"

const options = { noApi: true }
const masher = <Masher {...MasherDefaultProps(options)} />
const strictMode = <StrictMode>{masher}</StrictMode>
ReactDOM.render(strictMode, document.getElementById('app'))
