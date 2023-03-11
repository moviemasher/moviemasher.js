import { rollupConfigurations} from "../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherClient'
const libName = 'client-orig'
const configurations = rollupConfigurations({ name, libName })
export default configurations


