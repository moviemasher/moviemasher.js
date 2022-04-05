import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { ExtJson, JsonObject, ExtText } from '@moviemasher/moviemasher.js'

export const expandCommand = (command?: string): string => {
  if (!command) return ''

  if (command.endsWith(ExtText)) return expandFile(command)

  if (command.startsWith('/')) return execSync(command).toString()
  return command
}

export const expandFile = (file?: string): string => {
  return file ? fs.readFileSync(file).toString() : ''
}

export const expandToString = (string?: string): string => {
  if (!string) return ''

  switch (string[0]) {
    case '.': { // relative path
      return expandToString(path.resolve(string))
    }
    case '/': { // absolute path
      return expandToString(expandFile(string))
    }
  }
  // a command that returns a json string
  return expandToString(expandCommand(string))
}

export const expandPath = (string: string): string => {
  return string.startsWith('.') ? path.resolve(string) : string
}

export const expandToJson = (config: string): JsonObject => {
  if (!config) return {}

  if (config.endsWith(ExtJson)) return expandToJson(expandFile(config))

  switch (config[0]) {
    case '.':
    case '/': { // path to script, since it doesn't end in .json
      return expandToJson(expandCommand(expandPath(config)))
    }
    case '{': { // json string
      return JSON.parse(config)
    }
  }
  // failed to expand to JSON
  return {}
}
