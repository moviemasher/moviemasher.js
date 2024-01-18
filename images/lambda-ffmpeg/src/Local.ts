
import type { AssetFile } from '@moviemasher/server-lib'
import type { DropType, PopulatedString, StringType, AssetFileType, TranscodingType } from '@moviemasher/shared-lib'

import { ENV_KEY, ENV, fileNameFromContent } from '@moviemasher/server-lib'
import {  assertPopulatedString } from '@moviemasher/shared-lib'
import { BITMAPS, NEWLINE, ASSET_TYPES, AUDIO, ERROR, FONT, IMAGE, STRING, VIDEO, errorThrow, } from '@moviemasher/shared-lib'
import path from 'path'

type RecordsType = 'records'
type RecordType = 'record'

type LoadType = DropType | RecordType | RecordsType | StringType

const RECORD: RecordType = 'record'
const RECORDS: RecordsType = 'records'


interface LoadTypes extends Array<LoadType>{}

const TypesLoad: LoadTypes = [...ASSET_TYPES, FONT, RECORD, RECORDS, STRING]
const isLoadType = (type?: any): type is LoadType => {
  return TypesLoad.includes(type)
}

const BasenameCache = 'cached'

const typeExtension = (type: LoadType): string => {
  switch(type){
    case FONT: return '.ttf'
    case IMAGE: return '.png'
    case AUDIO: return '.mp3'
    case VIDEO: return '.mp4'
    default: return '.json'
  }
}

const assetFileTypeBasename = (type: TranscodingType, content: PopulatedString) => {
  if (type !== BITMAPS) return `${BasenameCache}.${type}`
  const fileCount = content.split(NEWLINE).length
  const digits = String(fileCount).length
  return `%0${digits}.svg`
}

export const localPath = (username: string, assetFile: AssetFile): string => {
  const { type, file, content } = assetFile
  if (file) return file
  
  assertPopulatedString(file, 'file')

  const cacheDirectory = ENV.get(ENV_KEY.ApiDirCache)
  const filePrefix = ENV.get(ENV_KEY.ExampleRoot)
  const validDirectories = ENV.get(ENV_KEY.ApiDirValid)

  const defaultDirectory = username

  if (!isLoadType(type)) {
    if (!type) console.trace('localPath NOT LOADTYPE', type, file, content)

    // file is clip.id, content contains text of file
    assertPopulatedString(content)
    
    const fileName = assetFileTypeBasename(type, content) 
    return path.resolve(cacheDirectory, file, fileName) 
  }


  // file is url, if absolute then use fileNameFromContent as directory name
  if (file.includes('://')) {
    const extname = path.extname(file)
    const ext = extname || typeExtension(type)
    return path.resolve(
      cacheDirectory, fileNameFromContent(file), `${BasenameCache}${ext}`
    )
  }
  const resolvedPath = path.resolve(filePrefix, defaultDirectory, file)
  const directories = [defaultDirectory, ...validDirectories]
  const prefixes = [path.resolve(cacheDirectory), 
    ...directories.map(dir => path.resolve(filePrefix, dir))
  ]
  const valid = prefixes.some(prefix => resolvedPath.startsWith(prefix))

  if (!valid) errorThrow(ERROR.Url, 'localPath') 

  assetFile.file = resolvedPath
  return resolvedPath
}
