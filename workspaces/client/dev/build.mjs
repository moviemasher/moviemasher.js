import fs from 'fs'
import path from 'path'
import { rewritePackageFile } from "../../../dev/utils/rewritePackageFile.mjs"
import { rewriteRollupFile } from "../../../dev/utils/rewriteRollupFile.mjs"

const packagePath = path.resolve('package.json')
const rootDir = path.resolve('../../')
const packagesDir = path.resolve(rootDir, 'packages')
const outputDir = path.join(packagesDir, 'theme')

const svgDir = path.resolve('src/svg')
const svgFiles = fs.readdirSync(svgDir)
console.log(outputDir, svgFiles)

const build = () => {
  // package.json
  rewritePackageFile( { 
    destDir: packageDir, 
    replacements: [
      { 
        replace: packageName, search: buildPackageId, 
        keys: ['name', 'types', 'module', 'main']
      },
      { 
        replace: `Movie Masher ${buildType} Plugin for ${localeInDefault} ${languageInDefault}`,
        key: 'description'
      },
      {
        replace: { build: 'rollup -c dev/rollup.config.mjs' },
        key: 'scripts'
      },
    ], 
  })
}

build()