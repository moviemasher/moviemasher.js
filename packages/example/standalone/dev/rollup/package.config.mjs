import path from 'path'
import { rollupPackage } from "../../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherExampleStandalone'
const libName = 'example-standalone'

export default rollupPackage({ name, libName, src: path.resolve('src'), input: 'server.ts', output: 'private' })
