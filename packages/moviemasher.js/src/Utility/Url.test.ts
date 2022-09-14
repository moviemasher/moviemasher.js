import { Endpoint } from "../declarations"
import { urlCombine, urlEndpoint, urlForEndpoint, urlFromEndpoint, urlParse, urlsAbsolute, urlsParsed } from "./Url"

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
  describe.each(tests)("returns %s", (expected, suffix, prefix = '', host = 'localhost', protocol = 'http') => {
    const endpoint: Endpoint = { prefix, host, protocol }
    const bits = ['for', urlFromEndpoint(endpoint), suffix]
    test(bits.join(' '), () => {
      expect(urlForEndpoint(endpoint, suffix)).toBe(expected)
    })
  })
}) 

describe("urlParse", () => {
  const protocol = 'protocol'
  const options = 'key=value'
  const path = 'path'
  const tests = [
    [String([protocol, options, path]), `${protocol}:${options}/${path}`],
    [String([protocol, options, '']), `${protocol}:${options}/`],
    [String([protocol, '', '']), `${protocol}:/`],
    [String([protocol, '', path]), `${protocol}:/${path}`],
    [String(["svg", '', "file.ext"]), 'svg:/file.ext']
  ]
  describe.each(tests)("returns %s", (expected, url) => {
    test(`for ${url}`, () => {
      expect(String(urlParse(url))).toEqual(expected)
    })
  })
})

describe("urlsParsed", () => {
 const tests = [
    [String([]), ""],
    [String([["http", "", "/host.com/file.ext"]]), "http://host.com/file.ext"],
    [String([["svg", "", "file.ext"]]), "svg:/file.ext"],
    [String([["svg", "", "http://host.com/file.ext"]]), "svg:/http://host.com/file.ext"],

  ]
  describe.each(tests)("returns %s", (expected, url) => {
    test(`for ${url}`, () => {
      expect(String(urlsParsed(url))).toEqual(expected)
    })
  })
})


describe("urlsAbsolute", () => {
  const tests = [
    [String([]), ""],
    [String([]), "http://host.com/file.ext"],
    [String([
      ["svg", "", "http://localhost/file.ext"]
    ]), "svg:/file.ext"],
    [String([
      ["svg", "", "http://host.com:8080/file.ext"],
    ]), "svg:/http://host.com:8080/file.ext"],
    [String([
      ["svg", "", "image:/http://host.com:8080/file.ext"],
      ["image", "", "http://host.com:8080/file.ext"]
    ]), "svg:/image:/http://host.com:8080/file.ext"],
  ]
  describe.each(tests)("returns %s", (expected, url) => {
    test(`for ${url}`, () => {
      expect(String(urlsAbsolute(url, urlEndpoint()))).toEqual(expected)
    })
  })
})

describe("urlEndpoint", () => {
  test("returns http localhost endpoint", () => {
    const expected = { protocol: 'http', host: 'localhost', prefix: '/' }
    expect(urlEndpoint()).toEqual(expected)
  })
})