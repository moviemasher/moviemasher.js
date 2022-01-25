import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import {
  MasherDefaults, Masher, DefaultIcons, Api, Process, ProcessStatus, ProcessActive,
  UploadControl, SaveControl, RenderControl, Button, MasherDefaultsOptions,
} from "@moviemasher/client-react"
import { Factory } from "@moviemasher/moviemasher.js"

import "@moviemasher/client-react/dist/moviemasher.css"

Factory.image.install({
  label: "Image", id: "id-image",
  url: "assets/image.jpg",
})

Factory.audio.install({
  label: "Loop", id: "id-loop-audio",
  url: "assets/loop.mp3", loops: true, duration: 5,
})

Factory.audio.install({
  label: "Soundtrack", id: "id-soundtrack",
  url: "assets/soundtrack.mp3", duration: 180,
})

Factory.videosequence.install({
  label: "Sequence", id: "id-video-sequence", source: 'assets/video/original.mp4',
  audio: "assets/video/audio.mp3",
  url: "assets/video/256x144x10/", duration: 79, fps: 10,
})

Factory.video.install({
  label: "Video", id: "id-video",
  url: 'assets/video.mp4',
  duration: 3, fps: 10,
})

Factory.videostream.install({
  label: "Stream", id: "id-video-stream",
  duration: 10,
  url: 'https://68751d6f4c50.us-east-1.playback.live-video.net/api/video/v1/us-east-1.216119970089.channel.mrSPHVtl3IFY.m3u8',
})

Factory.font.install({
  label: "BlackoutTwoAM", id: "com.moviemasher.font.default",
  source: "assets/BlackoutMidnight.ttf",
})

const uploadProcess = (
  <Process key='upload-process' id='content'>
    <UploadControl>
      {DefaultIcons.upload}
    </UploadControl>
    <ProcessActive><ProcessStatus/></ProcessActive>
  </Process>
)

const saveProcess = (
  <Process key='save-process' id='content'>
    <SaveControl><Button>Save</Button></SaveControl>
  </Process>
)

const renderProcess = (
  <Process key='render-process' id='render'>
    <RenderControl><Button>Render</Button></RenderControl>
  </Process>
)

const applicationOptions: MasherDefaultsOptions = {
  icons: DefaultIcons,
  panels: {
    player: { header: { content: <img key='mm' src="img/mm.svg"/> }},
    browser: { footer: { before: uploadProcess } },
    timeline: { header: { before: saveProcess, after: renderProcess } },
  },
}

const editor = <Masher {...MasherDefaults(applicationOptions)} />
const host = <Api>{editor}</Api>
const mode = <StrictMode>{host}</StrictMode>
ReactDOM.render(mode, document.getElementById('app'))
