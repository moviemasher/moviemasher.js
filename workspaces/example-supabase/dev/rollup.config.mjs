import { rollupConfigurations} from "../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherExampleSupabase'
const libName = 'example-supabase'
const formats = { iife: 'js' }
const configurations = rollupConfigurations({ name, libName, formats })
export default configurations


