
import path from 'path'
import { assertPopulatedString, Errors, GraphFile, GraphFileType, isLoadType, LoadType, PopulatedString } from "@moviemasher/moviemasher.js";
import { BasenameCache } from '../Setup/Constants';
import { hashMd5 } from './Hash';
import { Environment, environment } from './Environment';

const typeExtension = (type: LoadType): string => {
  switch(type){
    case LoadType.Font: return '.ttf'
    case LoadType.Image: return '.png'
    case LoadType.Audio: return '.mp3'
    case LoadType.Video: return '.mp4'
  }
}

const graphFileTypeBasename = (type: GraphFileType, content: PopulatedString) => {
  if (type !== GraphFileType.SvgSequence) return `${BasenameCache}.${type}`
  const fileCount = content.split("\n").length
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

  const cacheDirectory = environment(Environment.API_DIR_CACHE)
  const filePrefix = environment(Environment.API_DIR_FILE_PREFIX)
  const defaultDirectory = username
  const validDirectories = environment(Environment.API_DIR_VALID)

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

  if (!valid) throw Errors.invalid.url + resolved

  graphFile.resolved = resolved
  return resolved
}