const DragType = {
  CLIP: 'clip/x-moviemasher',
  MEDIA: 'media/x-moviemasher',
  EFFECT: 'effect/x-moviemasher',
}
const DragTypes = Object.values(DragType)

const ServerType = {
  STREAM: 'stream',
  RENDER: 'render',
  HOSTS: 'hosts',
  HLS: 'hls',
  WEBRTC: 'webrtc',
}
const ServerTypes = Object.values(ServerType)


export {
  DragType, DragTypes,
  ServerType, ServerTypes
}
