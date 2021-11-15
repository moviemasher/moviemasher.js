import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { DefinitionType, Factory, ReactMovieMasher, RemixIcons, DefaultInputs } from "@moviemasher/react-moviemasher"

Factory[DefinitionType.Image].install({
  label: "Image", id: "id-image",
  url: "assets/image.jpg",
})

Factory[DefinitionType.Audio].install({
  label: "Loop", id: "id-loop-audio",
  url: "assets/raw/loop.mp3", loops: true, duration: 5,
})

Factory[DefinitionType.Audio].install({
  label: "Monster Mash", id: "id-monster-mash",
  url: "assets/raw/monster-mash.mp3", duration: 180,
})

Factory[DefinitionType.VideoSequence].install({
  label: "Sequence", id: "id-video-sequence", source: 'assets/raw/video/original.mp4',
  audio: "assets/raw/video/audio.mp3",
  url: "assets/raw/video/256x144x10/", duration: 79, fps: 10,
})

Factory[DefinitionType.Video].install({
  label: "Video", id: "id-video", url: 'assets/raw/timing.mp4',
  duration: 3, fps: 10,
})

Factory[DefinitionType.VideoStream].install({
  label: "Stream", id: "id-video-stream",
  duration: 10,
  url: 'https://68751d6f4c50.us-east-1.playback.live-video.net/api/video/v1/us-east-1.216119970089.channel.mrSPHVtl3IFY.m3u8',
})

Factory[DefinitionType.Font].install({
  label: "BlackoutTwoAM", id: "com.moviemasher.font.default",
  source: "assets/raw/BlackoutTwoAM.ttf",
})

const testMashObject = () => {
  console.warn("TODO: remove mash content")

  const clips = [
    { id: "id-image", frame: 0, frames: 100 },
    { id: "com.moviemasher.theme.color", frame: 100, frames: 50, color: "blue"},
    { id: "com.moviemasher.theme.text", frame: 150, frames: 100, string: "Woot woot!" },
    { id: "com.moviemasher.theme.color", frame: 250, frames: 50, color: "green"},
    { id: "com.moviemasher.theme.text", frame: 300, frames: 100, string: "Love it!" },
    { id: "com.moviemasher.theme.color", frame: 400, frames: 50, color: "red"},
    { id: "com.moviemasher.theme.text", frame: 450, frames: 100, string: "Juicy!" },
    { id: "com.moviemasher.theme.color", frame: 550, frames: 50, color: "yellow"},
    { id: "com.moviemasher.theme.text", frame: 600, frames: 100, string: "Gorgeous!" },
    { id: "com.moviemasher.theme.color", frame: 700, frames: 50, color: "violet"},
    { id: "com.moviemasher.theme.text", frame: 750, frames: 1100, string: "Joy!" },
    { id: "com.moviemasher.theme.color", frame: 1850, frames: 1000, color: "orange"},
  ]
  const clips1 = clips.slice(0, 5).map(clip => ({
    ...clip, label: clip.string || clip.color,
  }))
  const clips2 = clips.map(clip => ({
    ...clip, label: clip.string || clip.color,
  }))
  const clips3 = clips.filter((clip, index) => index % 2).map(clip => ({
    ...clip, label: clip.string || clip.color,
  }))
  // const video = [{ clips: clips1 }, { clips: clips3 }, { clips: clips2 }]
  const video = [{ clips: [{ id: "id-video", frame: 0, frames: 30 }] }]
  return {
    id: 'mash-id',
    backcolor: '#00FF0066',
    video
  }
}
const urlParams = new URLSearchParams(window.location.search)
const server = urlParams.get('server')

const applicationOptions = {
  server,
  mash: Factory.mash.instance(testMashObject()),
  icons: RemixIcons, inputs: DefaultInputs,
  panels: {browser:{header: {right: RemixIcons.browserVideo}}},
}


const application = <ReactMovieMasher {...applicationOptions} />

render(<StrictMode>{application}</StrictMode>, document.getElementById('app'))
