import { Track, TrackArgs } from "./Track"
import { TrackClass } from "./TrackClass"

export const trackInstance = (object : TrackArgs) : Track => new TrackClass(object)

export const TrackFactory = { instance: trackInstance }
