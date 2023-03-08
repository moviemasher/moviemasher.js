import { describe, test } from 'node:test'
import assert from 'assert'
import path from 'path'

import { urlEndpoint, urlForEndpoint, Runtime, EnvironmentKeyUrlBase } from "@moviemasher/moviemasher.js"

describe('Url', () => {
  
  describe("urlForEndpoint", () => {
    const tests = [
      ["http://localhost/"],
      ["http://localhost/file.ext", "file.ext"],
      ["http://localhost/file.ext", "/file.ext"],
      ["http://localhost/file.ext", "/file.ext", "prefix"],
      ["http://localhost/prefix/file.ext", "file.ext", "prefix"],
      ["http://localhost/prefix/file.ext", "file.ext", "/prefix"],
      ["http://localhost/prefix/file.ext", "file.ext", "/prefix/"],
      ["http://localhost/file.ext", "../file.ext", "/prefix/"],
      ["http://localhost/prefix/path/file.ext", "file.ext", "prefix/path"],
      ["http://localhost/prefix/path/file.ext", "file.ext", "/prefix/path"],
      ["http://localhost/prefix/path/file.ext", "file.ext", "/prefix/path/"],
      ["http://localhost/prefix/file.ext", "../file.ext", "/prefix/path/"],

    ]
    tests.forEach(testArray => {
      const [expected, suffix, pathname = '', hostname = 'localhost', protocol = 'http:'] = testArray
      const endpoint = { pathname, hostname, protocol }
      test(`urlForEndpoint('${endpoint}', '${suffix}')`, () => {
        assert.equal(urlForEndpoint(endpoint, suffix), expected)
      })
    })
  }) 


  describe("urlEndpoint", () => {
    test("returns http localhost endpoint", () => {

      
      const user = 'username'
      assert.deepStrictEqual(urlEndpoint(), { protocol: 'http:', hostname: 'localhost', pathname: '/' })

      const { environment } = Runtime
      // const environmentBase = environment.get(EnvironmentKeyUrlBase)
      const url = 'file://' + path.resolve('./images/standalone/public/media', user)
      environment.set(EnvironmentKeyUrlBase, url)
      
      assert.deepStrictEqual(urlEndpoint(), { protocol: 'file:', hostname: '', pathname: `/app/images/standalone/public/media/${user}` })
   })
  })
})
