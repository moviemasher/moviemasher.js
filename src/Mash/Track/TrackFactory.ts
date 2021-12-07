import { Track, TrackObject } from "./Track"
import { TrackClass } from "./TrackInstance"

const trackInstance = (object : TrackObject) : Track => {
  return new TrackClass(object)
}

const TrackFactory = {
  instance: trackInstance,
}

export { TrackFactory }
