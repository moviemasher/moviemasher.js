
import path from 'path'
import { 
  assertPopulatedString, AudioType, NewlineChar, ErrorName, errorThrow, 
  FontType, GraphFile, GraphFileType, ImageType, isLoadType, LoadType, 
  PopulatedString, VideoType, Runtime 
} from "@moviemasher/moviemasher.js"
import { BasenameCache } from '../Setup/Constants'
import { hashMd5 } from './Hash'
import { 
  EnvironmentKeyApiDirCache, EnvironmentKeyApiDirFilePrefix, 
  EnvironmentKeyApiDirValid 
} from '../Environment/ServerEnvironment'

const typeExtension = (type: LoadType): string => {
  switch(type){
    case FontType: return '.ttf'
    case ImageType: return '.png'
    case AudioType: return '.mp3'
    case VideoType: return '.mp4'
    default: return '.json'
  }
}

const graphFileTypeBasename = (type: GraphFileType, content: PopulatedString) => {
  if (type !== GraphFileType.SvgSequence) return `${BasenameCache}.${type}`
  const fileCount = content.split(NewlineChar).length
  const digits = String(fileCount).length
  return `%0${digits}.svg`
}

export const localPath = (username: string, graphFile: GraphFile): string => {
  const { type, file, content, resolved: key } = graphFile
  if (key) {
    // console.log(this.constructor.name, "key RESOLVED", type, file, key)
    return key
  }
  assertPopulatedString(file, 'file')

  const { environment } = Runtime
  const cacheDirectory = environment.get(EnvironmentKeyApiDirCache)
  const filePrefix = environment.get(EnvironmentKeyApiDirFilePrefix)
  const validDirectories = environment.get(EnvironmentKeyApiDirValid)

  const defaultDirectory = username

  if (!isLoadType(type)) {
    if (!type) console.trace("localPath NOT LOADTYPE", type, file, content)

    // file is clip.id, content contains text of file
    assertPopulatedString(content, 'content')
    
    const fileName = graphFileTypeBasename(type, content) 
    return path.resolve(cacheDirectory, file, fileName) 
  }


  // file is url, if absolute then use hashMd5 as directory name
  if (file.includes('://')) {
    // console.log(this.constructor.name, "key LOADTYPE ABSOLUTE", type, file, content)
    const extname = path.extname(file)
    const ext = extname || typeExtension(type)
    return path.resolve(
      cacheDirectory, hashMd5(file), `${BasenameCache}${ext}`
    )
  }
    // console.log(this.constructor.name, "key LOADTYPE NOT ABSOLUTE", type, file)
  const resolved = path.resolve(filePrefix, defaultDirectory, file)
  const directories = [defaultDirectory, ...validDirectories]
  const prefixes = [path.resolve(cacheDirectory), 
    ...directories.map(dir => path.resolve(filePrefix, dir))
  ]
  const valid = prefixes.some(prefix => resolved.startsWith(prefix))

  if (!valid) errorThrow(ErrorName.Url) 

  graphFile.resolved = resolved
  return resolved
}