import { sharedTransform } from "./with/sharedTransform"

class Transform {
  constructor(object) {
    this.object = object
    this.media.initializeInstance(this, object)
  }
}

Object.defineProperties(Transform.prototype, {
  ...sharedTransform,
})

export { Transform }