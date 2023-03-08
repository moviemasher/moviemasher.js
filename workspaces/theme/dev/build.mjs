import fs from 'fs'
import path from 'path'

const packagePath = path.resolve('package.json')
const rootDir = path.resolve('../../')
const packagesDir = path.resolve(rootDir, 'packages')
const outputDir = path.join(packagesDir, 'theme')

const svgDir = path.resolve('src/svg')
const svgFiles = fs.readdirSync(svgDir)
console.log(outputDir, svgFiles)