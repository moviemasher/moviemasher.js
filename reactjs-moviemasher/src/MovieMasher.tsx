import React, { useEffect, useState, useRef } from 'react';

import './MovieMasher.css';

import { MasherFactory, Events, Factory, Errors, effectFromId, ClipType, themeInstance  } from "@moviemasher/moviemasher.js"

const videoDefinitionObject = {
  id: "E20EF824-617A-4B0D-84BD-FE62A2467CA0",
  label: "Deprecated Video",
  url: "E20EF824-617A-4B0D-84BD-FE62A2467CA0/256x144x10/",
  video_rate: "10",
  pattern: "%.jpg",
  duration: "78.98",
  audio: "E20EF824-617A-4B0D-84BD-FE62A2467CA0/audio.mp3",
  type: ClipType.Video,
}

function MovieMasher() {
  const element = useRef <HTMLCanvasElement>(null)
  const [masher] = useState(MasherFactory.create())
  const [fps, setDuration] = useState(-1)
  const handleEvent = (event : Event) => {
    console.log("handleEvent", event)
    setDuration(masher.fps)
  }
  useEffect(() => {
    const { current } = element
    if (!current) throw Errors.internal

    const canvas = current
    canvas.addEventListener(Events.type, handleEvent)
    masher.canvas = canvas

    Factory.font.define({
      id: "com.moviemasher.font.default",
      source: "https://fonts.gstatic.com/s/balootammudu2/v4/1Ptzg8TIS_SAmkLguUdFP8UaJcKGZV0C5oCKNLY3JQ.woff2"
      // source: "BlackoutMidnight.ttf"
    })
  }, [])

  useEffect(() => {
    console.log("MovieMasher.useEffect", masher.fps)
  }, [masher.endTime])


  const handleClick = () => {
    // const effect = effectFromId("com.moviemasher.effect.emboss")
    const theme = themeInstance({ type: "theme", id: "com.moviemasher.theme.text", color: "#00FFFF" })
    // const image = Factory.image.instance({ id: "image", url: "logo.png"})
    // const video = Factory.video.definition(videoDefinitionObject).instance

    masher.addClip(theme)
    // masher.selectClip(theme, false)
    // masher.addEffect(effect)
    // masher.addClip(theme)
  }
  return (
    <>
     <p><button onClick={handleClick}>Add!</button></p>
     <div style={{ width: '320px', height: '240px', padding: '10px', border: '1px solid red' }}>
       <canvas ref={element} width="320" height="240"/>
     </div>


      <div>{fps}</div>
    </>
  );
}

export default MovieMasher
