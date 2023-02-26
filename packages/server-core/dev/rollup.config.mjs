import { rollupConfigurations} from "../../../dev/utils/rollup-configurations.mjs"

const name = 'MovieMasherServerCore'
const libName = 'server-core'
const configurations = rollupConfigurations(name, libName, { esm: 'mjs', cjs: 'js' })
export default configurations


