import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import {
  Streamer, RemixIcons, Api, Process, ProcessStatus, ProcessActive, InspectorOutput,
  ViewerButton, Button, Webrtc, WebrtcContent, BroadcastButton, ProcessInactive,
  PlayerContent, DefaultInputs, ViewerContent,
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

const application = <Api>
  <Streamer inputs={DefaultInputs} className="editor streamer">
    <Process key="stream-process" id='encode'>
      <div className='panel player'>
        <div className='head'>
          <ViewerButton>
            <ProcessActive><Button startIcon={RemixIcons.playerPause}>Stop Streaming</Button></ProcessActive>
            <ProcessInactive><Button startIcon={RemixIcons.playerPlay}>Start Streaming</Button></ProcessInactive>
          </ViewerButton>
        </div>
        <ProcessActive><ViewerContent className="content"/></ProcessActive>
        <ProcessInactive><PlayerContent className="content"/></ProcessInactive>

        <div className='foot'>
          <ProcessStatus/>
        </div>
      </div>
    </Process>
    <Process key='webrtc-process' id='webrtc'>
      <Webrtc>
        <div className='panel browser'>
          <div className='head'>
            <BroadcastButton>
              <ProcessActive>{RemixIcons.playerPause}</ProcessActive>
              <ProcessInactive>{RemixIcons.playerPlay}</ProcessInactive>
            </BroadcastButton>
          </div>
          <WebrtcContent className='content'/>

          <div className='foot'>
            <ProcessStatus />
          </div>
        </div>
      </Webrtc>
    </Process>

    <Process key="output-process" id='encode'>
      <div className='panel inspector'>
        <div className='head'>
        </div>
        <div className='content'>
          <InspectorOutput><label /></InspectorOutput>
        </div>

        <div className='foot'>
          <ProcessStatus />
        </div>
      </div>
    </Process>
     <Process key="preview-process" id='encode'>
      <div className='panel timeline'>
        <div className='head'>
        </div>
        <ViewerContent className='content'></ViewerContent>

         <div className='foot'>
          <ProcessStatus />
        </div>
      </div>
    </Process>
  </Streamer>
</Api>

const mode = <StrictMode>{application}</StrictMode>
ReactDOM.render(mode, document.getElementById('app'))
