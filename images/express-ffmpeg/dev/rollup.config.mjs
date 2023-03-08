import { rollupConfigurations} from "../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherExpressFfmpeg'
const libName = 'express-ffmpeg'
const formats = { esm: 'mjs' }
const configurations = rollupConfigurations({ name, libName, formats })
export default configurations
