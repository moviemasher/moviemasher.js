import fs from 'fs'
import path from 'path'
import { parseArgs } from "node:util"
import { assertString } from "../utils/assert.mjs"
import { packageJson, packagePath } from "../utils/rewritePackageFile.mjs"
import { monoDir } from "../utils/file.mjs"
// import { frameworks } from "../utils/frameworks.mjs"

const args = (options) => {
  const keys = Object.keys(options)
  const index = process.argv.findIndex(arg => keys.includes(arg))
  return index > -1 ? process.argv.slice(index) : []
}

const command = process.argv[2]
assertString(command, 'command')
const sharedOptions = {
  name: {
    type: "string",
    short: "i",
    default: "",
  },
  description: {
    type: "string",
    short: "i",
    default: "",
  },
  workspace: {
    type: "string",
    short: "w",
    multiple: true,
    default: [],
  },
  peer: {
    type: "string",
    short: "p",
    multiple: true,
    default: [],
  },
  dependency: {
    type: "string",
    short: "p",
    multiple: true,
    default: [],
  },
  copy: {
    type: "string",
    short: "c",
    multiple: true,
    default: ['bugs', 'homepage', 'author', 'license', 'repository', 'version'],
  },
}
switch (command) {
  case 'directory': {
    console.log(monoDir())
    break
  }
  case 'package': {
    const options = {
      src: {
        type: "string",
        short: "i",
        default: "./package.json",
      },
      dest: {
        type: "string",
        short: "o",
        default: "./package.json",
      },
      ...sharedOptions,
    }
    const { values } = parseArgs({
      args: args(options),
      options,
    })
    packageJson(values)
    break
  }
  case 'packages': {
    const srcDir = path.resolve('images/')
    const options = {
      src: {
        type: "string",
        short: "c",
        multiple: true,
        default: fs.readdirSync(srcDir)
          .map(fileName => path.join(srcDir, fileName))
          .filter(filePath => (
          fs.lstatSync(filePath)).isDirectory() 
            && fs.existsSync(path.join(filePath, 'package.template.json'))
        ),
      },
      ...sharedOptions,
    }
    const { values } = parseArgs({
      args: args(options),
      options,
    })

    values.src.forEach(buildPath => {

      const src = path.join(buildPath, 'package.template.json')
      const dest = path.join(buildPath, 'package.json')
      packageJson({ ...values, src, dest })
      console.log(`wrote ${packagePath(dest)}`)
    })
    break
  }

  
  // case 'frameworks': {  
  //   const options = {
  //     src: {
  //       type: 'string',
  //       short: 's',
  //       default: 'dest',
  //     },
  //     dest: {
  //       type: 'string',
  //       short: 'd',
  //       default: 'stdout',
  //     }
  //   }
  //   const { values } = parseArgs({
  //     args: args(options),
  //     options
  //   })
  //   frameworks(values)
  //   break
  // }
}


