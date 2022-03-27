import { Track, TrackArgs } from "./Track"
import { TrackClass } from "./TrackClass"

const trackInstance = (object : TrackArgs) : Track => new TrackClass(object)

/**
 * @category Factory
 */
const TrackFactory = { instance: trackInstance }

export { TrackFactory }
