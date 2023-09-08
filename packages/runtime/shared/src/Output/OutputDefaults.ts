
export const OutputEncodeDefaults = {
  audio:  {
    options: {},
    audioBitrate: 160,
    audioCodec: 'libmp3lame',
    audioChannels: 2,
    audioRate: 44100,
    extension: 'mp3',
  }, 
  font: {
    options: {},
    extension: 'woff2',
  },
  sequence: {
    options: {},
    format: 'image2',
    width: 320,
    height: 240,
    videoRate: 10,
    extension: 'jpg',
  },
  waveform: {
    options: {},
    width: 320,
    height: 240,
    forecolor: '#000000',
    backcolor: '#00000000',
    audioBitrate: 160,
    audioCodec: 'aac',
    audioChannels: 2,
    audioRate: 44100,
    extension: 'png',
  },
  image: {
    options: {},
    width: 320,
    height: 240,
    extension: 'jpg',
  },
  video: {
    options: {
      g: 60,
      level: 41,
      movflags: 'faststart'
    },
    width: 1920,
    height: 1080,
    videoRate: 30,
    videoBitrate: 2000,
    audioBitrate: 160,
    audioCodec: 'aac',
    videoCodec: 'libx264',
    audioChannels: 2,
    audioRate: 44100,
    g: 0,
    format: 'mp4',
  },
}

export const OutputAlphaDefaults = {
  image: {
    options: {},
    width: 320,
    height: 240,
    extension: 'png',
    format: 'image2',
    offset: 0
  },
  sequence: {
    options: {},
    format: 'image2',
    width: 320,
    height: 240,
    videoRate: 10,
    extension: 'png',
  },
  video: {
    options: {
      g: 60,
      level: 41,
      movflags: 'faststart'
    },
    width: 1920,
    height: 1080,
    videoRate: 30,
    videoBitrate: 2000,
    audioBitrate: 160,
    audioCodec: 'aac',
    videoCodec: 'libx264',
    audioChannels: 2,
    audioRate: 44100,
    g: 0,
    format: 'mp4',
    extension: 'mp4',
  },
}
