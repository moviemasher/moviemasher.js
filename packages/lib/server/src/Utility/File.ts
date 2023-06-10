import fs from 'fs'
import { errorThrow, isPopulatedString } from '@moviemasher/lib-shared'

export type FilePath = string

export const isFilePath = (value: any): value is FilePath => {
  return isPopulatedString(value) && fs.existsSync(value)
}

export function assertFilePath(value: any, name?: string): asserts value is FilePath {
  if (!isFilePath(value)) errorThrow(value, 'FilePath', name)
}

