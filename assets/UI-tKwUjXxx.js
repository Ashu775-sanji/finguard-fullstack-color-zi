import{c as s,j as a}from"./index-snUPDWUc.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=s("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=s("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),c=["INR","USD","GBP","EUR"],i=()=>{const e=localStorage.getItem("fg_currency");return c.includes(e)?e:"INR"},d=(e,r=i())=>new Intl.NumberFormat(r==="INR"?"en-IN":"en-US",{style:"currency",currency:r,maximumFractionDigits:0}).format(e);function h({children:e,className:r=""}){return a.jsx("section",{className:"card panel "+r,children:e})}function m({eyebrow:e,title:r,desc:n,action:t}){return a.jsxs("div",{className:"pageIntro",children:[a.jsxs("div",{children:[a.jsx("small",{children:e}),a.jsx("h2",{children:r}),a.jsx("p",{children:n})]}),t]})}function p({value:e,tone:r="mint"}){return a.jsx("div",{className:"progress",role:"progressbar","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":Math.round(e),children:a.jsx("i",{className:r,style:{width:`${Math.min(e,100)}%`}})})}export{h as C,m as P,l as R,u as T,p as a,d as m};
