import type { StringRecord } from '@moviemasher/lib-core'
import { isObject, isString } from '@moviemasher/lib-core'

const EndpointsApi: StringRecord = {
  servers: '',
  callbacks: '',
}

const EndpointsEncode: StringRecord = {
  start: '',
  status: '',
}

const EndpointsRendering: StringRecord = { ...EndpointsEncode, upload: '' }

const EndpointsCrud: StringRecord = {
  delete: '',
  get: '',
  put: '',
  retrieve: '',
}

const EndpointsData: Record<string, StringRecord> = {
  cast: { ...EndpointsCrud, default: '' },
  mash: { ...EndpointsCrud, default: '' },
  stream: { ...EndpointsCrud },
  definition: { ...EndpointsCrud },
}

const EndpointsFile: StringRecord = {
  store: '',
}

export const Endpoints = {
  api: EndpointsApi,
  data: EndpointsData,
  file: EndpointsFile,
  rendering: EndpointsRendering,
}

// populate Endpoints with key paths...
Object.entries(Endpoints).forEach(([serverType, server]) => {
  if (isObject(server)) Object.entries(server).forEach(([key1, value1]) => {
    if (isString(value1)) server[key1] = `/${serverType}/${key1}`
    else Object.entries(value1).forEach(([key2, value2]) => {
      if (!value2) value1[key2] = `/${serverType}/${key1}/${key2}`
    })
  })
})
