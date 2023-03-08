
// Object.defineProperty(exports, '__esModule', { value: true })

// const MovieMasher = require('../../../packages/moviemasher.js/')
// const { Endpoints } = MovieMasher
// console.log("Endpoints", Endpoints)
// import { Endpoints } from '../../../packages/moviemasher.js/types/moviemasher.js'

// const excludeEndpoints = (endpoints, exclude) => {
//   if (!exclude) return endpoints

//   const array = exclude.split(',')
//   return endpoints.filter(endpoint => !array.some(end => endpoint.includes(end)))
// }
// const includeEndpoints = (endpoints, include) => {
//   if (!include) return endpoints

//   const array = include.split(',')
//   return endpoints.filter(endpoint => array.some(end => endpoint.includes(end)))
// }
// const api = (options) => {
//   const { exclude, include } = options 
//   // console.log("exclude", exclude, "include", include)
//   const markdown = [['Endpoint', 'Request Interface', 'Response Interface']]//, 'Method'
//   markdown.push(markdown[0].map(_ => '--'))

//   const objectEndpoints = something => {
//     if (typeof something === 'string') return [something]
//     if (Array.isArray(something)) return something.flatMap(objectEndpoints)
//     return Object.values(something).flatMap(objectEndpoints)
//   }  
//   const allEndpoints = objectEndpoints(Endpoints)

//   const includedEndpoints = includeEndpoints(allEndpoints, include)
//   const endpoints = excludeEndpoints(includedEndpoints, exclude)
//   // console.log("endpoints", endpoints, include, exclude, allEndpoints, includedEndpoints)
//   markdown.push(...endpoints.map(endpoint => {
//     const bits = endpoint.split('/')

//     bits.shift()
//     const capped = bits.map(bit => bit.slice(0, 1).toUpperCase() + bit.slice(1))

//     // const methodBits = [capped[0], 'Server.', arrayLast(bits)]  
//     // if (bits.length === 3) methodBits.push(capped[1])

//     const serverName = capped.join('')
//     //, `[[${methodBits.join('')}]]`
//     return [endpoint, `[[${serverName}Request]]`, `[[${serverName}Response]]`] 
//   }))
//   return markdown.map(array => '| ' + array.join(' | ') + ' |')
// }

