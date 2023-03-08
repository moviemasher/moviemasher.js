import { rollupConfigurations} from "../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherServerCore'
const libName = 'server-core'
const formats = { esm: 'mjs', cjs: 'js' }
const configurations = rollupConfigurations({ name, libName, formats })
export default configurations


