import fs from 'fs'
import path from 'path'

const packagePath = path.resolve('./dev/package.json')
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
const { dependencies } = packageJson

const packagesDir = path.resolve('./packages/@moviemasher')
const imagesDir = path.resolve('./images/')

const packageNames = fs.readdirSync(packagesDir)
const imageNames = fs.readdirSync(imagesDir)


const paths = [
  ...packageNames.map(name => path.join(packagesDir, name, 'package.json')),
  ...imageNames.map(name => path.join(imagesDir, name, 'package.json')),
  path.resolve('./package.json')
]

const replace = (object) => {
  if (!object) return

  const keys = Object.keys(object)
  keys.forEach(key => { 
    const { [key]: version } = dependencies
    if (!version) throw new Error(`missing version for ${key}`)

    object[key] = version 
  })
}

paths.forEach(packagePath => {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  const { dependencies, devDependencies, peerDependencies } = packageJson
  replace(dependencies)
  replace(devDependencies)
  replace(peerDependencies)
  const json = JSON.stringify(packageJson, null, 2)
  // console.log('-'.repeat(80))
  // console.log(packagePath) 
  // console.log(json)
  fs.writeFileSync(packagePath, json)
})
