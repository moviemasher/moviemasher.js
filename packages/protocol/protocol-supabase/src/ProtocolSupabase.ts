import {
  assertEndpoint, assertPopulatedString, AudioType, endpointFromUrl, 
  EnvironmentKey, EnvironmentKeyPrefix, errorCaught, ErrorName, errorPromise, 
  FontType, ImageType, JsonRecord, JsonRecords, LoadType, NumberType, Protocol, 
  ProtocolPlugin, ProtocolType, JsonRecordDataOrError, 
  JsonRecordsDataOrError, RecordsType, RecordType, Request, requestClientMediaPromise, 
  Runtime, VideoType
} from "@moviemasher/moviemasher.js"
import { createClient, SupabaseClient } from "@supabase/supabase-js"


export class ProtocolSupabase implements ProtocolPlugin {
  [index: string]: unknown

  private _client?: SupabaseClient
  get client(): SupabaseClient { return this._client ||= this.clientInitialize }
  set client(value: SupabaseClient) { this._client = value }
  
  private get clientInitialize() {
    const { environment } = Runtime
    const projectUrl = environment.get(EnvironmentKeySupabaseProjectUrl) 
    const anonKey = environment.get(EnvironmentKeySupabaseAnonKey) 
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

        const { environment } = Runtime

        const bucket = environment.get(EnvironmentKeySupabaseBucket) || hostname || 'media'

        const path = pathname.slice(1) // required??
        const expires = environment.get(EnvironmentKeySupabaseExpires, NumberType) || 60
        return client.storage.from(bucket).createSignedUrl(path, expires).then(response => {
          if (response.error) return errorCaught(response.error)
          
          const { data } = response
          const { signedUrl } = data
          const signed = { init, endpoint: endpointFromUrl(signedUrl) }
          return requestClientMediaPromise(signed, type)
        })
      }
      case RecordType: return this.recordPromise(request)
      case RecordsType: return this.recordsPromise(request)
      // default: return requestRecordPromise(request)
    }
    return errorPromise(ErrorName.Type)
  }

  private async recordPromise(request: Request): Promise<JsonRecordDataOrError> {
    const { environment } = Runtime
    const table = environment.get(EnvironmentKeySupabaseTable) || 'media'
    const { client } = this
    const { endpoint, init } = request
  
    const response = await client.from(table).select()
    console.log('response', response)
    if (response.error) return (errorCaught(response.error))
  
    const { data: responseData } = response
    const data = responseData[0] as JsonRecord
    return ({ data })
  }

  private async recordsPromise(request: Request): Promise<JsonRecordsDataOrError> {
    const { environment } = Runtime
    const table = environment.get(EnvironmentKeySupabaseTable) || 'media'
    const { client } = this
    const { endpoint, init } = request
  
    const response = await client.from(table).select()
    console.log('response', response)
    if (response.error) return (errorCaught(response.error))
  
    const { data: responseData } = response
    const data = responseData as JsonRecords
    return ({ data })
  }
  type = ProtocolType
  protocol = SupabaseProtocol 
}

export const EnvironmentKeySupabaseProjectUrl: EnvironmentKey = `${EnvironmentKeyPrefix}SUPABASE_PROJECT_URL`
export const EnvironmentKeySupabaseBucket: EnvironmentKey = `${EnvironmentKeyPrefix}SUPABASE_BUCKET`
export const EnvironmentKeySupabaseTable: EnvironmentKey = `${EnvironmentKeyPrefix}SUPABASE_TABLE`
export const EnvironmentKeySupabaseAnonKey: EnvironmentKey = `${EnvironmentKeyPrefix}SUPABASE_ANON_KEY`
export const EnvironmentKeySupabaseExpires: EnvironmentKey = `${EnvironmentKeyPrefix}SUPABASE_EXPIRES`


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
// const download = async (remote: MediaRequest, env: EnvScope): Promise<StringDataOrError> => {
//   const local: StringDataOrError = { path: '' } 
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


Runtime.plugins[ProtocolType][SupabaseProtocol] ||= new ProtocolSupabase()
