import { rollupConfigurations} from "../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherTheme'
const libName = 'theme-default'
const extension = 'js'
const configurations = rollupConfigurations({ name, libName, extension })
console.log(configurations)
export default configurations


