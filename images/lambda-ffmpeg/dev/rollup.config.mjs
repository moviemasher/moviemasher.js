import { rollupConfigurations} from "../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherLambdaFfmpeg'
const libName = 'lambda-ffmpeg'
const formats = { esm: 'mjs' }
const configurations = rollupConfigurations({ name, libName, formats })
export default configurations


