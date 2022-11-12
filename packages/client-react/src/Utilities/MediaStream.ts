
export const mediaStreamPromise = (audioDeviceId: string, videoDeviceId: string) => {
  const constraints: MediaStreamConstraints = {
    audio: audioDeviceId ? { deviceId: audioDeviceId } : false,
    video: videoDeviceId ? { deviceId: videoDeviceId } : false
  }
  const { mediaDevices } = globalThis.window.navigator
  console.log("mediaStreamPromise", constraints)
  return mediaDevices.getUserMedia(constraints)
}