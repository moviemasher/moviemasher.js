export function MediaUtilized(klass) {
  Object.defineProperties(klass.prototype, {
    mediaUtilized: { get() { return this.mediaUtilizedFunction() } },
    mediaUtilizedFunction: { get() { return () => [this.media] } }
  })
  return klass
}
