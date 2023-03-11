
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { replace, replacePropertyObject } from './replace.mjs'
import { assignDependencies, fileRead, fileReadJson } from './file.mjs'
import { assertArray } from './assert.mjs';

const mainDir = path.resolve(fileURLToPath(import.meta.url), '../../../')
const mainPackagePath = path.join(mainDir, 'package.json')

let _mainPackageJson 
const mainPackageJson = () => _mainPackageJson ||= packageReadJson(mainPackagePath)

let _packageVersion = ''
const packageVersion = () => _packageVersion ||= mainPackageJson().version

const packageReadJson = (filePath) => {
  return fileReadJson({ src: filePath })
}

export const packageJson = (args) => {
  const { 
    name, description, 
    src, dest: argsDest, 
    replacements = [], workspace = [], copy = [], peer = [], dependency = [] 
  } = args
  assertArray(workspace, 'workspace')
  assertArray(dependency, 'dependency')
  assertArray(peer, 'peer')

  const dest = fileRead({ src })
  if (name) dest.name = `@moviemasher/${name}`
  if (description) dest.description = description

  if (copy.length) {
    const mainJson = mainPackageJson()
    copy.forEach(key => {
      const [_, srcObject] = replacePropertyObject(key, mainJson)
      const [property, destObject] = replacePropertyObject(key, dest)
      destObject[property] = srcObject[property]
    })
  }
  if (workspace.length) {
    dest.workspaces = workspace
    const directoryNames = workspace.map(dir => (
      path.join(mainDir, dir.endsWith('/*') ? dir.slice(0, -2) : dir)
    ))
    const directories = directoryNames.filter(directoryPath => (
      fs.existsSync(directoryPath)
    ))
    directories.forEach(directoryPath => {
      const projects = fs.readdirSync(directoryPath).filter(fileName => {
        const projectFilePath = path.join(directoryPath, fileName)
        if (!fs.existsSync(projectFilePath)) return false
        return fs.statSync(projectFilePath).isDirectory()
      })
      projects.forEach(project => {
        const projectDir = path.join(directoryPath, project)
        const packagePath = path.join(projectDir, 'package.json')
        assignDependencies(dest, packageReadJson(packagePath))
      })
    })
  }
  if (dependency.length) {
    dependency.forEach(depend => {
      replace({ dest, src: path.resolve('dev/dependencies', `${depend}.json`) })
    })
  }
  if (peer.length) {
    const version = packageVersion()
    const peers = Object.fromEntries(peer.map(name => (
      [`@moviemasher/${name}`, version]
    )))
    assignDependencies(dest, { peerDependencies: peers })
  }
  return replace({ src: dest, dest: argsDest, replacements })
}
