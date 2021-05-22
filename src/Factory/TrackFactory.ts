import { Errors } from "../Setup"
import { Is } from "../Utilities"
import { Track } from "../Track"

const TrackFactory = {
  create: (object = {}, mash = {}) => {
    if (!Is.object(object)) throw Errors.object
    if (object instanceof Track) return object

    return new Track(object, mash)
  }
}

export { TrackFactory }
