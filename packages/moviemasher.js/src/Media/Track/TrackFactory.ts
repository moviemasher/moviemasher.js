import { Track, TrackObject } from "./Track"
import { TrackClass } from "./TrackClass"

const trackInstance = (object : TrackObject) : Track => new TrackClass(object)

/**
 * @category Factory
 */
const TrackFactory = { instance: trackInstance }

export { TrackFactory }
