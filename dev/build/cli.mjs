import fs from 'fs'
import path from 'path'
import { parseArgs } from "node:util"
import { assertString } from "../utils/assert.mjs"
import { packageJson } from "../utils/rewritePackageFile.mjs"


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
    default: ["moviemasher.js"],
  },
  dependency: {
    type: "string",
    short: "p",
    multiple: true,
    default: ["rollup"],
  },
  copy: {
    type: "string",
    short: "c",
    multiple: true,
    default: ['bugs', 'homepage', 'author', 'license', 'repository', 'version'],
  },
}
switch (command) {
  case 'package': {
    const { values } = parseArgs({
      args: process.argv.slice(3),
      options: {
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
      },
    })
    packageJson(values)
  }
  case 'packages': {
    const srcDir = path.resolve('dev/build')
    const { values } = parseArgs({
      args: process.argv.slice(3),
      options: {
       
        src: {
          type: "string",
          short: "c",
          multiple: true,
          default: fs.readdirSync(srcDir).map(fileName => path.join(srcDir, fileName)).filter(filePath => (
            fs.lstatSync(filePath)).isDirectory()
          ),
        },
        ...sharedOptions,
      },
    })

    values.src.forEach(buildPath => {
      const src = path.join(buildPath, 'src/package.json')
      const dest = path.join(buildPath, 'package.json')
      packageJson({ ...values, src, dest })
    })
  }
}


