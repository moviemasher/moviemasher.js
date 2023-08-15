
import type { GraphFile, GraphFileType } from '@moviemasher/runtime-server'
import type { LoadType, PopulatedString, } from '@moviemasher/runtime-shared'

import { NewlineChar, Runtime, assertPopulatedString, isLoadType } from "@moviemasher/lib-shared"
import { GraphFileTypeSvgSequence } from '@moviemasher/runtime-server'
import { ErrorName, TypeAudio, TypeFont, TypeImage, TypeVideo, errorThrow, } from '@moviemasher/runtime-shared'
import path from 'path'
import { EnvironmentKeyApiDirCache, EnvironmentKeyApiDirFilePrefix, EnvironmentKeyApiDirValid } from '../Environment/ServerEnvironment.js'
import { BasenameCache } from '../Setup/Constants.js'
import { hashMd5 } from './Hash.js'


const typeExtension = (type: LoadType): string => {
  switch(type){
    case TypeFont: return '.ttf'
    case TypeImage: return '.png'
    case TypeAudio: return '.mp3'
    case TypeVideo: return '.mp4'
    default: return '.json'
  }
}

const graphFileTypeBasename = (type: GraphFileType, content: PopulatedString) => {
  if (type !== GraphFileTypeSvgSequence) return `${BasenameCache}.${type}`
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