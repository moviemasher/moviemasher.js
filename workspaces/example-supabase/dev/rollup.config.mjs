import { rollupConfigurations} from "../../../dev/utils/rollup-configurations.mjs"

const name = 'MovieMasherExampleSupabase'
const libName = 'example-supabase'
const formats = { iife: 'js' }
const configurations = rollupConfigurations(name, libName, formats)
export default configurations


