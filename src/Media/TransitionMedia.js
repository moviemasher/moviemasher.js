import { MediaType } from "../Types";
import { duration } from "./with/duration";
import { inaudible } from "./with/inaudible";
import { modular } from "./with/modular";
import { propertiesTiming } from "./with/propertiesTiming";
import { sharedMedia } from "./with/sharedMedia";
import { urlsNone } from "./with/urlsNone";
import { visible } from "./with/visible";

function TransitionMedia(object) { this.object = object }

Object.defineProperties(TransitionMedia.prototype, {
  type: { value: MediaType.transition },
  ...sharedMedia,
  ...modular,
  ...inaudible,
  ...visible,
  ...propertiesTiming,
  ...duration,
  ...urlsNone,
})

export { TransitionMedia }

