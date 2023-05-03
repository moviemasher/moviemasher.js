import { describe, test } from 'node:test'
import assert from 'assert'
import path from 'path'

import { urlEndpoint, urlForEndpoint, Runtime, EnvironmentKeyUrlBase } from '@moviemasher/lib-core'

describe('Url', () => {
  
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


  describe('urlEndpoint', () => {
    test('returns http localhost endpoint', () => {
      const user = 'username'
      assert.deepStrictEqual(urlEndpoint(), { protocol: 'http:', hostname: 'localhost', pathname: '/' })

      const { environment } = Runtime
      // const environmentBase = environment.get(EnvironmentKeyUrlBase)
      const base = path.resolve('./')
      const url = 'file://' + path.join(base, 'images/standalone/public/media', user)
      const pathname = `${base}/images/standalone/public/media/${user}`
      environment.set(EnvironmentKeyUrlBase, url)
      
      assert.deepStrictEqual(urlEndpoint(), { protocol: 'file:', hostname: '', pathname })
   })
  })
})
