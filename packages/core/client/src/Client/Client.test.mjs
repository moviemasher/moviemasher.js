import { describe, test } from 'node:test'
import assert from 'assert'

import { ClientClass, clientInstance, Operations } from '@moviemasher/client-core'
import { isPopulatedString, ErrorName, EnvironmentKeyUrlBase, Runtime, isMedia } from '@moviemasher/moviemasher.js'
import {} from "../../../../images/tester/Utilities/TestProtocol.mjs"
describe("Client", () => {
  const client = clientInstance()
  test("clientInstance() returns a Client instance", () => {
    assert(client)
    assert(client instanceof ClientClass)
  })

  // test that client can provide an accept attribute for file input
  test("fileAccept() returns a string", () => {
    const accept = client.fileAccept
    assert(accept)
    assert(isPopulatedString(accept))
    assert.equal(accept, 'audio/*,image/*,video/*,application/json')
  } )

  // test that client limits file size by type
  test("fileMedia returns an error if video file too large", async () => {
    const file = { name: 'test.mp4', type: 'video/mp4', size: 10000000000 } 
    const orError = await client.fileMedia(file)
    assert(orError)
    assert(orError.error)
    const { error } = orError
    assert.equal(error.name, ErrorName.ImportSize)
  })
  
  // test that all client operations are enabled by default 
  test("enabled returns true for all operations", () => {
    for (const operation of Operations) {
      assert(client.enabled(operation), `operation ${operation} not enabled`)
    }
    assert(client.enabled(), 'operations not all enabled')
  })

  // test that client can get media instance
  test("get returns a promise", async () => {
    const { environment } = Runtime
    environment.set(EnvironmentKeyUrlBase, 'test://host/path')

    const orError = await client.get()
    assert(orError)
    assert.equal(orError.error, undefined)

    const { data } = orError
    assert(isMedia(data))
  })
})
