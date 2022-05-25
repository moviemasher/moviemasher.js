import { StringObject } from "../declarations"
import { ServerType } from "../Setup/Enums"


const EndpointsApi: StringObject = {
  servers: '',
  callbacks: '',
}

const EndpointsEncode: StringObject = {
  start: '',
  status: '',
  stop: '',
}

const EndpointsRendering: StringObject = { ...EndpointsEncode, upload: '' }

const EndpointsCrud: StringObject = {
  delete: '',
  get: '',
  put: '',
  retrieve: '',
}

const EndpointsData: Record<string, StringObject> = {
  cast: { ...EndpointsCrud, default: '' },
  mash: { ...EndpointsCrud, default: '' },
  stream: { ...EndpointsCrud },
  definition: { ...EndpointsCrud },
}

const EndpointsStreaming:StringObject = {
  ...EndpointsEncode,
  ...EndpointsCrud,
  preload: '',
  cut: '',
  webrtc: '',
  rtmp: '',
  remote: '',
  local: '',
}
const EndpointsFile: StringObject = {
  store: '',
}

export const Endpoints = {
  [ServerType.Api]: EndpointsApi,
  [ServerType.Data]: EndpointsData,
  [ServerType.File]: EndpointsFile,
  [ServerType.Rendering]: EndpointsRendering,
  [ServerType.Streaming]: EndpointsStreaming,
}

// populate Endpoints with key paths...
Object.entries(Endpoints).forEach(([serverType, server]) => {
  if (typeof server === 'object') Object.entries(server).forEach(([key1, value1]) => {
    if (typeof value1 === 'string') server[key1] = `/${serverType}/${key1}`
    else Object.entries(value1).forEach(([key2, value2]) => {
      if (!value2) value1[key2] = `/${serverType}/${key1}/${key2}`
    })
  })
})
