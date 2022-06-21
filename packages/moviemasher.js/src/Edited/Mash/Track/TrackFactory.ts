import { Track, TrackArgs } from "./Track"
import { TrackClass } from "./TrackClass"

export const trackInstance = (object : TrackArgs) : Track => new TrackClass(object)

/**
 * @category Factory
 */
export const TrackFactory = { instance: trackInstance }
