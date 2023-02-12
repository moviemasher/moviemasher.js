import { Endpoint } from "./Endpoint";
import { isNumeric, isPopulatedString } from "../../Utility/Is";
import { urlEndpoint, urlHasProtocol, urlIsBlob } from "../../Utility/Url";

/**
 * 
 * @param endpoint 
 * @returns absolute URL from potentially relative endpoint  
 */
export const endpointUrl = (endpoint: Endpoint): string => {
  const absolute = endpointAbsolute(endpoint)
  const { protocol, hostname, pathname, port, search  } = absolute
  const bits = [protocol]
  if (!urlIsBlob(protocol)) bits.push('//')
  bits.push(hostname)
  if (isNumeric(port)) bits.push(`:${port}`)
  if (pathname) bits.push(pathname)
  if (search) bits.push(search)
  return bits.join('')
}
export const endpointFromAbsolute = (urlString: string): Endpoint => {
  const url = new URL(urlString)
  // console.trace('endpointFromAbsolute', urlString, url)
  const { protocol, hostname, pathname, port, search } = url 
  const result: Endpoint = { protocol, hostname, pathname, search }
  if (isNumeric(port)) result.port = Number(port)
  return result
}
export const endpointFromUrl = (urlString: string): Endpoint => {
  if (urlHasProtocol(urlString)) return endpointFromAbsolute(urlString)
  
  const [pathname, search] = urlString.split('?')
  const result: Endpoint = { pathname }
  if (search) result.search = `?${search}`
  return result
}
export const endpointIsAbsolute = (endpoint: Endpoint): boolean => {
  const { hostname, protocol } = endpoint
  return urlIsBlob(protocol) || isPopulatedString(hostname)
}

/**
 * 
 * @param endpoint 
 * @returns endpoint if absolute, otherwise endpoint relative to base URL
 */
export const endpointAbsolute = (endpoint: Endpoint): Endpoint => {
  if (endpointIsAbsolute(endpoint)) return endpoint

  return urlEndpoint(endpoint)
}
