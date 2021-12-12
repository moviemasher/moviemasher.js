import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { ReactMovieMasher, RemixIcons, DefaultInputs } from "@moviemasher/react-moviemasher"
import { Factory } from "@moviemasher/moviemasher.js"

import "@moviemasher/react-moviemasher/dist/moviemasher.css"

Factory.image.install({
  label: "Image", id: "id-image",
  url: "assets/image.jpg",
})

Factory.audio.install({
  label: "Monster Mash", id: "id-monster-mash",
  url: "assets/raw/monster-mash.mp3", duration: 180,
})

Factory.video.install({
  label: "Video", id: "id-video", url: 'assets/raw/timing.mp4',
  duration: 3, fps: 10,
})

Factory.font.install({
  label: "BlackoutTwoAM", id: "com.moviemasher.font.default",
  source: "assets/raw/BlackoutTwoAM.ttf",
})

const applicationOptions = {
  icons: RemixIcons,
  inputs: DefaultInputs,
}

const application = <ReactMovieMasher {...applicationOptions} />

ReactDOM.render(<StrictMode>{application}</StrictMode>, document.getElementById('app'))
