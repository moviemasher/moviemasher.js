import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { MovieMasher, ReactMovieMasher, RemixIcons, DefaultInputs } from "@moviemasher/react-moviemasher"

MovieMasher.image.install({
  label: "Frog", id: "id-frog-image",
  url: "raw/frog.jpg",
})

MovieMasher.audio.install({
  label: "Loop", id: "id-loop-audio",
  url: "raw/loop.mp3", loops: true, duration: 5,
})

MovieMasher.audio.install({
  label: "Monster Mash", id: "id-monster-mash",
  url: "raw/monster-mash.mp3", duration: 180,
})

MovieMasher.video.install({
  label: "My Video", id: "id-video", source: 'raw/video/original.mp4',
  audio: "raw/video/audio.mp3",
  url: "raw/video/256x144x10/", duration: 79, fps: 10,
})

MovieMasher.video.install({
  label: "My Stream", id: "id-video-stream",
  stream: true, duration: 10,
  url: 'https://68751d6f4c50.us-east-1.playback.live-video.net/api/video/v1/us-east-1.216119970089.channel.mrSPHVtl3IFY.m3u8',
})

MovieMasher.font.install({
  label: "BlackoutTwoAM", id: "com.moviemasher.font.default",
  source: "raw/BlackoutTwoAM.ttf",
})

const application = <ReactMovieMasher icons={RemixIcons} inputs={DefaultInputs} />

render(<StrictMode>{application}</StrictMode>, document.getElementById('app'))
