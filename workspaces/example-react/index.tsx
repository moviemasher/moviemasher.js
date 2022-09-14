import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Masher, MasherPropsDefault } from "@moviemasher/client-react"
import "@moviemasher/client-react/dist/moviemasher.css"

const masher = <Masher {...MasherPropsDefault({})} />
const strictMode = <StrictMode>{masher}</StrictMode>
ReactDOM.render(strictMode, document.getElementById('app'))
