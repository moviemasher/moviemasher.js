const Default = {
  buffer: 10,
  fps: 30,
  loop: true,
  volume: 0.75,
  precision: 3,
  autoplay: false,
  mash: {
    label: "Untitled Mash",
    quantize: 10,
    backcolor: "#00000000",
  },
  clip: {
    audio: { gain: 1.0, trim: 0 },
    video: { speed: 1.0 }
  },
  media: {

    frame: { duration: 2 },
    image: { duration: 2 },
    theme: { duration: 3 },
    transition: { duration: 1 },
    video: { pattern: '%.jpg', fps: 30, increment: 1, begin: 1  },
  },
}

export { Default }
