import {Track, TrackArgs} from './Track.js'
import {TrackClass} from './TrackClass.js'

export const trackInstance = (object : TrackArgs) : Track => new TrackClass(object)

export const TrackFactory = { instance: trackInstance }
