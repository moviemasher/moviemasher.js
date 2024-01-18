import { JSDOM } from "jsdom";


const dom = new JSDOM('<html><body></body></html>', { runScripts: "dangerously", resources: "usable" });

const { window } = dom;
const { document } = window;

// window.document.documentElement = window.document.createElement('html');
// window.document.body = window.document.createElement('body');

class TestElement extends window.HTMLElement {
  constructor() {
    super();
    this.ready = new Promise(resolve => {
      this.markAsReady = resolve;
    });

    // this.shadow = this.attachShadow({
    //   mode: 'open',
    // });

const template = document.createElement('template');

template.innerHTML = "<svg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'><style>@font-face { src: url('/usr/share/fonts/pacifico.ttf'); }</style><text fill='blue' y='80%' font-size='20' text-anchor='middle' x='50%'>Pacifico</text></svg>";
    // const style = window.document.createElement('style');
    // style.onload = () => { this.markAsReady(); };
    this.appendChild(template.content.cloneNode(true));
    this.markAsReady();
  }
};

window.customElements.define('test-component', TestElement);
const test_component = new TestElement;
document.body.appendChild(test_component);

await test_component.ready;

console.log(test_component.innerHTML);

// const { window } = new JSDOM(`
// <script>


// class TestElement extends HTMLElement {
//   constructor() {
//     super();
//     this._shadowRoot = this.attachShadow({ 'mode': 'open' });
//     this._shadowRoot.appendChild(template.content.cloneNode(true));
//   }
// }

// customElements.define('wow-cool', TestElement)

// </script>
// <wow-cool></wow-cool>

// `, { runScripts: "dangerously" });
// const { document } = window;

// const frag = JSDOM.fragment("<svg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'><style>@font-face { src: url('/usr/share/fonts/pacifico.ttf'); }</style><text fill='blue' y='80%' font-size='20' text-anchor='middle' x='50%'>Pacifico</text></svg>");
