import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import {
  UploadButton, SaveButton, ReactMovieMasher,
  RemixIcons, DefaultInputs,
  Host, RenderButton, StreamButton, Button,
  Status,
} from "@moviemasher/react-moviemasher"

import { Factory } from "@moviemasher/moviemasher.js"

import "@moviemasher/react-moviemasher/dist/moviemasher.css"

Factory.image.install({
  label: "Image", id: "id-image",
  url: "assets/image.jpg",
})

Factory.audio.install({
  label: "Loop", id: "id-loop-audio",
  url: "assets/raw/loop.mp3", loops: true, duration: 5,
})

Factory.audio.install({
  label: "Monster Mash", id: "id-monster-mash",
  url: "assets/raw/monster-mash.mp3", duration: 180,
})

Factory.videosequence.install({
  label: "Sequence", id: "id-video-sequence", source: 'assets/raw/video/original.mp4',
  audio: "assets/raw/video/audio.mp3",
  url: "assets/raw/video/256x144x10/", duration: 79, fps: 10,
})

Factory.video.install({
  label: "Video", id: "id-video", url: 'assets/raw/timing.mp4',
  duration: 3, fps: 10,
})

Factory.videostream.install({
  label: "Stream", id: "id-video-stream",
  duration: 10,
  url: 'https://68751d6f4c50.us-east-1.playback.live-video.net/api/video/v1/us-east-1.216119970089.channel.mrSPHVtl3IFY.m3u8',
})

Factory.font.install({
  label: "BlackoutTwoAM", id: "com.moviemasher.font.default",
  source: "assets/raw/BlackoutTwoAM.ttf",
})

const uploadHost = (
  <Host id='cms'>
    <UploadButton>
    <Button startIcon={RemixIcons.upload}>Upload</Button>
    </UploadButton>
  </Host>
)
const saveHost = (
  <Host id='cms'>
    <SaveButton><Button>Save</Button></SaveButton>
  </Host>
)

const renderHost = (
  <Host id='render'>
    <RenderButton><Button>Render</Button></RenderButton>
  </Host>
)
const streamHost = (
  <Host id='stream'>
    <StreamButton><Button>Stream</Button></StreamButton>
    <Status/>
  </Host>
)
const applicationOptions = {
  icons: RemixIcons,
  inputs: DefaultInputs,
  panels: {
    player: { header: { middle: <img src="assets/mm.svg"/> }},
    browser: { footer: { left: uploadHost } },
    timeline: { header: { left: saveHost, right: renderHost } },
    inspector: { content: { child: streamHost } },
  },
}

const application = <ReactMovieMasher {...applicationOptions} />

ReactDOM.render(<StrictMode>{application}</StrictMode>, document.getElementById('app'))
