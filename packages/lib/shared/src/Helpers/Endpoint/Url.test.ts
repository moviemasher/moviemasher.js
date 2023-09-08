import { describe, test } from 'node:test'
import assert from 'assert'
import { urlForEndpoint } from './EndpointFunctions.js'



describe('urlForEndpoint', () => {
  const tests = [
    ['http://localhost/'],
    ['http://localhost/file.ext', 'file.ext'],
    ['http://localhost/file.ext', '/file.ext'],
    ['http://localhost/file.ext', '/file.ext', 'prefix'],
    ['http://localhost/prefix/file.ext', 'file.ext', 'prefix'],
    ['http://localhost/prefix/file.ext', 'file.ext', '/prefix'],
    ['http://localhost/prefix/file.ext', 'file.ext', '/prefix/'],
    ['http://localhost/file.ext', '../file.ext', '/prefix/'],
    ['http://localhost/prefix/path/file.ext', 'file.ext', 'prefix/path'],
    ['http://localhost/prefix/path/file.ext', 'file.ext', '/prefix/path'],
    ['http://localhost/prefix/path/file.ext', 'file.ext', '/prefix/path/'],
    ['http://localhost/prefix/file.ext', '../file.ext', '/prefix/path/'],
    ['http://localhost/prefix/file.ext', '', '/prefix/file.ext'],

  ]
  tests.forEach(testArray => {
    const [expected, suffix, pathname = '', hostname = 'localhost', protocol = 'http:'] = testArray
    const endpoint = { pathname, hostname, protocol }
    test(`urlForEndpoint('${protocol} ${hostname} ${pathname}', '${suffix}')`, () => {
      assert.equal(urlForEndpoint(endpoint, suffix), expected)
    })
  })
}) 


  // describe('urlEndpoint', () => {
  //   test('returns http localhost endpoint', () => {
  //     const user = 'username'
  //     assert.deepStrictEqual(urlEndpoint(), { protocol: 'http:', hostname: 'localhost', pathname: '/' })

  //     const base = path.resolve('./')
  //     const url = 'file://' + path.join(base, 'images/standalone/public/assets', user)
  //     const pathname = `${base}/images/standalone/public/assets/${user}`
  //     RuntimeEnvironment.set(EnvironmentKeyUrlBase, url)
      
  //     assert.deepStrictEqual(urlEndpoint(), { protocol: 'file:', hostname: '', pathname })
  //  })
  // })

