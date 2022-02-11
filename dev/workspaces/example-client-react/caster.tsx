import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import {
  Caster, DefaultIcons, Api, Process, ProcessStatus, ProcessActive,
  StreamerControl, Button, Webrtc, WebrtcContent, WebrtcButton, ProcessInactive,
  PlayerContent, DataTypeInputs, StreamerContent, Streamer, StreamerPreloadControl, StreamerUpdateControl, Layers,
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
  label: "VideoStream", id: "id-video-stream",
  duration: 10,
  url: 'https://68751d6f4c50.us-east-1.playback.live-video.net/api/video/v1/us-east-1.216119970089.channel.mrSPHVtl3IFY.m3u8',
})

Factory.font.install({
  label: "BlackoutTwoAM", id: "com.moviemasher.font.default",
  source: "assets/BlackoutMidnight.ttf",
})

const application = <Api>
  <Caster className="editor caster">
    <Layers className="panel layers">
      <div className='head'></div>
      <div className='content'></div>
      <div className='foot'></div>
    </Layers>
    <div className="panel switcher">
      <div className='head'></div>
      <PlayerContent className="content"/>
      <div className='foot'></div>
    </div>
    <div className="panel layouts">
      <div className='head'></div>
      <div className='content'></div>
      <div className='foot'></div>
    </div>
    <Process key="stream-process" id='streaming'>
      <Streamer className='panel viewer'>
        <div className='head'>
          <StreamerControl>
            <ProcessActive><Button startIcon={DefaultIcons.playerPause}>Stop Streaming</Button></ProcessActive>
            <ProcessInactive><Button startIcon={DefaultIcons.playerPlay}>Start Streaming</Button></ProcessInactive>
          </StreamerControl>
          <StreamerPreloadControl>
            <Button>Preload</Button>
          </StreamerPreloadControl>
          <StreamerUpdateControl>
            <Button>Update</Button>
          </StreamerUpdateControl>
        </div>
        <StreamerContent className="content"/>
        <div className='foot'>
          <ProcessStatus/>
        </div>
      </Streamer>
    </Process>
    <Process key="webrtc-process" id='streaming'>
      <Webrtc className='panel webrtc'>
        <div className='head'>
          <WebrtcButton>
            <ProcessActive><Button startIcon={DefaultIcons.playerPause}>Stop Broadcasting</Button></ProcessActive>
            <ProcessInactive><Button startIcon={DefaultIcons.playerPlay}>Start Broadcasting</Button></ProcessInactive>
          </WebrtcButton>
        </div>
        <WebrtcContent className="content"/>
        <div className='foot'>
          <ProcessStatus/>
        </div>
      </Webrtc>
    </Process>
  </Caster>
</Api>

const mode = <StrictMode>{application}</StrictMode>
ReactDOM.render(mode, document.getElementById('app'))
