import path from 'path'
import { rollupPackage } from "../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherExpressFfmpeg'
const libName = 'express-ffmpeg'

export default rollupPackage({ name, libName, src: path.resolve('src') })
