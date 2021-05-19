import React, { useEffect, useRef, useState } from 'react';

import './MovieMasher.css';

import { TimeFactory, MasherFactory, Default } from "@moviemasher/moviemasher.js"

function MovieMasher() {
  const element = useRef()
  const [masher, setMasher] = useState()

  useEffect(() => {
    const masher = MasherFactory.create()
    masher.canvas = element.current
    console.log("MovieMasher.useEffect", masher.type, masher.constructor.name)
    setMasher(masher)
  }, [])
  const handleClick = () => {
    const promise = masher.add({ type: "theme", id: "com.moviemasher.theme.color", color: "#00FFFF" })
    console.log("clicked", promise, Default.mash.quantize)

  }
  return (
    <>
      <button onClick={handleClick}>Add!</button>
      <canvas ref={element} width="320" height="240"/>
      <div>{TimeFactory.createFromFrame().toString()}</div>
    </>
  );
}

export default MovieMasher;
