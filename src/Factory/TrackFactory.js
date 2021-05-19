import { Factory } from "./Factory"
import { Errors } from "../Setup"
import { Is } from "../Utilities"
import { Track } from "../Track"

class TrackFactoryClass extends Factory {
  create(object, mash) {
    if (!Is.object(object)) throw(Errors.object)
    if (object instanceof Track) return object

    //if (!Is.instanceOf(mash, Mash)) throw(Errors.mash)

    return new Track(object, mash)
  }
}

const TrackFactory = new TrackFactoryClass
export { TrackFactory }
