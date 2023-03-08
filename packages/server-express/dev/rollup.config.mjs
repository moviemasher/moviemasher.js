import { rollupConfigurations} from "../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherServer'
const libName = 'server-express'
const formats = { esm: 'mjs', cjs: 'js' }
const configurations = rollupConfigurations({ name, libName, formats })
export default configurations


