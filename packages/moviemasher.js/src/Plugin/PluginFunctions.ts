import { errorThrow } from "../Helpers/Error/ErrorFunctions"
import { Plugin, PluginType } from "../Plugin/Plugin"
import { isObject, isPopulatedString } from "../Utility/Is"
import { Plugins } from "./Plugins"

export const isPlugin = (value: any): value is Plugin => {
  return isObject(value) && "type" in value && isPopulatedString(value.type)
}
export function assertPlugin(value: any, name?: string): asserts value is Plugin {
  if (!isPlugin(value)) errorThrow(value, 'Plugin', name)
}

export const pluginId = (id: string) => id.replace(/[^a-z]/g, '')

export const plugin = (pluginType: PluginType, id: string): Plugin => {
  const plugins = Plugins[pluginType]
  const safeId = pluginId(id)
  const plugin = plugins[safeId] 
  assertPlugin(plugin, safeId)
  
  return plugin
}

export const pluginPromise = (pluginType: PluginType, id: string): Promise<Plugin> => {
  const plugins = Plugins[pluginType]
  const safeId = pluginId(id)
  if (plugins[safeId]) return Promise.resolve(plugins[safeId])
  
  return import(`@moviemasher/${pluginType}-${safeId}`).then(() => {
    return plugin(pluginType, id)
  })
}