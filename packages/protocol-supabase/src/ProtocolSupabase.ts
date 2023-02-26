
import { 
  
  Request, LoadType, Plugins, 
  ImageType, AudioType, VideoType, FontType, requestMediaPromise, 
  assertPopulatedString, endpointFromUrl, 
  errorCaught, ProtocolType, assertEndpoint, RecordType, JsonRecord, RecordData, errorPromise, ErrorName, ProtocolPlugin, Protocol, RecordDataOrError, JsonRecords, RecordsData, RecordsType, RecordsDataOrError
} from "@moviemasher/moviemasher.js"
import { config, Config } from "@moviemasher/client-core"

import { createClient, SupabaseClient } from "@supabase/supabase-js"


export const SupabaseProtocol: Protocol= 'supabase'
// export type EnvScope = Record<string, string | undefined>


// const callback = async (params:type) => {
  
//   const { token } = input as any
//   const { env } = process
//   const { SUPABASE_PROJECT_URL: url, SUPABASE_ANON_KEY: key } = env
//   const initArgs = { body: initResponse }
//   if (!(url && key)) throw 'no url or key' 
 
  
//   const options = { global: { headers: { Authorization: `Bearer ${token}`}}}
//   const supabase = createClient(url, key, options)

//   const { error: beginError } = await supabase.functions.invoke(jobType, initArgs)
//   if (beginError) {
//     console.error(beginError)
//     return { error: beginError }
//   }

// }

// const upload = async (localFile: string, destination: string, supabase: SupabaseClient, env: EnvScope): Promise<PotentialError> => {
//   const result: PotentialError = {}
//   const url = new URL(destination)
//   const { pathname, protocol, hostname } = url
//   const buffer = await fs.readFile(localFile)
//   switch (protocol) {
//     case 'supabase:': {
//       const { MEDIA_BUCKET: bucket = hostname } = env
//       if (!bucket) {
//         result.error = { message: 'no bucket' }
//         break
//       }
//       const joined = pathname.slice(1)
//       const { error } = await supabase.storage.from(bucket).upload(joined, buffer)
//       if (error) result.error = error
//       break
//     }
//     default: {
//       result.error = { message: `unsupported protocol: ${protocol}`}
//       break
//     }
//   }
//   return result
// }

// const get = async () => {
//   return supabase.from('media').select('*, probing (*), encoding (*)').order('created_at', { ascending: false }).then(({data, error}) => {
//     if (error) console.error(error)
//     else if (data) setMedia(old => {
//       const combined = [...data, ...old]
//       const names: Record<string, boolean> = {}
//       setInitialized(true)
//       return combined.filter(object => {
//         if (names[object.name]) return false

//         return names[object.name] = true
//       })
//     })
//   })
// }
// const download = async (remote: MediaRequest, env: EnvScope): Promise<PathDataOrError> => {
//   const local: PathDataOrError = { path: '' } 
//   const { input } = remote
//   if (!input) {
//     local.error = { message: 'no input' }
//     return local
//   }
//   const { url: inputUrl } = input
//   if (!inputUrl) {
//     local.error = { message: 'no input url' }
//     return local
//   }

//   const extension = path.extname(inputUrl)
//   const url = new URL(inputUrl)
//   const { pathname, protocol, hostname } = url
  
//   const hash = hashMd5(inputUrl)
//   const filePath = `/tmp/${hash}${extension}`

//   await fs.mkdir(path.dirname(filePath), { recursive: true })
//   local.path = filePath
//   let blob: Blob | undefined 
//   switch (protocol) {
//     case 'supabase:': {
//       const { MEDIA_BUCKET: bucket = hostname } = env
//       if (!bucket) {
//         local.error = { message: 'no bucket' }
//         break
//       }
//       const joined = pathname.slice(1)
//       const { data, error } = await supabase.storage.from(bucket).download(joined)
//       if (error) local.error = error
//       else blob = data
//       break
//     }
//     default: {
//       const response = await fetch(url)
//       blob = await response.blob()
//       break
//     }
//   }
//   if (blob) {
//     const arrayBuffer = await blob.arrayBuffer()
//     const bos = Buffer.from(arrayBuffer)
//     await fs.writeFile(filePath, bos)
//   } else local.error ||= { message: 'no blob' }
//   return local
// }


export class ProtocolSupabase implements ProtocolPlugin {
  [index: string]: unknown

  private _client?: SupabaseClient
  get client() { return this._client ||= this.clientInitialize }
  private get clientInitialize() {
    const projectUrl = config(Config.SUPABASE_PROJECT_URL)
    const anonKey = config(Config.SUPABASE_ANON_KEY)
    assertPopulatedString(projectUrl)
    assertPopulatedString(anonKey)
    const supabase = createClient(projectUrl, anonKey)
    return supabase
  }

  promise(request: Request, type?: LoadType) {
    switch (type) {
      case ImageType: 
      case AudioType: 
      case VideoType: 
      case FontType: {
        const { endpoint, init } = request
        assertEndpoint(endpoint)

        const { hostname, pathname } = endpoint
        assertPopulatedString(pathname)
        const { client } = this

        const bucket = config(Config.SUPABASE_BUCKET) || hostname
        assertPopulatedString(bucket)
        const path = pathname.slice(1) // required??
        const expires = Number(config(Config.SUPABASE_EXPIRES) || 60)
        return client.storage.from(bucket).createSignedUrl(path, expires).then(response => {
          if (response.error) return errorCaught(response.error)
          
          const { data } = response
          const { signedUrl } = data
          const signed = { init, endpoint: endpointFromUrl(signedUrl) }
          return requestMediaPromise(signed, type)
        })
      }
      case RecordType: return this.recordPromise(request)
      case RecordsType: return this.recordsPromise(request)
      // default: return requestRecordPromise(request)
    }
    return errorPromise(ErrorName.Type)
  }

  private async recordPromise(request: Request): Promise<RecordDataOrError> {
    const table = config(Config.SUPABASE_TABLE)
    assertPopulatedString(table)
    const { client } = this
    const { endpoint, init } = request
  
    const response = await client.from(table).select()
    console.log('response', response)
    if (response.error) return (errorCaught(response.error))
  
    const { data: responseData } = response
    const data = responseData[0] as JsonRecord
    const result: RecordData = { data }
    return (result)
  }

  private async recordsPromise(request: Request): Promise<RecordsDataOrError> {
    const table = config(Config.SUPABASE_TABLE)
    assertPopulatedString(table)
    const { client } = this
    const { endpoint, init } = request
  
    const response = await client.from(table).select()
    console.log('response', response)
    if (response.error) return (errorCaught(response.error))
  
    const { data: responseData } = response
    const data = responseData as JsonRecords
    const result: RecordsData = { data }
    return (result)
  }

  type = SupabaseProtocol 
}

Plugins[ProtocolType][SupabaseProtocol] = new ProtocolSupabase
