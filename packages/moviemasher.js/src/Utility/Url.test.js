import { describe, test } from 'node:test'
import assert from 'assert'
import path from 'path'

import { urlBaseInitialize, urlEndpoint, urlForEndpoint, urlParse, urlsAbsolute, urlsParsed } from "@moviemasher/moviemasher.js"

describe('Url', () => {
  urlBaseInitialize()
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

  describe("urlParse", () => {
    const protocol = 'protocol:'
    const options = 'key=value'
    const path = 'path'
    const tests = [
      [[protocol, options, path], `${protocol}${options}/${path}`],
      [[protocol, options, ''], `${protocol}${options}/`],
      [[protocol, '', ''], `${protocol}/`],
      [[protocol, '', path], `${protocol}/${path}`],
      [["svg:", '', "file.ext"], 'svg:/file.ext']
    ]

    tests.forEach(testArray => {
      const [expected, url] = testArray
      test(`urlParse for ${url}`, () => {
        assert.deepStrictEqual(urlParse(url), expected)
      })
    })
  })

  describe("urlsParsed", () => {
    const tests = [
      [[], ""],
      [[["http:", "", "/host.com/file.ext"]], "http://host.com/file.ext"],
      [[["svg:", "", "file.ext"]], "svg:/file.ext"],
      [[["svg:", "", "http://host.com/file.ext"]], "svg:/http://host.com/file.ext"],
    ]


    tests.forEach(testArray => {
      const [expected, url] = testArray
      test(`urlsParsed('${url}') returns ${expected}`, () => {
        assert.deepStrictEqual(urlsParsed(url), expected)
      })
    })
  })

  describe("urlsAbsolute", () => {
    const tests = [
      [[], ""],
      // [[['http://localhost/path/to/file.ext']], "path/to/file.ext"],
      [[], "http://host.com/file.ext"],
      [[
        ["svg:", "", "http://localhost/file.ext"]
      ], "svg:/file.ext"],
      [[
        ["svg:", "", "http://host.com:8080/file.ext"],
      ], "svg:/http://host.com:8080/file.ext"],
      [[
        ["svg:", "", "image:/http://host.com:8080/file.ext"],
        ["image:", "", "http://host.com:8080/file.ext"]
      ], "svg:/image:/http://host.com:8080/file.ext"],
    ]

    tests.forEach(testArray => {
      const [expected, url] = testArray
      test(`urlsAbsolute('${url}') returns ${expected}`, () => {
        assert.deepStrictEqual(urlsAbsolute(url, urlEndpoint()), expected)
      })
    })
  })

  describe("urlEndpoint", () => {
    test("returns http localhost endpoint", () => {

      urlBaseInitialize()
      const user = 'username'
      assert.deepStrictEqual(urlEndpoint(), { protocol: 'http:', hostname: 'localhost', pathname: '/' })
      urlBaseInitialize('file://' + path.resolve('./images/standalone/public/media', user))
      
      
      assert.deepStrictEqual(urlEndpoint(), { protocol: 'file:', hostname: '', pathname: `/app/images/standalone/public/media/${user}` })
   })
  })
})