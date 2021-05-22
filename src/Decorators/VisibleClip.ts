import { visibleClip } from "../Clip/with/visibleClip"

export const VisibleClip = klass => {
  Object.defineProperties(klass.prototype, visibleClip)
})
