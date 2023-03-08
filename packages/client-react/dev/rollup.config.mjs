import { rollupConfigurations} from "../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherClient'
const libName = 'client-react'
const configurations = rollupConfigurations({ name, libName })
export default configurations


