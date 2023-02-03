import { PathOrError, PotentialError } from "@moviemasher/moviemasher.js"
import { hashMd5 } from "@moviemasher/server-core"

const callback =async (params:type) => {
  
  const { token } = input as any
  const { env } = process
  const { SUPABASE_PROJECT_URL: url, SUPABASE_ANON_KEY: key } = env
  const initArgs = { body: initResponse }
  if (!(url && key)) throw 'no url or key' 
 
  
  const options = { global: { headers: { Authorization: `Bearer ${token}`}}}
  const supabase = createClient(url, key, options)

  const { error: beginError } = await supabase.functions.invoke(jobType, initArgs)
  if (beginError) {
    console.error(beginError)
    return { error: beginError }
  }

}

   const upload = async (localFile: string, destination: string, supabase: SupabaseClient, env: EnvScope): Promise<PotentialError> => {
    const result: PotentialError = {}
    const url = new URL(destination)
    const { pathname, protocol, hostname } = url
    const buffer = await fs.readFile(localFile)
    switch (protocol) {
      case 'supabase:': {
        const { MEDIA_BUCKET: bucket = hostname } = env
        if (!bucket) {
          result.error = { message: 'no bucket' }
          break
        }
        const joined = pathname.slice(1)
        const { error } = await supabase.storage.from(bucket).upload(joined, buffer)
        if (error) result.error = error
        break
      }
      default: {
        result.error = { message: `unsupported protocol: ${protocol}`}
        break
      }
    }
    return result
  }
  

const download = async (remote: MediaRequest, supabase: SupabaseClient, env: EnvScope): Promise<PathOrError> => {
  const local: PathOrError = { path: '' } 
  const { input } = remote
  if (!input) {
    local.error = { message: 'no input' }
    return local
  }
  const { url: inputUrl } = input
  if (!inputUrl) {
    local.error = { message: 'no input url' }
    return local
  }

  const extension = path.extname(inputUrl)
  const url = new URL(inputUrl)
  const { pathname, protocol, hostname } = url
  
  const hash = hashMd5(inputUrl)
  const filePath = `/tmp/${hash}${extension}`

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  local.path = filePath
  let blob: Blob | undefined 
  switch (protocol) {
    case 'supabase:': {
      const { MEDIA_BUCKET: bucket = hostname } = env
      if (!bucket) {
        local.error = { message: 'no bucket' }
        break
      }
      const joined = pathname.slice(1)
      const { data, error } = await supabase.storage.from(bucket).download(joined)
      if (error) local.error = error
      else blob = data
      break
    }
    default: {
      const response = await fetch(url)
      blob = await response.blob()
      break
    }
  }
  if (blob) {
    const arrayBuffer = await blob.arrayBuffer()
    const bos = Buffer.from(arrayBuffer)
    await fs.writeFile(filePath, bos)
  } else local.error ||= { message: 'no blob' }
  return local
}
