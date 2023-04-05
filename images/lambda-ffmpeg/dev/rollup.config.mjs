import path from 'path'
import { rollupPackage} from "../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherLambdaFfmpeg'
const libName = 'lambda-ffmpeg'

export default rollupPackage({ name, libName, src: path.resolve('src') })


