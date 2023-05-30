import { expect, assert } from '@open-wc/testing';


import { remoteClientInstance } from '../src/Client/index';
import { RemoteClientClass } from '../src/Client/RemoteClientClass';
import { OperationsRemote } from '../src/Client/RemoteClient';

import { isPopulatedString, ErrorName } from '@moviemasher/lib-core'

describe('Client', function() {
  it('args', function() {
    const client = remoteClientInstance()
    expect(client.args.translationSource).to.equal('http://localhost:8000/packages/core/client/json/translations.json')
  }) 

  it("remoteClientInstance() returns a Client instance", function() {
    const client = remoteClientInstance()
    assert(client)
    assert(client instanceof RemoteClientClass)
  })

  // test that client can provide an accept attribute for file input
  it("fileAccept() returns a string", function() {
    const client = remoteClientInstance()
    const accept = client.fileAccept
    assert(accept)
    assert(isPopulatedString(accept))
    assert.equal(accept, 'audio/*,image/*,video/*,application/json')
  } )

  // test that client limits file size by type
  it("fileMedia returns an error if video file too large", async function() {
    
    const client = remoteClientInstance()
    const file = { name: 'test.mp4', type: 'video/mp4', size: 10000000000 } 
    const orError = await client.fileMedia(file)
    assert(orError)
    assert(orError.error)
    const { error } = orError
    assert.equal(error.name, ErrorName.ImportSize)
  })
  
  // test that all client operations are enabled by default 
  it("enabled returns true for all operations", function() {
    
    const client = remoteClientInstance()
    for (const operation of OperationsRemote) {
      assert(client.enabled(operation), `operation ${operation} not enabled`)
    }
    assert(client.enabled(), 'operations not all enabled')
  })

  // test that client can get media instance
  // it("get returns a promise", async function() {
    
  //   const client = remoteClientInstance()
  //   const { environment } = Runtime
  //   environment.set(EnvironmentKeyUrlBase, 'test://host/path')

  //   const orError = await client.get()
  //   assert(orError)
  //   assert.equal(orError.error, undefined)

  //   const { data } = orError
  //   assert(isAsset(data))
  // })
})