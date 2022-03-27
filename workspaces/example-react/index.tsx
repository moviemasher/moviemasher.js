import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'

import {
  DefaultIcons, Masher, MasherDefault, MasherDefaultOptions
} from "@moviemasher/client-react"

import "@moviemasher/client-react/dist/moviemasher.css"

const options: MasherDefaultOptions = { icons: DefaultIcons }
const masher = <Masher {...MasherDefault(options)} />
const mode = <StrictMode>{masher}</StrictMode>
ReactDOM.render(mode, document.getElementById('app'))
