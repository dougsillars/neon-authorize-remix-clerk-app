import{az as R,aA as M,aB as p,aC as v,aD as h,a0 as C,x as y,aE as b,aF as g,v as E,aG as F,aH as $,a as i,aI as S,y as k,z as H,aJ as P}from"./components-BCDCSGm0.js";/**
 * @remix-run/react v2.14.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function O(d){if(!d)return null;let m=Object.entries(d),s={};for(let[a,e]of m)if(e&&e.__type==="RouteErrorResponse")s[a]=new R(e.status,e.statusText,e.data,e.internal===!0);else if(e&&e.__type==="Error"){if(e.__subType){let o=window[e.__subType];if(typeof o=="function")try{let r=new o(e.message);r.stack=e.stack,s[a]=r}catch{}}if(s[a]==null){let o=new Error(e.message);o.stack=e.stack,s[a]=o}}else s[a]=e;return s}/**
 * @remix-run/react v2.14.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let n,t,f=!1;let c,z=new Promise(d=>{c=d}).catch(()=>{});function D(d){if(!t){if(window.__remixContext.future.v3_singleFetch){if(!n){let u=window.__remixContext.stream;p(u,"No stream found for single fetch decoding"),window.__remixContext.stream=void 0,n=v(u,window).then(l=>{window.__remixContext.state=l.value,n.value=!0}).catch(l=>{n.error=l})}if(n.error)throw n.error;if(!n.value)throw n}let o=h(window.__remixManifest.routes,window.__remixRouteModules,window.__remixContext.state,window.__remixContext.future,window.__remixContext.isSpaMode),r;if(!window.__remixContext.isSpaMode){r={...window.__remixContext.state,loaderData:{...window.__remixContext.state.loaderData}};let u=C(o,window.location,window.__remixContext.basename);if(u)for(let l of u){let _=l.route.id,x=window.__remixRouteModules[_],w=window.__remixManifest.routes[_];x&&y(w,x,window.__remixContext.isSpaMode)&&(x.HydrateFallback||!w.hasLoader)?r.loaderData[_]=void 0:w&&!w.hasLoader&&(r.loaderData[_]=null)}r&&r.errors&&(r.errors=O(r.errors))}t=b({routes:o,history:g(),basename:window.__remixContext.basename,future:{v7_normalizeFormMethod:!0,v7_fetcherPersist:window.__remixContext.future.v3_fetcherPersist,v7_partialHydration:!0,v7_prependBasename:!0,v7_relativeSplatPath:window.__remixContext.future.v3_relativeSplatPath,v7_skipActionErrorRevalidation:window.__remixContext.future.v3_singleFetch===!0},hydrationData:r,mapRouteProperties:E,dataStrategy:window.__remixContext.future.v3_singleFetch?F(window.__remixManifest,window.__remixRouteModules,()=>t):void 0,patchRoutesOnNavigation:$(window.__remixManifest,window.__remixRouteModules,window.__remixContext.future,window.__remixContext.isSpaMode,window.__remixContext.basename)}),t.state.initialized&&(f=!0,t.initialize()),t.createRoutesForHMR=M,window.__remixRouter=t,c&&c(t)}let[m,s]=i.useState(void 0),[a,e]=i.useState(t.state.location);return i.useLayoutEffect(()=>{f||(f=!0,t.initialize())},[]),i.useLayoutEffect(()=>t.subscribe(o=>{o.location!==a&&e(o.location)}),[a]),S(t,window.__remixManifest,window.__remixRouteModules,window.__remixContext.future,window.__remixContext.isSpaMode),i.createElement(i.Fragment,null,i.createElement(k.Provider,{value:{manifest:window.__remixManifest,routeModules:window.__remixRouteModules,future:window.__remixContext.future,criticalCss:m,isSpaMode:window.__remixContext.isSpaMode}},i.createElement(H,{location:a},i.createElement(P,{router:t,fallbackElement:null,future:{v7_startTransition:!0}}))),window.__remixContext.future.v3_singleFetch?i.createElement(i.Fragment,null):null)}export{D as R};
