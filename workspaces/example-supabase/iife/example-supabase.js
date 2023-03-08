var MovieMasherExampleSupabase = (function (exports, React, protocolSupabase, moviemasher_js, clientReact, ReactDOM) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);
  var ReactDOM__default = /*#__PURE__*/_interopDefault(ReactDOM);

  var jsxRuntimeExports = {};
  var jsxRuntime = {
    get exports(){ return jsxRuntimeExports; },
    set exports(v){ jsxRuntimeExports = v; },
  };

  var reactJsxRuntime_production_min = {};

  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f$1=React__default.default,k$1=Symbol.for("react.element"),l$1=Symbol.for("react.fragment"),m$1=Object.prototype.hasOwnProperty,n$1=f$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p$1={key:!0,ref:!0,__self:!0,__source:!0};
  function q$1(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m$1.call(a,b)&&!p$1.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a)void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k$1,type:c,key:e,ref:h,props:d,_owner:n$1.current}}reactJsxRuntime_production_min.Fragment=l$1;reactJsxRuntime_production_min.jsx=q$1;reactJsxRuntime_production_min.jsxs=q$1;

  (function (module) {

  	{
  	  module.exports = reactJsxRuntime_production_min;
  	}
  } (jsxRuntime));

  var e,t="colors",n="sizes",r="space",i={gap:r,gridGap:r,columnGap:r,gridColumnGap:r,rowGap:r,gridRowGap:r,inset:r,insetBlock:r,insetBlockEnd:r,insetBlockStart:r,insetInline:r,insetInlineEnd:r,insetInlineStart:r,margin:r,marginTop:r,marginRight:r,marginBottom:r,marginLeft:r,marginBlock:r,marginBlockEnd:r,marginBlockStart:r,marginInline:r,marginInlineEnd:r,marginInlineStart:r,padding:r,paddingTop:r,paddingRight:r,paddingBottom:r,paddingLeft:r,paddingBlock:r,paddingBlockEnd:r,paddingBlockStart:r,paddingInline:r,paddingInlineEnd:r,paddingInlineStart:r,top:r,right:r,bottom:r,left:r,scrollMargin:r,scrollMarginTop:r,scrollMarginRight:r,scrollMarginBottom:r,scrollMarginLeft:r,scrollMarginX:r,scrollMarginY:r,scrollMarginBlock:r,scrollMarginBlockEnd:r,scrollMarginBlockStart:r,scrollMarginInline:r,scrollMarginInlineEnd:r,scrollMarginInlineStart:r,scrollPadding:r,scrollPaddingTop:r,scrollPaddingRight:r,scrollPaddingBottom:r,scrollPaddingLeft:r,scrollPaddingX:r,scrollPaddingY:r,scrollPaddingBlock:r,scrollPaddingBlockEnd:r,scrollPaddingBlockStart:r,scrollPaddingInline:r,scrollPaddingInlineEnd:r,scrollPaddingInlineStart:r,fontSize:"fontSizes",background:t,backgroundColor:t,backgroundImage:t,borderImage:t,border:t,borderBlock:t,borderBlockEnd:t,borderBlockStart:t,borderBottom:t,borderBottomColor:t,borderColor:t,borderInline:t,borderInlineEnd:t,borderInlineStart:t,borderLeft:t,borderLeftColor:t,borderRight:t,borderRightColor:t,borderTop:t,borderTopColor:t,caretColor:t,color:t,columnRuleColor:t,fill:t,outline:t,outlineColor:t,stroke:t,textDecorationColor:t,fontFamily:"fonts",fontWeight:"fontWeights",lineHeight:"lineHeights",letterSpacing:"letterSpacings",blockSize:n,minBlockSize:n,maxBlockSize:n,inlineSize:n,minInlineSize:n,maxInlineSize:n,width:n,minWidth:n,maxWidth:n,height:n,minHeight:n,maxHeight:n,flexBasis:n,gridTemplateColumns:n,gridTemplateRows:n,borderWidth:"borderWidths",borderTopWidth:"borderWidths",borderRightWidth:"borderWidths",borderBottomWidth:"borderWidths",borderLeftWidth:"borderWidths",borderStyle:"borderStyles",borderTopStyle:"borderStyles",borderRightStyle:"borderStyles",borderBottomStyle:"borderStyles",borderLeftStyle:"borderStyles",borderRadius:"radii",borderTopLeftRadius:"radii",borderTopRightRadius:"radii",borderBottomRightRadius:"radii",borderBottomLeftRadius:"radii",boxShadow:"shadows",textShadow:"shadows",transition:"transitions",zIndex:"zIndices"},o=(e,t)=>"function"==typeof t?{"()":Function.prototype.toString.call(t)}:t,l=()=>{const e=Object.create(null);return (t,n,...r)=>{const i=(e=>JSON.stringify(e,o))(t);return i in e?e[i]:e[i]=n(t,...r)}},s=Symbol.for("sxs.internal"),a=(e,t)=>Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)),c=e=>{for(const t in e)return !0;return !1},{hasOwnProperty:d}=Object.prototype,g=e=>e.includes("-")?e:e.replace(/[A-Z]/g,(e=>"-"+e.toLowerCase())),p=/\s+(?![^()]*\))/,u=e=>t=>e(..."string"==typeof t?String(t).split(p):[t]),h={appearance:e=>({WebkitAppearance:e,appearance:e}),backfaceVisibility:e=>({WebkitBackfaceVisibility:e,backfaceVisibility:e}),backdropFilter:e=>({WebkitBackdropFilter:e,backdropFilter:e}),backgroundClip:e=>({WebkitBackgroundClip:e,backgroundClip:e}),boxDecorationBreak:e=>({WebkitBoxDecorationBreak:e,boxDecorationBreak:e}),clipPath:e=>({WebkitClipPath:e,clipPath:e}),content:e=>({content:e.includes('"')||e.includes("'")||/^([A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(e)?e:`"${e}"`}),hyphens:e=>({WebkitHyphens:e,hyphens:e}),maskImage:e=>({WebkitMaskImage:e,maskImage:e}),maskSize:e=>({WebkitMaskSize:e,maskSize:e}),tabSize:e=>({MozTabSize:e,tabSize:e}),textSizeAdjust:e=>({WebkitTextSizeAdjust:e,textSizeAdjust:e}),userSelect:e=>({WebkitUserSelect:e,userSelect:e}),marginBlock:u(((e,t)=>({marginBlockStart:e,marginBlockEnd:t||e}))),marginInline:u(((e,t)=>({marginInlineStart:e,marginInlineEnd:t||e}))),maxSize:u(((e,t)=>({maxBlockSize:e,maxInlineSize:t||e}))),minSize:u(((e,t)=>({minBlockSize:e,minInlineSize:t||e}))),paddingBlock:u(((e,t)=>({paddingBlockStart:e,paddingBlockEnd:t||e}))),paddingInline:u(((e,t)=>({paddingInlineStart:e,paddingInlineEnd:t||e})))},f=/([\d.]+)([^]*)/,m=(e,t)=>e.length?e.reduce(((e,n)=>(e.push(...t.map((e=>e.includes("&")?e.replace(/&/g,/[ +>|~]/.test(n)&&/&.*&/.test(e)?`:is(${n})`:n):n+" "+e))),e)),[]):t,b=(e,t)=>e in S&&"string"==typeof t?t.replace(/^((?:[^]*[^\w-])?)(fit-content|stretch)((?:[^\w-][^]*)?)$/,((t,n,r,i)=>n+("stretch"===r?`-moz-available${i};${g(e)}:${n}-webkit-fill-available`:`-moz-fit-content${i};${g(e)}:${n}fit-content`)+i)):String(t),S={blockSize:1,height:1,inlineSize:1,maxBlockSize:1,maxHeight:1,maxInlineSize:1,maxWidth:1,minBlockSize:1,minHeight:1,minInlineSize:1,minWidth:1,width:1},k=e=>e?e+"-":"",y=(e,t,n)=>e.replace(/([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g,((e,r,i,o,l)=>"$"==o==!!i?e:(r||"--"==o?"calc(":"")+"var(--"+("$"===o?k(t)+(l.includes("$")?"":k(n))+l.replace(/\$/g,"-"):l)+")"+(r||"--"==o?"*"+(r||"")+(i||"1")+")":""))),B=/\s*,\s*(?![^()]*\))/,$=Object.prototype.toString,x=(e,t,n,r,i)=>{let o,l,s;const a=(e,t,n)=>{let c,d;const p=e=>{for(c in e){const x=64===c.charCodeAt(0),z=x&&Array.isArray(e[c])?e[c]:[e[c]];for(d of z){const e=/[A-Z]/.test(S=c)?S:S.replace(/-[^]/g,(e=>e[1].toUpperCase())),z="object"==typeof d&&d&&d.toString===$&&(!r.utils[e]||!t.length);if(e in r.utils&&!z){const t=r.utils[e];if(t!==l){l=t,p(t(d)),l=null;continue}}else if(e in h){const t=h[e];if(t!==s){s=t,p(t(d)),s=null;continue}}if(x&&(u=c.slice(1)in r.media?"@media "+r.media[c.slice(1)]:c,c=u.replace(/\(\s*([\w-]+)\s*(=|<|<=|>|>=)\s*([\w-]+)\s*(?:(<|<=|>|>=)\s*([\w-]+)\s*)?\)/g,((e,t,n,r,i,o)=>{const l=f.test(t),s=.0625*(l?-1:1),[a,c]=l?[r,t]:[t,r];return "("+("="===n[0]?"":">"===n[0]===l?"max-":"min-")+a+":"+("="!==n[0]&&1===n.length?c.replace(f,((e,t,r)=>Number(t)+s*(">"===n?1:-1)+r)):c)+(i?") and ("+(">"===i[0]?"min-":"max-")+a+":"+(1===i.length?o.replace(f,((e,t,n)=>Number(t)+s*(">"===i?-1:1)+n)):o):"")+")"}))),z){const e=x?n.concat(c):[...n],r=x?[...t]:m(t,c.split(B));void 0!==o&&i(I(...o)),o=void 0,a(d,r,e);}else void 0===o&&(o=[[],t,n]),c=x||36!==c.charCodeAt(0)?c:`--${k(r.prefix)}${c.slice(1).replace(/\$/g,"-")}`,d=z?d:"number"==typeof d?d&&e in R?String(d)+"px":String(d):y(b(e,null==d?"":d),r.prefix,r.themeMap[e]),o[0].push(`${x?`${c} `:`${g(c)}:`}${d}`);}}var u,S;};p(e),void 0!==o&&i(I(...o)),o=void 0;};a(e,t,n);},I=(e,t,n)=>`${n.map((e=>`${e}{`)).join("")}${t.length?`${t.join(",")}{`:""}${e.join(";")}${t.length?"}":""}${Array(n.length?n.length+1:0).join("}")}`,R={animationDelay:1,animationDuration:1,backgroundSize:1,blockSize:1,border:1,borderBlock:1,borderBlockEnd:1,borderBlockEndWidth:1,borderBlockStart:1,borderBlockStartWidth:1,borderBlockWidth:1,borderBottom:1,borderBottomLeftRadius:1,borderBottomRightRadius:1,borderBottomWidth:1,borderEndEndRadius:1,borderEndStartRadius:1,borderInlineEnd:1,borderInlineEndWidth:1,borderInlineStart:1,borderInlineStartWidth:1,borderInlineWidth:1,borderLeft:1,borderLeftWidth:1,borderRadius:1,borderRight:1,borderRightWidth:1,borderSpacing:1,borderStartEndRadius:1,borderStartStartRadius:1,borderTop:1,borderTopLeftRadius:1,borderTopRightRadius:1,borderTopWidth:1,borderWidth:1,bottom:1,columnGap:1,columnRule:1,columnRuleWidth:1,columnWidth:1,containIntrinsicSize:1,flexBasis:1,fontSize:1,gap:1,gridAutoColumns:1,gridAutoRows:1,gridTemplateColumns:1,gridTemplateRows:1,height:1,inlineSize:1,inset:1,insetBlock:1,insetBlockEnd:1,insetBlockStart:1,insetInline:1,insetInlineEnd:1,insetInlineStart:1,left:1,letterSpacing:1,margin:1,marginBlock:1,marginBlockEnd:1,marginBlockStart:1,marginBottom:1,marginInline:1,marginInlineEnd:1,marginInlineStart:1,marginLeft:1,marginRight:1,marginTop:1,maxBlockSize:1,maxHeight:1,maxInlineSize:1,maxWidth:1,minBlockSize:1,minHeight:1,minInlineSize:1,minWidth:1,offsetDistance:1,offsetRotate:1,outline:1,outlineOffset:1,outlineWidth:1,overflowClipMargin:1,padding:1,paddingBlock:1,paddingBlockEnd:1,paddingBlockStart:1,paddingBottom:1,paddingInline:1,paddingInlineEnd:1,paddingInlineStart:1,paddingLeft:1,paddingRight:1,paddingTop:1,perspective:1,right:1,rowGap:1,scrollMargin:1,scrollMarginBlock:1,scrollMarginBlockEnd:1,scrollMarginBlockStart:1,scrollMarginBottom:1,scrollMarginInline:1,scrollMarginInlineEnd:1,scrollMarginInlineStart:1,scrollMarginLeft:1,scrollMarginRight:1,scrollMarginTop:1,scrollPadding:1,scrollPaddingBlock:1,scrollPaddingBlockEnd:1,scrollPaddingBlockStart:1,scrollPaddingBottom:1,scrollPaddingInline:1,scrollPaddingInlineEnd:1,scrollPaddingInlineStart:1,scrollPaddingLeft:1,scrollPaddingRight:1,scrollPaddingTop:1,shapeMargin:1,textDecoration:1,textDecorationThickness:1,textIndent:1,textUnderlineOffset:1,top:1,transitionDelay:1,transitionDuration:1,verticalAlign:1,width:1,wordSpacing:1},z=e=>String.fromCharCode(e+(e>25?39:97)),W=e=>(e=>{let t,n="";for(t=Math.abs(e);t>52;t=t/52|0)n=z(t%52)+n;return z(t%52)+n})(((e,t)=>{let n=t.length;for(;n;)e=33*e^t.charCodeAt(--n);return e})(5381,JSON.stringify(e))>>>0),j=["themed","global","styled","onevar","resonevar","allvar","inline"],E=e=>{if(e.href&&!e.href.startsWith(location.origin))return !1;try{return !!e.cssRules}catch(e){return !1}},T=e=>{let t;const n=()=>{const{cssRules:e}=t.sheet;return [].map.call(e,((n,r)=>{const{cssText:i}=n;let o="";if(i.startsWith("--sxs"))return "";if(e[r-1]&&(o=e[r-1].cssText).startsWith("--sxs")){if(!n.cssRules.length)return "";for(const e in t.rules)if(t.rules[e].group===n)return `--sxs{--sxs:${[...t.rules[e].cache].join(" ")}}${i}`;return n.cssRules.length?`${o}${i}`:""}return i})).join("")},r=()=>{if(t){const{rules:e,sheet:n}=t;if(!n.deleteRule){for(;3===Object(Object(n.cssRules)[0]).type;)n.cssRules.splice(0,1);n.cssRules=[];}for(const t in e)delete e[t];}const i=Object(e).styleSheets||[];for(const e of i)if(E(e)){for(let i=0,o=e.cssRules;o[i];++i){const l=Object(o[i]);if(1!==l.type)continue;const s=Object(o[i+1]);if(4!==s.type)continue;++i;const{cssText:a}=l;if(!a.startsWith("--sxs"))continue;const c=a.slice(14,-3).trim().split(/\s+/),d=j[c[0]];d&&(t||(t={sheet:e,reset:r,rules:{},toString:n}),t.rules[d]={group:s,index:i,cache:new Set(c)});}if(t)break}if(!t){const i=(e,t)=>({type:t,cssRules:[],insertRule(e,t){this.cssRules.splice(t,0,i(e,{import:3,undefined:1}[(e.toLowerCase().match(/^@([a-z]+)/)||[])[1]]||4));},get cssText(){return "@media{}"===e?`@media{${[].map.call(this.cssRules,(e=>e.cssText)).join("")}}`:e}});t={sheet:e?(e.head||e).appendChild(document.createElement("style")).sheet:i("","text/css"),rules:{},reset:r,toString:n};}const{sheet:o,rules:l}=t;for(let e=j.length-1;e>=0;--e){const t=j[e];if(!l[t]){const n=j[e+1],r=l[n]?l[n].index:o.cssRules.length;o.insertRule("@media{}",r),o.insertRule(`--sxs{--sxs:${e}}`,r),l[t]={group:o.cssRules[r+1],index:r,cache:new Set([e])};}v(l[t]);}};return r(),t},v=e=>{const t=e.group;let n=t.cssRules.length;e.apply=e=>{try{t.insertRule(e,n),++n;}catch(e){}};},M=Symbol(),w=l(),C=(e,t)=>w(e,(()=>(...n)=>{let r={type:null,composers:new Set};for(const t of n)if(null!=t)if(t[s]){null==r.type&&(r.type=t[s].type);for(const e of t[s].composers)r.composers.add(e);}else t.constructor!==Object||t.$$typeof?null==r.type&&(r.type=t):r.composers.add(P(t,e));return null==r.type&&(r.type="span"),r.composers.size||r.composers.add(["PJLV",{},[],[],{},[]]),L(e,r,t)})),P=({variants:e,compoundVariants:t,defaultVariants:n,...r},i)=>{const o=`${k(i.prefix)}c-${W(r)}`,l=[],s=[],a=Object.create(null),g=[];for(const e in n)a[e]=String(n[e]);if("object"==typeof e&&e)for(const t in e){p=a,u=t,d.call(p,u)||(a[t]="undefined");const n=e[t];for(const e in n){const r={[t]:String(e)};"undefined"===String(e)&&g.push(t);const i=n[e],o=[r,i,!c(i)];l.push(o);}}var p,u;if("object"==typeof t&&t)for(const e of t){let{css:t,...n}=e;t="object"==typeof t&&t||{};for(const e in n)n[e]=String(n[e]);const r=[n,t,!c(t)];s.push(r);}return [o,r,l,s,a,g]},L=(e,t,n)=>{const[r,i,o,l]=O(t.composers),c="function"==typeof t.type||t.type.$$typeof?(e=>{function t(){for(let n=0;n<t[M].length;n++){const[r,i]=t[M][n];e.rules[r].apply(i);}return t[M]=[],null}return t[M]=[],t.rules={},j.forEach((e=>t.rules[e]={apply:n=>t[M].push([e,n])})),t})(n):null,d=(c||n).rules,g=`.${r}${i.length>1?`:where(.${i.slice(1).join(".")})`:""}`,p=s=>{s="object"==typeof s&&s||D;const{css:a,...p}=s,u={};for(const e in o)if(delete p[e],e in s){let t=s[e];"object"==typeof t&&t?u[e]={"@initial":o[e],...t}:(t=String(t),u[e]="undefined"!==t||l.has(e)?t:o[e]);}else u[e]=o[e];const h=new Set([...i]);for(const[r,i,o,l]of t.composers){n.rules.styled.cache.has(r)||(n.rules.styled.cache.add(r),x(i,[`.${r}`],[],e,(e=>{d.styled.apply(e);})));const t=A(o,u,e.media),s=A(l,u,e.media,!0);for(const i of t)if(void 0!==i)for(const[t,o,l]of i){const i=`${r}-${W(o)}-${t}`;h.add(i);const s=(l?n.rules.resonevar:n.rules.onevar).cache,a=l?d.resonevar:d.onevar;s.has(i)||(s.add(i),x(o,[`.${i}`],[],e,(e=>{a.apply(e);})));}for(const t of s)if(void 0!==t)for(const[i,o]of t){const t=`${r}-${W(o)}-${i}`;h.add(t),n.rules.allvar.cache.has(t)||(n.rules.allvar.cache.add(t),x(o,[`.${t}`],[],e,(e=>{d.allvar.apply(e);})));}}if("object"==typeof a&&a){const t=`${r}-i${W(a)}-css`;h.add(t),n.rules.inline.cache.has(t)||(n.rules.inline.cache.add(t),x(a,[`.${t}`],[],e,(e=>{d.inline.apply(e);})));}for(const e of String(s.className||"").trim().split(/\s+/))e&&h.add(e);const f=p.className=[...h].join(" ");return {type:t.type,className:f,selector:g,props:p,toString:()=>f,deferredInjector:c}};return a(p,{className:r,selector:g,[s]:t,toString:()=>(n.rules.styled.cache.has(r)||p(),r)})},O=e=>{let t="";const n=[],r={},i=[];for(const[o,,,,l,s]of e){""===t&&(t=o),n.push(o),i.push(...s);for(const e in l){const t=l[e];(void 0===r[e]||"undefined"!==t||s.includes(t))&&(r[e]=t);}}return [t,n,r,new Set(i)]},A=(e,t,n,r)=>{const i=[];e:for(let[o,l,s]of e){if(s)continue;let e,a=0,c=!1;for(e in o){const r=o[e];let i=t[e];if(i!==r){if("object"!=typeof i||!i)continue e;{let e,t,o=0;for(const l in i){if(r===String(i[l])){if("@initial"!==l){const e=l.slice(1);(t=t||[]).push(e in n?n[e]:l.replace(/^@media ?/,"")),c=!0;}a+=o,e=!0;}++o;}if(t&&t.length&&(l={["@media "+t.join(", ")]:l}),!e)continue e}}}(i[a]=i[a]||[]).push([r?"cv":`${e}-${o[e]}`,l,c]);}return i},D={},H=l(),N=(e,t)=>H(e,(()=>(...n)=>{const r=()=>{for(let r of n){r="object"==typeof r&&r||{};let n=W(r);if(!t.rules.global.cache.has(n)){if(t.rules.global.cache.add(n),"@import"in r){let e=[].indexOf.call(t.sheet.cssRules,t.rules.themed.group)-1;for(let n of [].concat(r["@import"]))n=n.includes('"')||n.includes("'")?n:`"${n}"`,t.sheet.insertRule(`@import ${n};`,e++);delete r["@import"];}x(r,[],[],e,(e=>{t.rules.global.apply(e);}));}}return ""};return a(r,{toString:r})})),V=l(),G=(e,t)=>V(e,(()=>n=>{const r=`${k(e.prefix)}k-${W(n)}`,i=()=>{if(!t.rules.global.cache.has(r)){t.rules.global.cache.add(r);const i=[];x(n,[],[],e,(e=>i.push(e)));const o=`@keyframes ${r}{${i.join("")}}`;t.rules.global.apply(o);}return r};return a(i,{get name(){return i()},toString:i})})),F=class{constructor(e,t,n,r){this.token=null==e?"":String(e),this.value=null==t?"":String(t),this.scale=null==n?"":String(n),this.prefix=null==r?"":String(r);}get computedValue(){return "var("+this.variable+")"}get variable(){return "--"+k(this.prefix)+k(this.scale)+this.token}toString(){return this.computedValue}},J=l(),U=(e,t)=>J(e,(()=>(n,r)=>{r="object"==typeof n&&n||Object(r);const i=`.${n=(n="string"==typeof n?n:"")||`${k(e.prefix)}t-${W(r)}`}`,o={},l=[];for(const t in r){o[t]={};for(const n in r[t]){const i=`--${k(e.prefix)}${t}-${n}`,s=y(String(r[t][n]),e.prefix,t);o[t][n]=new F(n,s,t,e.prefix),l.push(`${i}:${s}`);}}const s=()=>{if(l.length&&!t.rules.themed.cache.has(n)){t.rules.themed.cache.add(n);const i=`${r===e.theme?":root,":""}.${n}{${l.join(";")}}`;t.rules.themed.apply(i);}return n};return {...o,get className(){return s()},selector:i,toString:s}})),Z=l(),X=e=>{let t=!1;const n=Z(e,(e=>{t=!0;const n="prefix"in(e="object"==typeof e&&e||{})?String(e.prefix):"",r="object"==typeof e.media&&e.media||{},o="object"==typeof e.root?e.root||null:globalThis.document||null,l="object"==typeof e.theme&&e.theme||{},s={prefix:n,media:r,theme:l,themeMap:"object"==typeof e.themeMap&&e.themeMap||{...i},utils:"object"==typeof e.utils&&e.utils||{}},a=T(o),c={css:C(s,a),globalCss:N(s,a),keyframes:G(s,a),createTheme:U(s,a),reset(){a.reset(),c.theme.toString();},theme:{},sheet:a,config:s,prefix:n,getCssText:a.toString,toString:a.toString};return String(c.theme=c.createTheme(l)),c}));return t||n.reset(),n},Y=()=>e||(e=X()),q=(...e)=>Y().createTheme(...e),_=(...e)=>Y().css(...e);//# sourceMappingUrl=index.map

  function value(src, next) {
    let k;

    if (src && next && typeof src === 'object' && typeof next === 'object') {
      if (Array.isArray(next)) {
        for (k = 0; k < next.length; k++) {
          src[k] = value(src[k], next[k]);
        }
      } else {
        for (k in next) {
          src[k] = value(src[k], next[k]);
        }
      }

      return src;
    }

    return next;
  }

  function merge(target) {
    let len = arguments.length <= 1 ? 0 : arguments.length - 1;

    for (let i = 0; i < len; i++) {
      target = value(target, i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1]);
    }

    return target;
  }

  const VIEWS$1 = {
    SIGN_IN: 'sign_in',
    SIGN_UP: 'sign_up',
    FORGOTTEN_PASSWORD: 'forgotten_password',
    MAGIC_LINK: 'magic_link',
    UPDATE_PASSWORD: 'update_password'
  };
  const PREPENDED_CLASS_NAMES = 'supabase-ui-auth';
  /**
   * CSS class names
   * used for generating prepended classes
   */

  const CLASS_NAMES = {
    // interfaces
    ROOT: 'root',
    SIGN_IN: VIEWS$1.SIGN_IN,
    SIGN_UP: VIEWS$1.SIGN_UP,
    FORGOTTEN_PASSWORD: VIEWS$1.FORGOTTEN_PASSWORD,
    MAGIC_LINK: VIEWS$1.MAGIC_LINK,
    UPDATE_PASSWORD: VIEWS$1.UPDATE_PASSWORD,
    // ui
    anchor: 'ui-anchor',
    button: 'ui-button',
    container: 'ui-container',
    divider: 'ui-divider',
    input: 'ui-input',
    label: 'ui-label',
    loader: 'ui-loader',
    message: 'ui-message'
  };

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                  t[p[i]] = s[p[i]];
          }
      return t;
  }

  function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
      return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
          function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
          function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
  }

  function generateClassNames(
  /**
   * name of css class name variable
   */
  classNameKey,
  /**
   * stiches CSS output
   */
  defaultStyles,
  /**
   * appearance variables
   */
  appearance) {
    var _a, _b;

    const classNames = [];
    const className = CLASS_NAMES[classNameKey];
    classNames.push((appearance === null || appearance === void 0 ? void 0 : appearance.prependedClassName) ? (appearance === null || appearance === void 0 ? void 0 : appearance.prependedClassName) + '_' + className : PREPENDED_CLASS_NAMES + '_' + className);

    if ((_a = appearance === null || appearance === void 0 ? void 0 : appearance.className) === null || _a === void 0 ? void 0 : _a[classNameKey]) {
      classNames.push((_b = appearance === null || appearance === void 0 ? void 0 : appearance.className) === null || _b === void 0 ? void 0 : _b[classNameKey]);
    } // if (
    //   appearance?.extendAppearance === undefined ||
    //   appearance?.extendAppearance === true
    // ) {


    classNames.push(defaultStyles); // }

    return classNames;
  }

  const anchorHTMLAttributes = _({
    fontFamily: '$bodyFontFamily',
    fontSize: '$baseBodySize',
    marginBottom: '$anchorBottomMargin',
    color: '$anchorTextColor',
    display: 'block',
    textAlign: 'center',
    textDecoration: 'underline',
    '&:hover': {
      color: '$anchorTextHoverColor'
    }
  });

  const Anchor = _a => {
    var _b;

    var {
      children,
      appearance
    } = _a,
        props = __rest(_a, ["children", "appearance"]);

    const classNames = generateClassNames('anchor', anchorHTMLAttributes(), appearance);
    return jsxRuntimeExports.jsx("a", Object.assign({}, props, {
      style: (_b = appearance === null || appearance === void 0 ? void 0 : appearance.style) === null || _b === void 0 ? void 0 : _b.anchor,
      className: classNames.join(' ')
    }, {
      children: children
    }));
  };

  const buttonDefaultStyles = _({
    fontFamily: '$buttonFontFamily',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '$borderRadiusButton',
    fontSize: '$baseButtonSize',
    padding: '$buttonPadding',
    cursor: 'pointer',
    borderWidth: '$buttonBorderWidth',
    borderStyle: 'solid',
    width: '100%',
    transitionPproperty: 'background-color',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '100ms',
    '&:disabled': {
      opacity: 0.7,
      cursor: 'unset'
    },
    variants: {
      color: {
        default: {
          backgroundColor: '$defaultButtonBackground',
          color: '$defaultButtonText',
          borderColor: '$defaultButtonBorder',
          '&:hover:not(:disabled)': {
            backgroundColor: '$defaultButtonBackgroundHover'
          }
        },
        primary: {
          backgroundColor: '$brand',
          color: '$brandButtonText',
          borderColor: '$brandAccent',
          '&:hover:not(:disabled)': {
            backgroundColor: '$brandAccent'
          }
        }
      }
    }
  });

  const Button = _a => {
    var _b;

    var {
      children,
      color = 'default',
      appearance,
      icon,
      loading = false
    } = _a,
        props = __rest(_a, ["children", "color", "appearance", "icon", "loading"]);

    const classNames = generateClassNames('button', buttonDefaultStyles({
      color: color
    }), appearance);
    return jsxRuntimeExports.jsxs("button", Object.assign({}, props, {
      style: (_b = appearance === null || appearance === void 0 ? void 0 : appearance.style) === null || _b === void 0 ? void 0 : _b.button,
      className: classNames.join(' '),
      disabled: loading
    }, {
      children: [icon, children]
    }));
  };

  const containerDefaultStyles = _({
    display: 'flex',
    gap: '4px',
    variants: {
      direction: {
        horizontal: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(48px, 1fr))'
        },
        vertical: {
          flexDirection: 'column',
          margin: '8px 0'
        }
      },
      gap: {
        small: {
          gap: '4px'
        },
        medium: {
          gap: '8px'
        },
        large: {
          gap: '16px'
        }
      }
    }
  });

  const Container = _a => {
    var _b;

    var {
      children,
      appearance
    } = _a,
        props = __rest(_a, ["children", "appearance"]);

    const classNames = generateClassNames('container', containerDefaultStyles({
      direction: props.direction,
      gap: props.gap
    }), appearance);
    return jsxRuntimeExports.jsx("div", Object.assign({}, props, {
      style: (_b = appearance === null || appearance === void 0 ? void 0 : appearance.style) === null || _b === void 0 ? void 0 : _b.container,
      className: classNames.join(' ')
    }, {
      children: children
    }));
  };

  const dividerDefaultStyles = _({
    background: '$dividerBackground',
    display: 'block',
    margin: '16px 0',
    height: '1px',
    width: '100%'
  });

  const Divider = _a => {
    var _b;

    var {
      children,
      appearance
    } = _a,
        props = __rest(_a, ["children", "appearance"]);

    const classNames = generateClassNames('divider', dividerDefaultStyles(), appearance);
    return jsxRuntimeExports.jsx("div", Object.assign({}, props, {
      style: (_b = appearance === null || appearance === void 0 ? void 0 : appearance.style) === null || _b === void 0 ? void 0 : _b.divider,
      className: classNames.join(' ')
    }));
  };

  const inputDefaultStyles = _({
    fontFamily: '$inputFontFamily',
    background: '$inputBackground',
    borderRadius: '$inputBorderRadius',
    padding: '$inputPadding',
    cursor: 'text',
    borderWidth: '$inputBorderWidth',
    borderColor: '$inputBorder',
    borderStyle: 'solid',
    fontSize: '$baseInputSize',
    width: '100%',
    color: '$inputText',
    boxSizing: 'border-box',
    '&:hover': {
      borderColor: '$inputBorderHover',
      outline: 'none'
    },
    '&:focus': {
      borderColor: '$inputBorderFocus',
      outline: 'none'
    },
    '&::placeholder': {
      color: '$inputPlaceholder',
      letterSpacing: 'initial'
    },
    transitionPproperty: 'background-color, border',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '100ms',
    variants: {
      type: {
        default: {
          letterSpacing: '0px'
        },
        password: {
          letterSpacing: '6px'
        }
      }
    }
  });

  const Input = _a => {
    var _b;

    var {
      children,
      appearance
    } = _a,
        props = __rest(_a, ["children", "appearance"]);

    const classNames = generateClassNames('input', inputDefaultStyles({
      type: props.type === 'password' ? 'password' : 'default'
    }), appearance);
    return jsxRuntimeExports.jsx("input", Object.assign({}, props, {
      style: (_b = appearance === null || appearance === void 0 ? void 0 : appearance.style) === null || _b === void 0 ? void 0 : _b.input,
      className: classNames.join(' ')
    }, {
      children: children
    }));
  };

  const labelDefaultStyles = _({
    fontFamily: '$labelFontFamily',
    fontSize: '$baseLabelSize',
    marginBottom: '$labelBottomMargin',
    color: '$inputLabelText',
    display: 'block'
  });

  const Label = _a => {
    var _b;

    var {
      children,
      appearance
    } = _a,
        props = __rest(_a, ["children", "appearance"]);

    const classNames = generateClassNames('label', labelDefaultStyles(), appearance);
    return jsxRuntimeExports.jsx("label", Object.assign({}, props, {
      style: (_b = appearance === null || appearance === void 0 ? void 0 : appearance.style) === null || _b === void 0 ? void 0 : _b.label,
      className: classNames.join(' ')
    }, {
      children: children
    }));
  };

  const messageDefaultStyles = _({
    fontFamily: '$bodyFontFamily',
    fontSize: '$baseBodySize',
    marginBottom: '$labelBottomMargin',
    display: 'block',
    textAlign: 'center',
    variants: {
      color: {
        default: {
          color: '$messageText'
        },
        danger: {
          color: '$messageTextDanger'
        }
      }
    }
  });

  const Message = _a => {
    var _b;

    var {
      children,
      appearance
    } = _a,
        props = __rest(_a, ["children", "appearance"]);

    const classNames = generateClassNames('message', messageDefaultStyles({
      color: props.color
    }), appearance);
    return jsxRuntimeExports.jsx("span", Object.assign({}, props, {
      style: (_b = appearance === null || appearance === void 0 ? void 0 : appearance.style) === null || _b === void 0 ? void 0 : _b.message,
      className: classNames.join(' ')
    }, {
      children: children
    }));
  };

  function MagicLink(_ref) {
    let {
      setAuthView,
      supabaseClient,
      redirectTo,
      i18n,
      appearance,
      showLinks
    } = _ref;

    var _a;

    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleMagicLinkSignIn = e => __awaiter(this, void 0, void 0, function* () {
      e.preventDefault();
      setError('');
      setMessage('');
      setLoading(true);
      const {
        error
      } = yield supabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo
        }
      });
      if (error) setError(error.message);else setMessage('Check your email for the magic link');
      setLoading(false);
    });

    const labels = i18n === null || i18n === void 0 ? void 0 : i18n.magic_link;
    return jsxRuntimeExports.jsx("form", Object.assign({
      id: "auth-magic-link",
      onSubmit: handleMagicLinkSignIn
    }, {
      children: jsxRuntimeExports.jsxs(Container, Object.assign({
        gap: "large",
        direction: "vertical",
        appearance: appearance
      }, {
        children: [jsxRuntimeExports.jsxs(Container, Object.assign({
          gap: "large",
          direction: "vertical",
          appearance: appearance
        }, {
          children: [jsxRuntimeExports.jsxs("div", {
            children: [jsxRuntimeExports.jsx(Label, Object.assign({
              appearance: appearance
            }, {
              children: labels === null || labels === void 0 ? void 0 : labels.email_input_label
            })), jsxRuntimeExports.jsx(Input, {
              name: "email",
              type: "email",
              placeholder: labels === null || labels === void 0 ? void 0 : labels.email_input_placeholder,
              onChange: e => setEmail(e.target.value),
              appearance: appearance
            })]
          }), jsxRuntimeExports.jsx(Button, Object.assign({
            color: "primary",
            type: "submit",
            loading: loading,
            appearance: appearance
          }, {
            children: loading ? labels === null || labels === void 0 ? void 0 : labels.loading_button_label : labels === null || labels === void 0 ? void 0 : labels.button_label
          }))]
        })), showLinks && jsxRuntimeExports.jsx(Anchor, Object.assign({
          href: "#auth-sign-in",
          onClick: e => {
            e.preventDefault();
            setAuthView(VIEWS$1.SIGN_IN);
          },
          appearance: appearance
        }, {
          children: (_a = i18n === null || i18n === void 0 ? void 0 : i18n.sign_in) === null || _a === void 0 ? void 0 : _a.link_text
        })), message && jsxRuntimeExports.jsx(Message, Object.assign({
          appearance: appearance
        }, {
          children: message
        })), error && jsxRuntimeExports.jsx(Message, Object.assign({
          color: "danger",
          appearance: appearance
        }, {
          children: error
        }))]
      }))
    }));
  }

  const iconDefaultStyles = _({
    width: '21px',
    height: '21px'
  });
  const google = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    width: "512px",
    height: "512px"
  }, {
    children: [jsxRuntimeExports.jsx("path", {
      fill: "#FFC107",
      d: "M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#FF3D00",
      d: "M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#4CAF50",
      d: "M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#1976D2",
      d: "M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    })]
  }));
  const facebook = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    width: "512px",
    height: "512px"
  }, {
    children: [jsxRuntimeExports.jsx("path", {
      fill: "#039be5",
      d: "M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#fff",
      d: "M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
    })]
  }));
  const twitter = () => jsxRuntimeExports.jsx("svg", Object.assign({
    className: iconDefaultStyles(),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    width: "512px",
    height: "512px"
  }, {
    children: jsxRuntimeExports.jsx("path", {
      fill: "#03A9F4",
      d: "M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"
    })
  }));
  const apple = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    fill: "gray",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: "512px",
    height: "512px"
  }, {
    children: [' ', jsxRuntimeExports.jsx("path", {
      d: "M 15.904297 1.078125 C 15.843359 1.06875 15.774219 1.0746094 15.699219 1.0996094 C 14.699219 1.2996094 13.600391 1.8996094 12.900391 2.5996094 C 12.300391 3.1996094 11.800781 4.1996094 11.800781 5.0996094 C 11.800781 5.2996094 11.999219 5.5 12.199219 5.5 C 13.299219 5.4 14.399609 4.7996094 15.099609 4.0996094 C 15.699609 3.2996094 16.199219 2.4 16.199219 1.5 C 16.199219 1.275 16.087109 1.10625 15.904297 1.078125 z M 16.199219 5.4003906 C 14.399219 5.4003906 13.600391 6.5 12.400391 6.5 C 11.100391 6.5 9.9003906 5.5 8.4003906 5.5 C 6.3003906 5.5 3.0996094 7.4996094 3.0996094 12.099609 C 2.9996094 16.299609 6.8 21 9 21 C 10.3 21 10.600391 20.199219 12.400391 20.199219 C 14.200391 20.199219 14.600391 21 15.900391 21 C 17.400391 21 18.500391 19.399609 19.400391 18.099609 C 19.800391 17.399609 20.100391 17.000391 20.400391 16.400391 C 20.600391 16.000391 20.4 15.600391 20 15.400391 C 17.4 14.100391 16.900781 9.9003906 19.800781 8.4003906 C 20.300781 8.1003906 20.4 7.4992188 20 7.1992188 C 18.9 6.1992187 17.299219 5.4003906 16.199219 5.4003906 z"
    })]
  }));
  const github = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    fill: "gray",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 30 30",
    width: "512px",
    height: "512px"
  }, {
    children: [' ', jsxRuntimeExports.jsx("path", {
      d: "M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"
    })]
  }));
  const gitlab = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    width: "512px",
    height: "512px"
  }, {
    children: [jsxRuntimeExports.jsx("path", {
      fill: "#e53935",
      d: "M24 43L16 20 32 20z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#ff7043",
      d: "M24 43L42 20 32 20z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#e53935",
      d: "M37 5L42 20 32 20z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#ffa726",
      d: "M24 43L42 20 45 28z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#ff7043",
      d: "M24 43L6 20 16 20z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#e53935",
      d: "M11 5L6 20 16 20z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#ffa726",
      d: "M24 43L6 20 3 28z"
    })]
  }));
  const bitbucket = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    xmlns: "http://www.w3.org/2000/svg",
    width: "512",
    height: "512",
    viewBox: "0 0 62.42 62.42"
  }, {
    children: [jsxRuntimeExports.jsx("defs", {
      children: jsxRuntimeExports.jsxs("linearGradient", Object.assign({
        id: "New_Gradient_Swatch_1",
        x1: "64.01",
        y1: "30.27",
        x2: "32.99",
        y2: "54.48",
        gradientUnits: "userSpaceOnUse"
      }, {
        children: [jsxRuntimeExports.jsx("stop", {
          offset: "0.18",
          stopColor: "#0052cc"
        }), jsxRuntimeExports.jsx("stop", {
          offset: "1",
          stopColor: "#2684ff"
        })]
      }))
    }), jsxRuntimeExports.jsx("title", {
      children: "Bitbucket-blue"
    }), jsxRuntimeExports.jsx("g", Object.assign({
      id: "Layer_2",
      "data-name": "Layer 2"
    }, {
      children: jsxRuntimeExports.jsxs("g", Object.assign({
        id: "Blue",
        transform: "translate(0 -3.13)"
      }, {
        children: [jsxRuntimeExports.jsx("path", {
          d: "M2,6.26A2,2,0,0,0,0,8.58L8.49,60.12a2.72,2.72,0,0,0,2.66,2.27H51.88a2,2,0,0,0,2-1.68L62.37,8.59a2,2,0,0,0-2-2.32ZM37.75,43.51h-13L21.23,25.12H40.9Z",
          fill: "#2684ff"
        }), jsxRuntimeExports.jsx("path", {
          d: "M59.67,25.12H40.9L37.75,43.51h-13L9.4,61.73a2.71,2.71,0,0,0,1.75.66H51.89a2,2,0,0,0,2-1.68Z",
          fill: "url(#New_Gradient_Swatch_1)"
        })]
      }))
    }))]
  }));
  const discord = () => jsxRuntimeExports.jsx("svg", Object.assign({
    className: iconDefaultStyles(),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    width: "512px",
    height: "512px"
  }, {
    children: jsxRuntimeExports.jsx("path", {
      fill: "#536dfe",
      d: "M39.248,10.177c-2.804-1.287-5.812-2.235-8.956-2.778c-0.057-0.01-0.114,0.016-0.144,0.068\tc-0.387,0.688-0.815,1.585-1.115,2.291c-3.382-0.506-6.747-0.506-10.059,0c-0.3-0.721-0.744-1.603-1.133-2.291\tc-0.03-0.051-0.087-0.077-0.144-0.068c-3.143,0.541-6.15,1.489-8.956,2.778c-0.024,0.01-0.045,0.028-0.059,0.051\tc-5.704,8.522-7.267,16.835-6.5,25.044c0.003,0.04,0.026,0.079,0.057,0.103c3.763,2.764,7.409,4.442,10.987,5.554\tc0.057,0.017,0.118-0.003,0.154-0.051c0.846-1.156,1.601-2.374,2.248-3.656c0.038-0.075,0.002-0.164-0.076-0.194\tc-1.197-0.454-2.336-1.007-3.432-1.636c-0.087-0.051-0.094-0.175-0.014-0.234c0.231-0.173,0.461-0.353,0.682-0.534\tc0.04-0.033,0.095-0.04,0.142-0.019c7.201,3.288,14.997,3.288,22.113,0c0.047-0.023,0.102-0.016,0.144,0.017\tc0.22,0.182,0.451,0.363,0.683,0.536c0.08,0.059,0.075,0.183-0.012,0.234c-1.096,0.641-2.236,1.182-3.434,1.634\tc-0.078,0.03-0.113,0.12-0.075,0.196c0.661,1.28,1.415,2.498,2.246,3.654c0.035,0.049,0.097,0.07,0.154,0.052\tc3.595-1.112,7.241-2.79,11.004-5.554c0.033-0.024,0.054-0.061,0.057-0.101c0.917-9.491-1.537-17.735-6.505-25.044\tC39.293,10.205,39.272,10.187,39.248,10.177z M16.703,30.273c-2.168,0-3.954-1.99-3.954-4.435s1.752-4.435,3.954-4.435\tc2.22,0,3.989,2.008,3.954,4.435C20.658,28.282,18.906,30.273,16.703,30.273z M31.324,30.273c-2.168,0-3.954-1.99-3.954-4.435\ts1.752-4.435,3.954-4.435c2.22,0,3.989,2.008,3.954,4.435C35.278,28.282,33.544,30.273,31.324,30.273z"
    })
  }));
  const azure = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    width: "512px",
    height: "512px"
  }, {
    children: [jsxRuntimeExports.jsxs("linearGradient", Object.assign({
      id: "k8yl7~hDat~FaoWq8WjN6a",
      x1: "-1254.397",
      x2: "-1261.911",
      y1: "877.268",
      y2: "899.466",
      gradientTransform: "translate(1981.75 -1362.063) scale(1.5625)",
      gradientUnits: "userSpaceOnUse"
    }, {
      children: [jsxRuntimeExports.jsx("stop", {
        offset: "0",
        stopColor: "#114a8b"
      }), jsxRuntimeExports.jsx("stop", {
        offset: "1",
        stopColor: "#0669bc"
      })]
    })), jsxRuntimeExports.jsx("path", {
      fill: "url(#k8yl7~hDat~FaoWq8WjN6a)",
      d: "M17.634,6h11.305L17.203,40.773c-0.247,0.733-0.934,1.226-1.708,1.226H6.697 c-0.994,0-1.8-0.806-1.8-1.8c0-0.196,0.032-0.39,0.094-0.576L15.926,7.227C16.173,6.494,16.86,6,17.634,6L17.634,6z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#0078d4",
      d: "M34.062,29.324H16.135c-0.458-0.001-0.83,0.371-0.831,0.829c0,0.231,0.095,0.451,0.264,0.608 l11.52,10.752C27.423,41.826,27.865,42,28.324,42h10.151L34.062,29.324z"
    }), jsxRuntimeExports.jsxs("linearGradient", Object.assign({
      id: "k8yl7~hDat~FaoWq8WjN6b",
      x1: "-1252.05",
      x2: "-1253.788",
      y1: "887.612",
      y2: "888.2",
      gradientTransform: "translate(1981.75 -1362.063) scale(1.5625)",
      gradientUnits: "userSpaceOnUse"
    }, {
      children: [jsxRuntimeExports.jsx("stop", {
        offset: "0",
        stopOpacity: ".3"
      }), jsxRuntimeExports.jsx("stop", {
        offset: ".071",
        stopOpacity: ".2"
      }), jsxRuntimeExports.jsx("stop", {
        offset: ".321",
        stopOpacity: ".1"
      }), jsxRuntimeExports.jsx("stop", {
        offset: ".623",
        stopOpacity: ".05"
      }), jsxRuntimeExports.jsx("stop", {
        offset: "1",
        stopOpacity: "0"
      })]
    })), jsxRuntimeExports.jsx("path", {
      fill: "url(#k8yl7~hDat~FaoWq8WjN6b)",
      d: "M17.634,6c-0.783-0.003-1.476,0.504-1.712,1.25L5.005,39.595 c-0.335,0.934,0.151,1.964,1.085,2.299C6.286,41.964,6.493,42,6.702,42h9.026c0.684-0.122,1.25-0.603,1.481-1.259l2.177-6.416 l7.776,7.253c0.326,0.27,0.735,0.419,1.158,0.422h10.114l-4.436-12.676l-12.931,0.003L28.98,6H17.634z"
    }), jsxRuntimeExports.jsxs("linearGradient", Object.assign({
      id: "k8yl7~hDat~FaoWq8WjN6c",
      x1: "-1252.952",
      x2: "-1244.704",
      y1: "876.6",
      y2: "898.575",
      gradientTransform: "translate(1981.75 -1362.063) scale(1.5625)",
      gradientUnits: "userSpaceOnUse"
    }, {
      children: [jsxRuntimeExports.jsx("stop", {
        offset: "0",
        stopColor: "#3ccbf4"
      }), jsxRuntimeExports.jsx("stop", {
        offset: "1",
        stopColor: "#2892df"
      })]
    })), jsxRuntimeExports.jsx("path", {
      fill: "url(#k8yl7~hDat~FaoWq8WjN6c)",
      d: "M32.074,7.225C31.827,6.493,31.141,6,30.368,6h-12.6c0.772,0,1.459,0.493,1.705,1.224 l10.935,32.399c0.318,0.942-0.188,1.963-1.13,2.281C29.093,41.968,28.899,42,28.703,42h12.6c0.994,0,1.8-0.806,1.8-1.801 c0-0.196-0.032-0.39-0.095-0.575L32.074,7.225z"
    })]
  }));
  const keycloak = () => jsxRuntimeExports.jsx("svg", Object.assign({
    className: iconDefaultStyles(),
    width: "512",
    height: "512",
    viewBox: "0 0 512 512",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, {
    children: jsxRuntimeExports.jsx("path", {
      d: "M472.136 163.959H408.584C407.401 163.959 406.218 163.327 405.666 162.3L354.651 73.6591C354.02 72.632 352.916 72 351.654 72H143.492C142.309 72 141.126 72.632 140.574 73.6591L87.5084 165.618L36.414 254.259C35.862 255.286 35.862 256.55 36.414 257.656L87.5084 346.297L140.495 438.335C141.047 439.362 142.23 440.073 143.413 439.994H351.654C352.837 439.994 354.02 439.362 354.651 438.335L405.745 349.694C406.297 348.667 407.48 347.956 408.663 348.035H472.215C474.344 348.035 476 346.297 476 344.243V167.83C475.921 165.697 474.186 163.959 472.136 163.959ZM228.728 349.694L212.721 377.345C212.485 377.74 212.091 378.135 211.696 378.372C211.223 378.609 210.75 378.767 210.198 378.767H178.422C177.318 378.767 176.293 378.214 175.82 377.187L128.431 294.787L123.779 286.65L106.748 257.498C106.511 257.103 106.353 256.629 106.432 256.076C106.432 255.602 106.59 255.049 106.827 254.654L123.937 224.949L175.899 134.886C176.451 133.938 177.476 133.306 178.501 133.306H210.198C210.75 133.306 211.302 133.464 211.854 133.701C212.248 133.938 212.643 134.254 212.879 134.728L228.886 162.537C229.359 163.485 229.28 164.67 228.728 165.539L177.397 254.654C177.16 255.049 177.081 255.523 177.081 255.918C177.081 256.392 177.239 256.787 177.397 257.182L228.728 346.218C229.438 347.403 229.359 348.667 228.728 349.694V349.694ZM388.083 257.498L371.051 286.65L366.399 294.787L319.011 377.187C318.459 378.135 317.512 378.767 316.409 378.767H284.632C284.08 378.767 283.607 378.609 283.134 378.372C282.74 378.135 282.346 377.819 282.109 377.345L266.103 349.694C265.393 348.667 265.393 347.403 266.024 346.376L317.355 257.34C317.591 256.945 317.67 256.471 317.67 256.076C317.67 255.602 317.513 255.207 317.355 254.812L266.024 165.697C265.472 164.749 265.393 163.643 265.866 162.695L281.873 134.886C282.109 134.491 282.503 134.096 282.898 133.859C283.371 133.543 283.923 133.464 284.553 133.464H316.409C317.512 133.464 318.538 134.017 319.011 135.044L370.972 225.107L388.083 254.812C388.319 255.286 388.477 255.76 388.477 256.234C388.477 256.55 388.319 257.024 388.083 257.498V257.498Z",
      fill: "#008AAA"
    })
  }));
  const linkedin = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    width: "512px",
    height: "512px"
  }, {
    children: [jsxRuntimeExports.jsx("path", {
      fill: "#0288D1",
      d: "M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#FFF",
      d: "M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
    })]
  }));
  const notion = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    width: "512px",
    height: "512px",
    fillRule: "evenodd",
    clipRule: "evenodd"
  }, {
    children: [jsxRuntimeExports.jsx("path", {
      fill: "#fff",
      fillRule: "evenodd",
      d: "M11.553,11.099c1.232,1.001,1.694,0.925,4.008,0.77 l21.812-1.31c0.463,0,0.078-0.461-0.076-0.538l-3.622-2.619c-0.694-0.539-1.619-1.156-3.391-1.002l-21.12,1.54 c-0.77,0.076-0.924,0.461-0.617,0.77L11.553,11.099z",
      clipRule: "evenodd"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#fff",
      fillRule: "evenodd",
      d: "M12.862,16.182v22.95c0,1.233,0.616,1.695,2.004,1.619 l23.971-1.387c1.388-0.076,1.543-0.925,1.543-1.927V14.641c0-1-0.385-1.54-1.234-1.463l-25.05,1.463 C13.171,14.718,12.862,15.181,12.862,16.182L12.862,16.182z",
      clipRule: "evenodd"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#424242",
      fillRule: "evenodd",
      d: "M11.553,11.099c1.232,1.001,1.694,0.925,4.008,0.77 l21.812-1.31c0.463,0,0.078-0.461-0.076-0.538l-3.622-2.619c-0.694-0.539-1.619-1.156-3.391-1.002l-21.12,1.54 c-0.77,0.076-0.924,0.461-0.617,0.77L11.553,11.099z M12.862,16.182v22.95c0,1.233,0.616,1.695,2.004,1.619l23.971-1.387 c1.388-0.076,1.543-0.925,1.543-1.927V14.641c0-1-0.385-1.54-1.234-1.463l-25.05,1.463C13.171,14.718,12.862,15.181,12.862,16.182 L12.862,16.182z M36.526,17.413c0.154,0.694,0,1.387-0.695,1.465l-1.155,0.23v16.943c-1.003,0.539-1.928,0.847-2.698,0.847 c-1.234,0-1.543-0.385-2.467-1.54l-7.555-11.86v11.475l2.391,0.539c0,0,0,1.386-1.929,1.386l-5.317,0.308 c-0.154-0.308,0-1.078,0.539-1.232l1.388-0.385V20.418l-1.927-0.154c-0.155-0.694,0.23-1.694,1.31-1.772l5.704-0.385l7.862,12.015 V19.493l-2.005-0.23c-0.154-0.848,0.462-1.464,1.233-1.54L36.526,17.413z M7.389,5.862l21.968-1.618 c2.698-0.231,3.392-0.076,5.087,1.155l7.013,4.929C42.614,11.176,43,11.407,43,12.33v27.032c0,1.694-0.617,2.696-2.775,2.849 l-25.512,1.541c-1.62,0.077-2.391-0.154-3.239-1.232l-5.164-6.7C5.385,34.587,5,33.664,5,32.585V8.556 C5,7.171,5.617,6.015,7.389,5.862z",
      clipRule: "evenodd"
    })]
  }));
  const slack = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 48 48",
    width: "512px",
    height: "512px"
  }, {
    children: [jsxRuntimeExports.jsx("path", {
      fill: "#33d375",
      d: "M33,8c0-2.209-1.791-4-4-4s-4,1.791-4,4c0,1.254,0,9.741,0,11c0,2.209,1.791,4,4,4s4-1.791,4-4\tC33,17.741,33,9.254,33,8z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#33d375",
      d: "M43,19c0,2.209-1.791,4-4,4c-1.195,0-4,0-4,0s0-2.986,0-4c0-2.209,1.791-4,4-4S43,16.791,43,19z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#40c4ff",
      d: "M8,14c-2.209,0-4,1.791-4,4s1.791,4,4,4c1.254,0,9.741,0,11,0c2.209,0,4-1.791,4-4s-1.791-4-4-4\tC17.741,14,9.254,14,8,14z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#40c4ff",
      d: "M19,4c2.209,0,4,1.791,4,4c0,1.195,0,4,0,4s-2.986,0-4,0c-2.209,0-4-1.791-4-4S16.791,4,19,4z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#e91e63",
      d: "M14,39.006C14,41.212,15.791,43,18,43s4-1.788,4-3.994c0-1.252,0-9.727,0-10.984\tc0-2.206-1.791-3.994-4-3.994s-4,1.788-4,3.994C14,29.279,14,37.754,14,39.006z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#e91e63",
      d: "M4,28.022c0-2.206,1.791-3.994,4-3.994c1.195,0,4,0,4,0s0,2.981,0,3.994c0,2.206-1.791,3.994-4,3.994\tS4,30.228,4,28.022z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#ffc107",
      d: "M39,33c2.209,0,4-1.791,4-4s-1.791-4-4-4c-1.254,0-9.741,0-11,0c-2.209,0-4,1.791-4,4s1.791,4,4,4\tC29.258,33,37.746,33,39,33z"
    }), jsxRuntimeExports.jsx("path", {
      fill: "#ffc107",
      d: "M28,43c-2.209,0-4-1.791-4-4c0-1.195,0-4,0-4s2.986,0,4,0c2.209,0,4,1.791,4,4S30.209,43,28,43z"
    })]
  }));
  const spotify = () => jsxRuntimeExports.jsx("svg", Object.assign({
    className: iconDefaultStyles(),
    width: "512",
    height: "512",
    viewBox: "0 0 512 512",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, {
    children: jsxRuntimeExports.jsx("path", {
      d: "M255.498 31.0034C131.513 31.0034 31 131.515 31 255.502C31 379.492 131.513 480 255.498 480C379.497 480 480 379.495 480 255.502C480 131.522 379.497 31.0135 255.495 31.0135L255.498 31V31.0034ZM358.453 354.798C354.432 361.391 345.801 363.486 339.204 359.435C286.496 327.237 220.139 319.947 141.993 337.801C134.463 339.516 126.957 334.798 125.24 327.264C123.516 319.731 128.217 312.225 135.767 310.511C221.284 290.972 294.639 299.384 353.816 335.549C360.413 339.596 362.504 348.2 358.453 354.798ZM385.932 293.67C380.864 301.903 370.088 304.503 361.858 299.438C301.512 262.345 209.528 251.602 138.151 273.272C128.893 276.067 119.118 270.851 116.309 261.61C113.521 252.353 118.74 242.597 127.981 239.782C209.512 215.044 310.87 227.026 380.17 269.612C388.4 274.68 391 285.456 385.935 293.676V293.673L385.932 293.67ZM388.293 230.016C315.935 187.039 196.56 183.089 127.479 204.055C116.387 207.42 104.654 201.159 101.293 190.063C97.9326 178.964 104.189 167.241 115.289 163.87C194.59 139.796 326.418 144.446 409.723 193.902C419.722 199.826 422.995 212.71 417.068 222.675C411.168 232.653 398.247 235.943 388.303 230.016H388.293V230.016Z",
      fill: "#1ED760"
    })
  }));
  const twitch = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    width: "512",
    height: "512",
    viewBox: "0 0 512 512",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, {
    children: [jsxRuntimeExports.jsx("path", {
      d: "M416 240L352 304H288L232 360V304H160V64H416V240Z",
      fill: "white"
    }), jsxRuntimeExports.jsx("path", {
      d: "M144 32L64 112V400H160V480L240 400H304L448 256V32H144ZM416 240L352 304H288L232 360V304H160V64H416V240Z",
      fill: "#9146FF"
    }), jsxRuntimeExports.jsx("path", {
      d: "M368 120H336V216H368V120Z",
      fill: "#9146FF"
    }), jsxRuntimeExports.jsx("path", {
      d: "M280 120H248V216H280V120Z",
      fill: "#9146FF"
    })]
  }));
  const workos = () => jsxRuntimeExports.jsxs("svg", Object.assign({
    className: iconDefaultStyles(),
    width: "512",
    height: "512",
    viewBox: "0 0 512 512",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, {
    children: [jsxRuntimeExports.jsx("path", {
      d: "M33 256.043C33 264.556 35.3159 273.069 39.4845 280.202L117.993 415.493C126.098 429.298 138.373 440.572 153.657 445.634C183.764 455.528 214.797 442.873 229.618 417.333L248.609 384.661L173.806 256.043L252.777 119.831L271.768 87.1591C277.557 77.2654 284.968 69.4424 294 63H285.894H172.185C150.878 63 131.193 74.2742 120.54 92.6812L39.7161 231.884C35.3159 239.016 33 247.53 33 256.043Z",
      fill: "#6363F1"
    }), jsxRuntimeExports.jsx("path", {
      d: "M480 256.058C480 247.539 477.684 239.021 473.516 231.883L393.849 94.6596C379.028 69.3331 347.995 56.4396 317.888 66.34C302.603 71.4053 290.329 82.6871 282.224 96.5015L264.391 127.354L339.194 256.058L260.223 392.131L241.232 424.825C235.443 434.495 228.032 442.553 219 449H227.106H340.815C362.122 449 381.807 437.718 392.46 419.299L473.284 280.003C477.684 272.866 480 264.577 480 256.058Z",
      fill: "#6363F1"
    })]
  }));

  var Icons = /*#__PURE__*/Object.freeze({
    __proto__: null,
    apple: apple,
    azure: azure,
    bitbucket: bitbucket,
    discord: discord,
    facebook: facebook,
    github: github,
    gitlab: gitlab,
    google: google,
    keycloak: keycloak,
    linkedin: linkedin,
    notion: notion,
    slack: slack,
    spotify: spotify,
    twitch: twitch,
    twitter: twitter,
    workos: workos
  });

  function SocialAuth(_ref) {
    let {
      supabaseClient,
      socialLayout = 'vertical',
      providers,
      redirectTo,
      onlyThirdPartyProviders,
      view,
      i18n,
      appearance
    } = _ref;
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const verticalSocialLayout = socialLayout === 'vertical' ? true : false;

    const handleProviderSignIn = provider => __awaiter(this, void 0, void 0, function* () {
      setLoading(true);
      const {
        error
      } = yield supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo
        }
      });
      if (error) setError(error.message);
      setLoading(false);
    });

    function capitalize(word) {
      const lower = word.toLowerCase();
      return word.charAt(0).toUpperCase() + lower.slice(1);
    }

    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
      children: providers && providers.length > 0 && jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
        children: [jsxRuntimeExports.jsx(Container, Object.assign({
          gap: "large",
          direction: "vertical",
          appearance: appearance
        }, {
          children: jsxRuntimeExports.jsx(Container, Object.assign({
            direction: verticalSocialLayout ? 'vertical' : 'horizontal',
            gap: verticalSocialLayout ? 'small' : 'medium',
            appearance: appearance
          }, {
            children: providers.map(provider => {
              var _a;

              const AuthIcon = Icons[provider];
              return jsxRuntimeExports.jsx(Button, Object.assign({
                color: "default",
                icon: AuthIcon ? jsxRuntimeExports.jsx(AuthIcon, {}) : '',
                loading: loading,
                onClick: () => handleProviderSignIn(provider),
                appearance: appearance
              }, {
                children: verticalSocialLayout && ((_a = i18n[view]) === null || _a === void 0 ? void 0 : _a.social_provider_text) + ' ' + capitalize(provider)
              }), provider);
            })
          }))
        })), !onlyThirdPartyProviders && jsxRuntimeExports.jsx(Divider, {
          appearance: appearance
        })]
      })
    });
  }

  const VIEWS = {
    SIGN_IN: 'sign_in',
    SIGN_UP: 'sign_up',
    FORGOTTEN_PASSWORD: 'forgotten_password',
    MAGIC_LINK: 'magic_link',
    UPDATE_PASSWORD: 'update_password'
  };

  function EmailAuth(_ref) {
    let {
      authView = 'sign_in',
      defaultEmail,
      defaultPassword,
      setAuthView,
      setDefaultEmail,
      setDefaultPassword,
      supabaseClient,
      showLinks = true,
      redirectTo,
      magicLink,
      i18n,
      appearance
    } = _ref;

    var _a, _b, _c, _d;

    const isMounted = React.useRef(true);
    const [email, setEmail] = React.useState(defaultEmail);
    const [password, setPassword] = React.useState(defaultPassword);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');
    React.useEffect(() => {
      isMounted.current = true;
      setEmail(defaultEmail);
      setPassword(defaultPassword);
      return () => {
        isMounted.current = false;
      };
    }, [authView]);

    const handleSubmit = e => __awaiter(this, void 0, void 0, function* () {
      var _e;

      e.preventDefault();
      setError('');
      setLoading(true);

      switch (authView) {
        case 'sign_in':
          const {
            error: signInError
          } = yield supabaseClient.auth.signInWithPassword({
            email,
            password
          });
          if (signInError) setError(signInError.message);
          break;

        case 'sign_up':
          const {
            data: {
              user: signUpUser,
              session: signUpSession
            },
            error: signUpError
          } = yield supabaseClient.auth.signUp({
            email,
            password
          });
          if (signUpError) setError(signUpError.message); // Check if session is null -> email confirmation setting is turned on
          else if (signUpUser && !signUpSession) setMessage(((_e = i18n === null || i18n === void 0 ? void 0 : i18n.sign_up) === null || _e === void 0 ? void 0 : _e.confirmation_text) || 'Check your email for the confirmation link.');
          break;
      }
      /*
       * it is possible the auth component may have been unmounted at this point
       * check if component is mounted before setting a useState
       */


      if (isMounted.current) setLoading(false);
    });

    const handleViewChange = newView => {
      setDefaultEmail(email);
      setDefaultPassword(password);
      setAuthView(newView);
    };

    const labels = i18n === null || i18n === void 0 ? void 0 : i18n[authView];
    return jsxRuntimeExports.jsxs("form", Object.assign({
      id: authView === 'sign_in' ? `auth-sign-in` : `auth-sign-up`,
      onSubmit: handleSubmit,
      autoComplete: 'on',
      style: {
        width: '100%'
      }
    }, {
      children: [jsxRuntimeExports.jsxs(Container, Object.assign({
        direction: "vertical",
        gap: "large",
        appearance: appearance
      }, {
        children: [jsxRuntimeExports.jsxs(Container, Object.assign({
          direction: "vertical",
          gap: "large",
          appearance: appearance
        }, {
          children: [jsxRuntimeExports.jsxs("div", {
            children: [jsxRuntimeExports.jsx(Label, Object.assign({
              htmlFor: "email",
              appearance: appearance
            }, {
              children: labels === null || labels === void 0 ? void 0 : labels.email_label
            })), jsxRuntimeExports.jsx(Input, {
              type: "email",
              name: "email",
              placeholder: labels === null || labels === void 0 ? void 0 : labels.email_input_placeholder,
              defaultValue: email,
              onChange: e => setEmail(e.target.value),
              autoComplete: "email",
              appearance: appearance
            })]
          }), jsxRuntimeExports.jsxs("div", {
            children: [jsxRuntimeExports.jsx(Label, Object.assign({
              htmlFor: "password",
              appearance: appearance
            }, {
              children: labels === null || labels === void 0 ? void 0 : labels.password_label
            })), jsxRuntimeExports.jsx(Input, {
              type: "password",
              name: "password",
              placeholder: labels === null || labels === void 0 ? void 0 : labels.password_input_placeholder,
              defaultValue: password,
              onChange: e => setPassword(e.target.value),
              autoComplete: authView === 'sign_in' ? 'current-password' : 'new-password',
              appearance: appearance
            })]
          })]
        })), jsxRuntimeExports.jsx(Button, Object.assign({
          type: "submit",
          color: "primary",
          loading: loading,
          appearance: appearance
        }, {
          children: loading ? labels === null || labels === void 0 ? void 0 : labels.loading_button_label : labels === null || labels === void 0 ? void 0 : labels.button_label
        })), showLinks && jsxRuntimeExports.jsxs(Container, Object.assign({
          direction: "vertical",
          gap: "small",
          appearance: appearance
        }, {
          children: [authView === VIEWS.SIGN_IN && magicLink && jsxRuntimeExports.jsx(Anchor, Object.assign({
            href: "#auth-magic-link",
            onClick: e => {
              e.preventDefault();
              setAuthView(VIEWS.MAGIC_LINK);
            },
            appearance: appearance
          }, {
            children: (_a = i18n === null || i18n === void 0 ? void 0 : i18n.magic_link) === null || _a === void 0 ? void 0 : _a.link_text
          })), authView === VIEWS.SIGN_IN && jsxRuntimeExports.jsx(Anchor, Object.assign({
            href: "#auth-forgot-password",
            onClick: e => {
              e.preventDefault();
              setAuthView(VIEWS.FORGOTTEN_PASSWORD);
            },
            appearance: appearance
          }, {
            children: (_b = i18n === null || i18n === void 0 ? void 0 : i18n.forgotten_password) === null || _b === void 0 ? void 0 : _b.link_text
          })), authView === VIEWS.SIGN_IN ? jsxRuntimeExports.jsx(Anchor, Object.assign({
            href: "#auth-sign-up",
            onClick: e => {
              e.preventDefault();
              handleViewChange(VIEWS.SIGN_UP);
            },
            appearance: appearance
          }, {
            children: (_c = i18n === null || i18n === void 0 ? void 0 : i18n.sign_up) === null || _c === void 0 ? void 0 : _c.link_text
          })) : jsxRuntimeExports.jsx(Anchor, Object.assign({
            href: "#auth-sign-in",
            onClick: e => {
              e.preventDefault();
              handleViewChange(VIEWS.SIGN_IN);
            },
            appearance: appearance
          }, {
            children: (_d = i18n === null || i18n === void 0 ? void 0 : i18n.sign_in) === null || _d === void 0 ? void 0 : _d.link_text
          }))]
        }))]
      })), message && jsxRuntimeExports.jsx(Message, Object.assign({
        appearance: appearance
      }, {
        children: message
      })), error && jsxRuntimeExports.jsx(Message, Object.assign({
        color: "danger",
        appearance: appearance
      }, {
        children: error
      }))]
    }));
  }

  function ForgottenPassword(_ref) {
    let {
      setAuthView,
      supabaseClient,
      redirectTo,
      i18n,
      appearance,
      showLinks
    } = _ref;

    var _a;

    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handlePasswordReset = e => __awaiter(this, void 0, void 0, function* () {
      e.preventDefault();
      setError('');
      setMessage('');
      setLoading(true);
      const {
        error
      } = yield supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo
      });
      if (error) setError(error.message);else setMessage('Check your email for the password reset link');
      setLoading(false);
    });

    const labels = i18n === null || i18n === void 0 ? void 0 : i18n.forgotten_password;
    return jsxRuntimeExports.jsx("form", Object.assign({
      id: "auth-forgot-password",
      onSubmit: handlePasswordReset
    }, {
      children: jsxRuntimeExports.jsxs(Container, Object.assign({
        gap: "large",
        direction: "vertical",
        appearance: appearance
      }, {
        children: [jsxRuntimeExports.jsxs(Container, Object.assign({
          gap: "large",
          direction: "vertical",
          appearance: appearance
        }, {
          children: [jsxRuntimeExports.jsxs("div", {
            children: [jsxRuntimeExports.jsx(Label, Object.assign({
              htmlFor: "email",
              appearance: appearance
            }, {
              children: labels === null || labels === void 0 ? void 0 : labels.email_label
            })), jsxRuntimeExports.jsx(Input, {
              name: "email",
              type: "email",
              placeholder: labels === null || labels === void 0 ? void 0 : labels.email_input_placeholder,
              onChange: e => setEmail(e.target.value),
              appearance: appearance
            })]
          }), jsxRuntimeExports.jsx(Button, Object.assign({
            type: "submit",
            color: "primary",
            loading: loading,
            appearance: appearance
          }, {
            children: loading ? labels === null || labels === void 0 ? void 0 : labels.loading_button_label : labels === null || labels === void 0 ? void 0 : labels.button_label
          }))]
        })), showLinks && jsxRuntimeExports.jsx(Anchor, Object.assign({
          href: "#auth-sign-in",
          onClick: e => {
            e.preventDefault();
            setAuthView(VIEWS$1.SIGN_IN);
          },
          appearance: appearance
        }, {
          children: (_a = i18n === null || i18n === void 0 ? void 0 : i18n.sign_in) === null || _a === void 0 ? void 0 : _a.link_text
        })), message && jsxRuntimeExports.jsx(Message, Object.assign({
          appearance: appearance
        }, {
          children: message
        })), error && jsxRuntimeExports.jsx(Message, Object.assign({
          color: "danger",
          appearance: appearance
        }, {
          children: error
        }))]
      }))
    }));
  }

  function UpdatePassword(_ref) {
    let {
      supabaseClient,
      i18n,
      appearance
    } = _ref;
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handlePasswordReset = e => __awaiter(this, void 0, void 0, function* () {
      e.preventDefault();
      setError('');
      setMessage('');
      setLoading(true);
      const {
        error
      } = yield supabaseClient.auth.updateUser({
        password
      });
      if (error) setError(error.message);else setMessage('Your password has been updated');
      setLoading(false);
    });

    const labels = i18n === null || i18n === void 0 ? void 0 : i18n.update_password;
    return jsxRuntimeExports.jsx("form", Object.assign({
      id: "auth-update-password",
      onSubmit: handlePasswordReset
    }, {
      children: jsxRuntimeExports.jsxs(Container, Object.assign({
        gap: "large",
        direction: 'vertical',
        appearance: appearance
      }, {
        children: [jsxRuntimeExports.jsxs(Container, Object.assign({
          gap: "large",
          direction: "vertical",
          appearance: appearance
        }, {
          children: [jsxRuntimeExports.jsxs("div", {
            children: [jsxRuntimeExports.jsx(Label, Object.assign({
              htmlFor: "password",
              appearance: appearance
            }, {
              children: labels === null || labels === void 0 ? void 0 : labels.password_label
            })), jsxRuntimeExports.jsx(Input, {
              name: "password",
              placeholder: labels === null || labels === void 0 ? void 0 : labels.password_label,
              type: "password",
              onChange: e => setPassword(e.target.value),
              appearance: appearance
            })]
          }), jsxRuntimeExports.jsx(Button, Object.assign({
            type: "submit",
            color: "primary",
            loading: loading,
            appearance: appearance
          }, {
            children: loading ? labels === null || labels === void 0 ? void 0 : labels.loading_button_label : labels === null || labels === void 0 ? void 0 : labels.button_label
          }))]
        })), message && jsxRuntimeExports.jsx(Message, Object.assign({
          appearance: appearance
        }, {
          children: message
        })), error && jsxRuntimeExports.jsx(Message, Object.assign({
          color: "danger",
          appearance: appearance
        }, {
          children: error
        }))]
      }))
    }));
  }

  const UserContext = /*#__PURE__*/React.createContext({
    user: null,
    session: null
  });
  const UserContextProvider = props => {
    var _a;

    const {
      supabaseClient
    } = props;
    const [session, setSession] = React.useState(null);
    const [user, setUser] = React.useState((_a = session === null || session === void 0 ? void 0 : session.user) !== null && _a !== void 0 ? _a : null);
    React.useEffect(() => {

      (() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;

        const {
          data
        } = yield supabaseClient.auth.getSession();
        setSession(data.session);
        setUser((_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.user) !== null && _b !== void 0 ? _b : null);
      }))();

      const {
        data: authListener
      } = supabaseClient.auth.onAuthStateChange((event, session) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;

        setSession(session);
        setUser((_c = session === null || session === void 0 ? void 0 : session.user) !== null && _c !== void 0 ? _c : null);
      }));
      return () => {
        authListener === null || authListener === void 0 ? void 0 : authListener.subscription.unsubscribe();
      }; // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const value = {
      session,
      user
    };
    return jsxRuntimeExports.jsx(UserContext.Provider, Object.assign({
      value: value
    }, props));
  };
  const useUser = () => {
    const context = React.useContext(UserContext);

    if (context === undefined) {
      throw new Error(`useUser must be used within a UserContextProvider.`);
    }

    return context;
  };

  var sign_up$3 = {
  	email_label: "E-Mail Adresse",
  	password_label: "Passwort erstellen",
  	email_input_placeholder: "Ihre E-Mail Adresse",
  	password_input_placeholder: "Ihr Passwort",
  	button_label: "Registrieren",
  	loading_button_label: "Registrieren ...",
  	social_provider_text: "Anmelden mit",
  	link_text: "Haben Sie noch kein Konto? Registrieren"
  };
  var sign_in$3 = {
  	email_label: "E-Mail Adresse",
  	password_label: "Passwort erstellen",
  	email_input_placeholder: "Ihre E-Mail Adresse",
  	password_input_placeholder: "Ihr Passwort",
  	button_label: "Anmelden",
  	loading_button_label: "Anmelden ...",
  	social_provider_text: "Anmelden mit",
  	link_text: "Haben Sie bereits ein Konto? Anmelden"
  };
  var magic_link$3 = {
  	email_input_label: "E-Mail Adresse",
  	email_input_placeholder: "Ihre E-Mail Adresse",
  	button_label: "Magischen Link senden",
  	loading_button_label: "Magischen Link senden ...",
  	link_text: "Einen magischen Link per E-Mail versenden"
  };
  var forgotten_password$3 = {
  	email_label: "E-Mail Adresse",
  	password_label: "Ihr Passwort",
  	email_input_placeholder: "Ihre E-Mail Adresse",
  	button_label: "Anweisungen zum Zurücksetzen des Passworts senden",
  	loading_button_label: "Anweisungen zum Zurücksetzen senden ...",
  	link_text: "Passwort vergessen?"
  };
  var update_password$3 = {
  	password_label: "Neues Passwort",
  	password_input_placeholder: "Ihr neues Passwort",
  	button_label: "Passwort aktualisieren",
  	loading_button_label: "Passwort aktualisieren ..."
  };
  var de_formal = {
  	sign_up: sign_up$3,
  	sign_in: sign_in$3,
  	magic_link: magic_link$3,
  	forgotten_password: forgotten_password$3,
  	update_password: update_password$3
  };

  var sign_up$2 = {
  	email_label: "E-Mail Adresse",
  	password_label: "Passwort erstellen",
  	email_input_placeholder: "Deine E-Mail Adresse",
  	password_input_placeholder: "Dein Passwort",
  	button_label: "Registrieren",
  	loading_button_label: "Registrieren ...",
  	social_provider_text: "Anmelden mit",
  	link_text: "Hast du noch kein Konto? Registrieren"
  };
  var sign_in$2 = {
  	email_label: "E-Mail Adresse",
  	password_label: "Passwort erstellen",
  	email_input_placeholder: "Deine E-Mail Adresse",
  	password_input_placeholder: "Dein Passwort",
  	button_label: "Anmelden",
  	loading_button_label: "Anmelden ...",
  	social_provider_text: "Anmelden mit",
  	link_text: "Hast du bereits ein Konto? Anmelden"
  };
  var magic_link$2 = {
  	email_input_label: "E-Mail Adresse",
  	email_input_placeholder: "Deine E-Mail Adresse",
  	button_label: "Magischen Link senden",
  	loading_button_label: "Magischen Link senden ...",
  	link_text: "Einen magischen Link per E-Mail versenden"
  };
  var forgotten_password$2 = {
  	email_label: "E-Mail Adresse",
  	password_label: "Dein Passwort",
  	email_input_placeholder: "Deine E-Mail Adresse",
  	button_label: "Anweisungen zum Zurücksetzen des Passworts senden",
  	loading_button_label: "Anweisungen zum Zurücksetzen senden ...",
  	link_text: "Passwort vergessen?"
  };
  var update_password$2 = {
  	password_label: "Neues Passwort",
  	password_input_placeholder: "Dein neues Passwort",
  	button_label: "Passwort aktualisieren",
  	loading_button_label: "Passwort aktualisieren ..."
  };
  var de_informal = {
  	sign_up: sign_up$2,
  	sign_in: sign_in$2,
  	magic_link: magic_link$2,
  	forgotten_password: forgotten_password$2,
  	update_password: update_password$2
  };

  var sign_up$1 = {
  	email_label: "Email address",
  	password_label: "Create a Password",
  	email_input_placeholder: "Your email address",
  	password_input_placeholder: "Your password",
  	button_label: "Sign up",
  	loading_button_label: "Signing up ...",
  	social_provider_text: "Sign in with",
  	link_text: "Don't have an account? Sign up",
  	confirmation_text: "Check your email for the confirmation link"
  };
  var sign_in$1 = {
  	email_label: "Email address",
  	password_label: "Your Password",
  	email_input_placeholder: "Your email address",
  	password_input_placeholder: "Your password",
  	button_label: "Sign in",
  	loading_button_label: "Signing in ...",
  	social_provider_text: "Sign in with",
  	link_text: "Already have an account? Sign in"
  };
  var magic_link$1 = {
  	email_input_label: "Email address",
  	email_input_placeholder: "Your email address",
  	button_label: "Send Magic Link",
  	loading_button_label: "Sending Magic Link ...",
  	link_text: "Send a magic link email"
  };
  var forgotten_password$1 = {
  	email_label: "Email address",
  	password_label: "Your Password",
  	email_input_placeholder: "Your email address",
  	button_label: "Send reset password instructions",
  	loading_button_label: "Sending reset instructions ...",
  	link_text: "Forgot your password?"
  };
  var update_password$1 = {
  	password_label: "New password",
  	password_input_placeholder: "Your new password",
  	button_label: "Update password",
  	loading_button_label: "Updating password ..."
  };
  var en = {
  	sign_up: sign_up$1,
  	sign_in: sign_in$1,
  	magic_link: magic_link$1,
  	forgotten_password: forgotten_password$1,
  	update_password: update_password$1
  };

  var sign_up = {
  	email_label: "電子メールアドレス",
  	password_label: "パスワードを作成",
  	email_input_placeholder: "Your email address",
  	password_input_placeholder: "Your password",
  	button_label: "サインアップ",
  	loading_button_label: "Signing up ...",
  	social_provider_text: "に登録する",
  	link_text: "アカウントをお持ちではありませんか？サインアップ"
  };
  var sign_in = {
  	email_label: "電子メールアドレス",
  	password_label: "あなたのパスワード",
  	email_input_placeholder: "Your email address",
  	password_input_placeholder: "Your password",
  	button_label: "サインイン",
  	loading_button_label: "Signing in ...",
  	social_provider_text: "に登録する",
  	link_text: "Already have an account? Sign in"
  };
  var magic_link = {
  	email_input_label: "Email address",
  	email_input_placeholder: "Your email address",
  	button_label: "Send Magic Link",
  	loading_button_label: "Sending Magic Link ...",
  	link_text: "Send a magic link email"
  };
  var forgotten_password = {
  	email_label: "Email address",
  	password_label: "Your Password",
  	email_input_placeholder: "Your email address",
  	button_label: "Send reset password instructions",
  	loading_button_label: "Sending reset instructions ...",
  	link_text: "パスワードをお忘れの方"
  };
  var update_password = {
  	password_label: "New password",
  	password_input_placeholder: "Your new password",
  	button_label: "Update password",
  	loading_button_label: "Updating password ..."
  };
  var ja = {
  	sign_up: sign_up,
  	sign_in: sign_in,
  	magic_link: magic_link,
  	forgotten_password: forgotten_password,
  	update_password: update_password
  };

  var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    de_formal: de_formal,
    de_informal: de_informal,
    en: en,
    ja: ja
  });

  const defaultLocalization = Object.assign({}, index);
  X();

  function Auth(_ref) {
    let {
      supabaseClient,
      socialLayout = 'vertical',
      providers,
      view = 'sign_in',
      redirectTo,
      onlyThirdPartyProviders = false,
      magicLink = false,
      showLinks = true,
      appearance,
      theme = 'default',
      localization = {
        lang: 'en'
      }
    } = _ref;

    /**
     * Localization support
     */
    var _a, _b;

    const i18n = merge(defaultLocalization[(_a = localization.lang) !== null && _a !== void 0 ? _a : 'en'], (_b = localization.variables) !== null && _b !== void 0 ? _b : {}); // const themes = Object.values(appearance.themeFile ?? {}).map((theme) => {
    //   // return
    // })

    const [authView, setAuthView] = React.useState(view);
    const [defaultEmail, setDefaultEmail] = React.useState('');
    const [defaultPassword, setDefaultPassword] = React.useState('');
    const [themes, setThemes] = React.useState({});
    /**
     * Simple boolean to detect if authView 'sign_in' or 'sign_up' is used
     *
     * @returns boolean
     */

    const SignView = authView === 'sign_in' || authView === 'sign_up';
    React.useEffect(() => {
      var _a, _b, _c, _d;
      /**
       * Create default theme
       *
       * createStitches()
       * https://stitches.dev/docs/api#theme
       *
       * to add a new theme use  createTheme({})
       * https://stitches.dev/docs/api#theme
       */


      X({
        theme: merge((_b = (_a = appearance === null || appearance === void 0 ? void 0 : appearance.theme) === null || _a === void 0 ? void 0 : _a.default) !== null && _b !== void 0 ? _b : {}, (_d = (_c = appearance === null || appearance === void 0 ? void 0 : appearance.variables) === null || _c === void 0 ? void 0 : _c.default) !== null && _d !== void 0 ? _d : {})
      });
      const themessss = {};
      const themeKeys = (appearance === null || appearance === void 0 ? void 0 : appearance.theme) && Object.keys(appearance === null || appearance === void 0 ? void 0 : appearance.theme);

      if (themeKeys) {
        appearance.theme && Object.values(appearance.theme).map((theme, i) => {
          var _a, _b;

          const key = themeKeys[i]; // ignore default theme

          if (key === 'default') return {};
          const merged = merge((_a = appearance && appearance.theme && appearance.theme[key]) !== null && _a !== void 0 ? _a : {}, (_b = appearance && appearance.variables && appearance.variables[key]) !== null && _b !== void 0 ? _b : {});
          themessss[themeKeys[i]] = merged;
        });
      }

      setThemes(themessss);
    }, []);
    /**
     * Wraps around all auth components
     * renders the social auth providers if SignView is true
     *
     * also handles the theme override
     *
     * @param children
     * @returns React.ReactNode
     */

    const Container = _ref2 => {
      let {
        children
      } = _ref2;

      var _a, _b;

      return (// @ts-ignore
        jsxRuntimeExports.jsxs("div", Object.assign({
          className: theme !== 'default' ? q(merge( // @ts-ignore
          appearance === null || appearance === void 0 ? void 0 : appearance.theme[theme], (_b = (_a = appearance === null || appearance === void 0 ? void 0 : appearance.variables) === null || _a === void 0 ? void 0 : _a[theme]) !== null && _b !== void 0 ? _b : {})) : ''
        }, {
          children: [SignView && jsxRuntimeExports.jsx(SocialAuth, {
            appearance: appearance,
            supabaseClient: supabaseClient,
            providers: providers,
            socialLayout: socialLayout,
            redirectTo: redirectTo,
            onlyThirdPartyProviders: onlyThirdPartyProviders,
            i18n: i18n,
            view: authView
          }), !onlyThirdPartyProviders && children]
        }))
      );
    };

    React.useEffect(() => {
      /**
       * Overrides the authview if it is changed externally
       */
      setAuthView(view);
    }, [view]);
    const emailProp = {
      supabaseClient,
      setAuthView,
      defaultEmail,
      defaultPassword,
      setDefaultEmail,
      setDefaultPassword,
      redirectTo,
      magicLink,
      showLinks,
      i18n,
      appearance
    };
    /**
     * View handler, displays the correct Auth view
     * all views are wrapped in <Container/>
     */

    switch (authView) {
      case VIEWS$1.SIGN_IN:
        return jsxRuntimeExports.jsx(Container, {
          children: jsxRuntimeExports.jsx(EmailAuth, Object.assign({}, emailProp, {
            authView: 'sign_in'
          }))
        });

      case VIEWS$1.SIGN_UP:
        return jsxRuntimeExports.jsx(Container, {
          children: jsxRuntimeExports.jsx(EmailAuth, {
            appearance: appearance,
            supabaseClient: supabaseClient,
            authView: 'sign_up',
            setAuthView: setAuthView,
            defaultEmail: defaultEmail,
            defaultPassword: defaultPassword,
            setDefaultEmail: setDefaultEmail,
            setDefaultPassword: setDefaultPassword,
            redirectTo: redirectTo,
            magicLink: magicLink,
            showLinks: showLinks,
            i18n: i18n
          })
        });

      case VIEWS$1.FORGOTTEN_PASSWORD:
        return jsxRuntimeExports.jsx(Container, {
          children: jsxRuntimeExports.jsx(ForgottenPassword, {
            appearance: appearance,
            supabaseClient: supabaseClient,
            setAuthView: setAuthView,
            redirectTo: redirectTo,
            showLinks: showLinks,
            i18n: i18n
          })
        });

      case VIEWS$1.MAGIC_LINK:
        return jsxRuntimeExports.jsx(Container, {
          children: jsxRuntimeExports.jsx(MagicLink, {
            appearance: appearance,
            supabaseClient: supabaseClient,
            setAuthView: setAuthView,
            redirectTo: redirectTo,
            showLinks: showLinks,
            i18n: i18n
          })
        });

      case VIEWS$1.UPDATE_PASSWORD:
        return jsxRuntimeExports.jsx(Container, {
          children: jsxRuntimeExports.jsx(UpdatePassword, {
            appearance: appearance,
            supabaseClient: supabaseClient,
            i18n: i18n
          })
        });

      default:
        return null;
    }
  } // @ts-ignore


  Auth.ForgottenPassword = ForgottenPassword; // @ts-ignore

  Auth.UpdatePassword = UpdatePassword; // @ts-ignore

  Auth.MagicLink = MagicLink; // @ts-ignore

  Auth.UserContextProvider = UserContextProvider; // @ts-ignore

  Auth.useUser = useUser;

  /**
   * Create default theme
   *
   * createStitches()
   * https://stitches.dev/docs/api#theme
   *
   * to add a new theme use  createTheme({})
   * https://stitches.dev/docs/api#theme
   */
  // brand: 'hsl(252 62% 55%)',
  // brandAccent: 'hsl(252 62% 45%)',
  const ThemeSupa = {
    default: {
      colors: {
        brand: 'hsl(153 60.0% 53.0%)',
        brandAccent: 'hsl(154 54.8% 45.1%)',
        brandButtonText: 'white',
        defaultButtonBackground: 'white',
        defaultButtonBackgroundHover: '#eaeaea',
        defaultButtonBorder: 'lightgray',
        defaultButtonText: 'gray',
        dividerBackground: '#eaeaea',
        inputBackground: 'transparent',
        inputBorder: 'lightgray',
        inputBorderHover: 'gray',
        inputBorderFocus: 'gray',
        inputText: 'black',
        inputLabelText: 'gray',
        inputPlaceholder: 'darkgray',
        messageText: 'gray',
        messageTextDanger: 'red',
        anchorTextColor: 'gray',
        anchorTextHoverColor: 'darkgray'
      },
      space: {
        spaceSmall: '4px',
        spaceMedium: '8px',
        spaceLarge: '16px',
        labelBottomMargin: '8px',
        anchorBottomMargin: '4px',
        emailInputSpacing: '4px',
        socialAuthSpacing: '4px',
        buttonPadding: '10px 15px',
        inputPadding: '10px 15px'
      },
      fontSizes: {
        baseBodySize: '13px',
        baseInputSize: '14px',
        baseLabelSize: '14px',
        baseButtonSize: '14px'
      },
      fonts: {
        bodyFontFamily: `ui-sans-serif, sans-serif`,
        buttonFontFamily: `ui-sans-serif, sans-serif`,
        inputFontFamily: `ui-sans-serif, sans-serif`,
        labelFontFamily: `ui-sans-serif, sans-serif`
      },
      // fontWeights: {},
      // lineHeights: {},
      // letterSpacings: {},
      // sizes: {},
      borderWidths: {
        buttonBorderWidth: '1px',
        inputBorderWidth: '1px'
      },
      // borderStyles: {},
      radii: {
        borderRadiusButton: '4px',
        buttonBorderRadius: '4px',
        inputBorderRadius: '4px'
      } // shadows: {},
      // zIndices: {},
      // transitions: {},

    },
    dark: {
      colors: {
        brandButtonText: 'white',
        defaultButtonBackground: '#2e2e2e',
        defaultButtonBackgroundHover: '#3e3e3e',
        defaultButtonBorder: '#3e3e3e',
        defaultButtonText: 'white',
        dividerBackground: '#2e2e2e',
        inputBackground: '#1e1e1e',
        inputBorder: '#3e3e3e',
        inputBorderHover: 'gray',
        inputBorderFocus: 'gray',
        inputText: 'white',
        inputPlaceholder: 'darkgray'
      }
    }
  };

  const AppContextDefault = {
      initialize: moviemasher_js.EmptyFunction,
      initialized: false,
  };
  const AppContext = React__default.default.createContext(AppContextDefault);

  const useClient = () => {
      const { client } = moviemasher_js.Runtime.plugins[moviemasher_js.ProtocolType].supabase;
      return { supabaseClient: client };
  };

  const AuthOrHome = () => {
      const appContext = React__default.default.useContext(AppContext);
      const { initialize, initialized } = appContext;
      const client = useClient();
      const authSession = Auth.useUser();
      const { user } = authSession;
      React__default.default.useEffect(() => {
          if (initialized)
              return;
          if (user)
              initialize();
          else
              setTimeout(initialize, 500);
      }, [initialize, initialized, user]);
      if (!initialized)
          return null; //<main />
      if (user) {
          // create mash object containing text clip on a track
          const clip = {
              container: { string: 'Hello World!' },
              containerId: moviemasher_js.TextContainerId
          };
          const mash = { id: moviemasher_js.idTemporary(), request: { response: { tracks: [{ clips: [clip] }] } } };
          const options = { edited: { mash }, previewSize: { width: 480, height: 270 } };
          const props = clientReact.MasherDefaultProps(options);
          return jsxRuntimeExports.jsx(clientReact.MasherApp, { ...props });
      }
      const authProps = {
          ...client, providers: ['github'],
          appearance: { theme: ThemeSupa }, theme: 'dark',
      };
      return jsxRuntimeExports.jsx("main", { children: jsxRuntimeExports.jsxs("aside", { children: [jsxRuntimeExports.jsx("section", { children: jsxRuntimeExports.jsx(Auth, { ...authProps }) }), jsxRuntimeExports.jsx("h1", { children: "Welcome" }), jsxRuntimeExports.jsx("p", { children: "This example Supabase deployment adds the following tables:" }), jsxRuntimeExports.jsxs("ul", { children: [jsxRuntimeExports.jsx("li", { children: "media" }), jsxRuntimeExports.jsx("li", { children: "probing" }), jsxRuntimeExports.jsx("li", { children: "encoding" })] })] }) });
  };

  const AuthApp = () => {
      const [initialized, setInitialized] = React__default.default.useState(false);
      // const children = [<header key='header'>Media<SignOut /></header>]
      // children.push()
      // children.push(<footer key='footer'>Made with 🍁 in Vermont</footer>)
      const initialize = () => { setInitialized(true); };
      const appContext = { initialized, initialize };
      const appProps = {
          value: appContext, children: jsxRuntimeExports.jsx(AuthOrHome, {}, 'main')
      };
      return jsxRuntimeExports.jsx(AppContext.Provider, { ...appProps });
  };
  const App = () => {
      console.log('ProtocolSupabase', moviemasher_js.ProtocolType, protocolSupabase.SupabaseProtocol);
      const client = useClient();
      const authProps = { children: jsxRuntimeExports.jsx(AuthApp, {}), ...client };
      return jsxRuntimeExports.jsx(Auth.UserContextProvider, { ...authProps });
  };

  moviemasher_js.Runtime.environment.set(protocolSupabase.EnvironmentKeySupabaseProjectUrl, 'https://londrhbubledxrvsznll.supabase.co');
  moviemasher_js.Runtime.environment.set(protocolSupabase.EnvironmentKeySupabaseAnonKey, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbmRyaGJ1YmxlZHhydnN6bmxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA5NDM4MTcsImV4cCI6MTk4NjUxOTgxN30.BAy8J9nnjc2BQNheVhVBsenNsTml5ImFX52pRlpL5Zs');
  ReactDOM__default.default.createRoot(document.getElementById('root')).render(jsxRuntimeExports.jsx(App, {}));

  exports.App = App;
  exports.AppContext = AppContext;
  exports.AppContextDefault = AppContextDefault;
  exports.AuthApp = AuthApp;
  exports.AuthOrHome = AuthOrHome;
  exports.useClient = useClient;

  return exports;

})({}, React, MovieMasherProtocolSupabase, MovieMasher, MovieMasherClient, ReactDOM);
