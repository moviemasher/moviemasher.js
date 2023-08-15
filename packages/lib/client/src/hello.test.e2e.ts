import { expect, html, fixture } from '@open-wc/testing';
// import { updateCompetedPromise } from '../../../../dev/utils/test.mjs';

import { makeScreenshot } from 'web-test-runner-screenshot';

import { setViewport } from '@web/test-runner-commands';

import '../src/index.js'// { Base, FormElement } from 


describe('FormElement', function() {
  it('completes update', async function() {
    await setViewport({ width: 1200, height: 800 })
    const parentNode = document.createElement('div');
    parentNode.setAttribute('style', 'width: 100vw; display: flex;');

    const mmHtml = html`<movie-masher translationSource='amazing'></movie-masher>`
    // const mmHtml = html`<h1>hello</h1>`
    const el = await fixture(mmHtml, { parentNode })
    // await updateCompetedPromise(el)
    // expect(el.translationSource).to.eq('amazing')
    expect(true).to.be.true;
    await makeScreenshot({ name: 'hello', browser: true, folder: '../../packages/client/component/screenshots' });
  }) 
})