import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

import { JsonExtension, JsonRecord, TextExtension } from '@moviemasher/lib-core'


export const expandCommand = (command: string): string => { 
  return execSync(command).toString().trim()
}

export const expandFileOrScript = (command?: string): string => {
  if (!command) return ''

  if (command.endsWith(TextExtension)) return expandFile(command)

  if (command.startsWith('/')) return expandCommand(command) 
  return command
}

export const expandFile = (file?: string): string => {
  return file ? fs.readFileSync(file).toString() : ''
}

export const expandPath = (string: string): string => {
  return string.startsWith('.') ? path.resolve(string) : string
}

export const expandToJson = (config: string): JsonRecord => {
  if (!config) {
    return {}
  }

  if (config.endsWith(JsonExtension)) { // json file
    return expandToJson(expandFile(config))
  }

  switch (config[0]) {
    case '.':
    case '/': { // path to script, since it doesn't end in .json
      return expandToJson(expandFileOrScript(config))
    }
    case '{': { // json string
      return JSON.parse(config)
    }
  }
  // failed to expand to JSON
  return {}
}
