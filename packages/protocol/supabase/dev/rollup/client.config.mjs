import path from 'path'
import { rollupClient } from "../../../../../dev/utils/rollupConfigurations.mjs"

const name = 'MovieMasherProtocolSupabase'
const libName = 'protocol-supabase'

export default rollupClient({ name, libName, src: path.resolve('src') })


