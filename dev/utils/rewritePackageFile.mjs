
import fs from 'fs'
import path from 'path'

import { replace, replacePropertyObject } from './replace.mjs'
import { assignDependencies, fileRead, fileReadJson, monoDir } from './file.mjs'
import { assertArray, isString } from './assert.mjs';

const mainDir = monoDir()
const mainPackagePath = path.join(mainDir, 'package.json')

let _mainPackageJson 
const mainPackageJson = () => _mainPackageJson ||= packageReadJson(mainPackagePath)

let _packageVersion = ''
const packageVersion = () => _packageVersion ||= mainPackageJson().version

const packageReadJson = (filePath) => {
  return fileReadJson({ src: filePath })
}

export const packagePath = filePath => filePath.slice(mainDir.length + 1)

export const packageJson = (args) => {
  const { 
    name, description, 
    src, dest: argsDest, 
    replacements = [], workspace: argsWorkspace = [], copy = [], peer = [], dependency = [] 
  } = args

  assertArray(argsWorkspace, 'argsWorkspace')
  const workspace = [...argsWorkspace]
  assertArray(dependency, 'dependency')
  assertArray(peer, 'peer')

  const dest = fileRead({ src })  
  const mainJson = mainPackageJson()
  const { workspaces: mainWorkspaces = []} = mainJson 
  if (copy.length) {
    copy.forEach(key => {
      // console.debug(`copying ${key} from main package.json`)
      const [_, srcObject] = replacePropertyObject(key, mainJson)
      const [property, destObject] = replacePropertyObject(key, dest)
      destObject[property] = srcObject[property]
    })
  }
  const { workspaces } = dest
  if (workspaces?.length) {
    // console.debug(`adding workspaces ${workspaces.join(', ')} to ${workspace.join(', ')}`)
    workspace.push(...workspaces)
  }
  if (name) dest.name = `@moviemasher/${name}`
  if (description) dest.description = description

  if (workspace.length) {
    const unique = [...new Set(workspace)]
   
    dest.workspaces = unique.filter(dir => !mainWorkspaces.includes(dir))
    const directoryNames = unique.map(dir => (
      path.join(mainDir, dir.endsWith('/*') ? dir.slice(0, -2) : dir)
    ))
    const directories = directoryNames.filter(directoryPath => (
      fs.existsSync(directoryPath) && fs.statSync(directoryPath).isDirectory()
    ))
    directories.forEach(directoryPath => {
      const projects = fs.readdirSync(directoryPath).filter(fileName => {
        const projectFilePath = path.join(directoryPath, fileName)
        if (!fs.existsSync(projectFilePath)) return false
        
        return fs.statSync(projectFilePath).isDirectory() 
          && fs.existsSync(path.join(projectFilePath, 'package.json'))  
      })
      projects.forEach(project => {
        const projectDir = path.join(directoryPath, project)
        const packagePath = path.join(projectDir, 'package.json')
        assignDependencies(dest, packageReadJson(packagePath))
      })
    })
  }

  if (peer.length) {
    const version = packageVersion()
    const peers = Object.fromEntries(peer.map(name => (
      [`@moviemasher/${name}`, version]
    )))
    assignDependencies(dest, { peerDependencies: peers })
  }

  replace({ dest, src: dest, replacements })
  expandDependencies(dest, dependency)


  // console.debug(`rewriting package.json from ${src} to ${argsDest}`, dest)
  return replace({ src: dest, dest: argsDest })
}

const expandDependencies = (dest, optionDependency = []) => {
  const dependency = [...optionDependency]
  // console.debug('expanding dependencies', dependency, dest)
  const fields = ['dependencies', 'devDependencies', 'peerDependencies']
  fields.forEach(key => {
    const dependencies = dest[key]
    if (dependencies) {
      // console.debug('checking', key)
      const keys = Object.entries(dependencies).map(([key, value]) => (
        value === 'dependencies' ? key : ''
      )).filter(isString)
      keys.forEach(depend => delete dependencies[depend])
      dependency.push(...keys)
    }
  })
  if (dependency.length) {
    const uniqueDependencies = [...new Set(dependency)]
    uniqueDependencies.forEach(depend => {
      replace({ dest, src: path.resolve('dev/dependencies', `${depend}.json`) })
    })
    expandDependencies(dest)
  }
}