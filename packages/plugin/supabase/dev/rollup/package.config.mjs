import path from 'path'
import { rollupPackage} from "../../../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherProtocolSupabase'
const libName = 'protocol-supabase'

export default rollupPackage({ name, libName, src: path.resolve('src') })


