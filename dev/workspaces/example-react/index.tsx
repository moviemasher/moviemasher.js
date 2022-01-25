import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Factory } from "@moviemasher/moviemasher.js"
import {
  MasherDefaults, Masher, DefaultIcons
} from "@moviemasher/client-react"

import "@moviemasher/client-react/dist/moviemasher.css"

Factory.image.install({
  label: "Image", id: "id-image",
  url: "assets/image.jpg",
})

Factory.audio.install({
  label: "Soundtrack", id: "id-audio",
  url: "assets/soundtrack.mp3", duration: 180,
})

Factory.video.install({
  label: "Video", id: "id-video",
  url: 'assets/video.mp4',
  duration: 3, fps: 10,
})

const options = { icons: DefaultIcons }
const editor = <Masher {...MasherDefaults(options)} />
const mode = <StrictMode>{editor}</StrictMode>
ReactDOM.render(mode, document.getElementById('app'))
