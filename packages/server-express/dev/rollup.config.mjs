import { rollupConfigurations} from "../../../dev/utils/rollup-configurations.mjs"

const name = 'MovieMasherServer'
const libName = 'server-express'
const configurations = rollupConfigurations(name, libName, { esm: 'mjs', cjs: 'js' })
export default configurations


