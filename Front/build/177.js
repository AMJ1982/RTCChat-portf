/*! For license information please see 177.js.LICENSE.txt */
(self.webpackChunkrtcchat=self.webpackChunkrtcchat||[]).push([[177],{8177:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>D}),n(6992),n(1539),n(8674),n(8783),n(3948),n(9826),n(3710),n(9714),n(3843),n(1249),n(9653),n(8309),n(9753),n(2526),n(1817),n(2165),n(7042),n(1038),n(4916),n(9070),n(2443),n(3680),n(3706),n(2703),n(8011),n(489),n(9554),n(4747),n(8304),n(5069);var r=n(7294),o=n(3359),i=n(319),a=n(3952),u=n(2152),c=n(4692),l=n(6252),s=n(982),f=n(9417),d=n(7663),v=n(9250),p=n(9655),h=n(3981),m=n(1144),y=n(1809),g=n(3237);function b(e){return b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},b(e)}function w(){w=function(){return e};var e={},t=Object.prototype,n=t.hasOwnProperty,r=Object.defineProperty||function(e,t,n){e[t]=n.value},o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function c(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{c({},"")}catch(e){c=function(e,t,n){return e[t]=n}}function l(e,t,n,o){var i=t&&t.prototype instanceof d?t:d,a=Object.create(i.prototype),u=new D(o||[]);return r(a,"_invoke",{value:_(e,n,u)}),a}function s(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}e.wrap=l;var f={};function d(){}function v(){}function p(){}var h={};c(h,i,(function(){return this}));var m=Object.getPrototypeOf,y=m&&m(m(N([])));y&&y!==t&&n.call(y,i)&&(h=y);var g=p.prototype=d.prototype=Object.create(h);function E(e){["next","throw","return"].forEach((function(t){c(e,t,(function(e){return this._invoke(t,e)}))}))}function x(e,t){function o(r,i,a,u){var c=s(e[r],e,i);if("throw"!==c.type){var l=c.arg,f=l.value;return f&&"object"==b(f)&&n.call(f,"__await")?t.resolve(f.__await).then((function(e){o("next",e,a,u)}),(function(e){o("throw",e,a,u)})):t.resolve(f).then((function(e){l.value=e,a(l)}),(function(e){return o("throw",e,a,u)}))}u(c.arg)}var i;r(this,"_invoke",{value:function(e,n){function r(){return new t((function(t,r){o(e,n,t,r)}))}return i=i?i.then(r,r):r()}})}function _(e,t,n){var r="suspendedStart";return function(o,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw i;return{value:void 0,done:!0}}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var u=S(a,n);if(u){if(u===f)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var c=s(e,t,n);if("normal"===c.type){if(r=n.done?"completed":"suspendedYield",c.arg===f)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(r="completed",n.method="throw",n.arg=c.arg)}}}function S(e,t){var n=t.method,r=e.iterator[n];if(void 0===r)return t.delegate=null,"throw"===n&&e.iterator.return&&(t.method="return",t.arg=void 0,S(e,t),"throw"===t.method)||"return"!==n&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+n+"' method")),f;var o=s(r,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,f;var i=o.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,f):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,f)}function k(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function L(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function D(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(k,this),this.reset(!0)}function N(e){if(e){var t=e[i];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var r=-1,o=function t(){for(;++r<e.length;)if(n.call(e,r))return t.value=e[r],t.done=!1,t;return t.value=void 0,t.done=!0,t};return o.next=o}}return{next:j}}function j(){return{value:void 0,done:!0}}return v.prototype=p,r(g,"constructor",{value:p,configurable:!0}),r(p,"constructor",{value:v,configurable:!0}),v.displayName=c(p,u,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===v||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,p):(e.__proto__=p,c(e,u,"GeneratorFunction")),e.prototype=Object.create(g),e},e.awrap=function(e){return{__await:e}},E(x.prototype),c(x.prototype,a,(function(){return this})),e.AsyncIterator=x,e.async=function(t,n,r,o,i){void 0===i&&(i=Promise);var a=new x(l(t,n,r,o),i);return e.isGeneratorFunction(n)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},E(g),c(g,u,"Generator"),c(g,i,(function(){return this})),c(g,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=Object(e),n=[];for(var r in t)n.push(r);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},e.values=N,D.prototype={constructor:D,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(L),!e)for(var t in this)"t"===t.charAt(0)&&n.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function r(n,r){return a.type="throw",a.arg=e,t.next=n,r&&(t.method="next",t.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),c=n.call(i,"finallyLoc");if(u&&c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,f):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),f},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),L(n),f}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;L(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,n){return this.delegate={iterator:N(e),resultName:t,nextLoc:n},"next"===this.method&&(this.arg=void 0),f}},e}function E(e,t,n,r,o,i,a){try{var u=e[i](a),c=u.value}catch(e){return void n(e)}u.done?t(c):Promise.resolve(c).then(r,o)}function x(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function a(e){E(i,r,o,a,u,"next",e)}function u(e){E(i,r,o,a,u,"throw",e)}a(void 0)}))}}function _(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,i,a,u=[],c=!0,l=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=i.call(n)).done)&&(u.push(r.value),u.length!==t);c=!0);}catch(e){l=!0,o=e}finally{try{if(!c&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(l)throw o}}return u}}(e,t)||function(e,t){if(e){if("string"==typeof e)return S(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?S(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function S(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var k=(0,r.lazy)((function(){return Promise.resolve().then(n.bind(n,5313))})),L=(0,r.lazy)((function(){return n.e(879).then(n.bind(n,2879))}));const D=function(){var e=(0,v.TH)(),t=(0,m.a)().user,n=null==t?void 0:t.connections.find((function(t){return t.user_id===e.pathname.split("/")[2]}));if(!n)return r.createElement(v.Fg,{to:"/"});var b=(0,g.l)(),E=_((0,r.useState)(""),2),S=E[0],D=E[1],N=(0,r.useRef)(null),j=(0,r.useRef)(null),O=(0,r.useRef)(null),P=_((0,o.t)(h.XE,{variables:{connection_id:n.connection_id,first:10,before:null},onError:function(e){return console.log(e.message)}}),2),C=P[0],G=P[1],M=G.data,T=G.called,A=G.loading,I=G.fetchMore,F=G.client,R=_((0,i.D)(h.Lw,{onError:function(e){console.log(e),b((0,y.e$)(e),"error")}}),1)[0],q=_((0,i.D)(h.c8,{onError:function(e){b((0,y.e$)(e),"error"),console.log("updateUnseenMsgs:",e)}}),1)[0];!function(e,t){var n=(0,r.useRef)(!1),o=(0,l.x)(null==t?void 0:t.client);(0,c.Vp)(e,c.n_.Subscription);var i=(0,r.useState)({loading:!(null==t?void 0:t.skip),error:void 0,data:void 0,variables:null==t?void 0:t.variables}),s=(i[0],i[1]);n.current||(n.current=!0,(null==t?void 0:t.onSubscriptionData)&&__DEV__&&a.kG.warn(t.onData?"'useSubscription' supports only the 'onSubscriptionData' or 'onData' option, but not both. Only the 'onData' option will be used.":"'onSubscriptionData' is deprecated and will be removed in a future major version. Please use the 'onData' option instead."),(null==t?void 0:t.onSubscriptionComplete)&&__DEV__&&a.kG.warn(t.onComplete?"'useSubscription' supports only the 'onSubscriptionComplete' or 'onComplete' option, but not both. Only the 'onComplete' option will be used.":"'onSubscriptionComplete' is deprecated and will be removed in a future major version. Please use the 'onComplete' option instead."));var f=(0,r.useState)((function(){return(null==t?void 0:t.skip)?null:o.subscribe({query:e,variables:null==t?void 0:t.variables,fetchPolicy:null==t?void 0:t.fetchPolicy,context:null==t?void 0:t.context})})),d=f[0],v=f[1],p=(0,r.useRef)(!1);(0,r.useEffect)((function(){return function(){p.current=!0}}),[]);var h=(0,r.useRef)({client:o,subscription:e,options:t});(0,r.useEffect)((function(){var n,r,i,a,c=null==t?void 0:t.shouldResubscribe;"function"==typeof c&&(c=!!c(t)),(null==t?void 0:t.skip)?(!(null==t?void 0:t.skip)!=!(null===(n=h.current.options)||void 0===n?void 0:n.skip)||p.current)&&(s({loading:!1,data:void 0,error:void 0,variables:null==t?void 0:t.variables}),v(null),p.current=!1):(!1===c||o===h.current.client&&e===h.current.subscription&&(null==t?void 0:t.fetchPolicy)===(null===(r=h.current.options)||void 0===r?void 0:r.fetchPolicy)&&!(null==t?void 0:t.skip)==!(null===(i=h.current.options)||void 0===i?void 0:i.skip)&&(0,u.D)(null==t?void 0:t.variables,null===(a=h.current.options)||void 0===a?void 0:a.variables))&&!p.current||(s({loading:!0,data:void 0,error:void 0,variables:null==t?void 0:t.variables}),v(o.subscribe({query:e,variables:null==t?void 0:t.variables,fetchPolicy:null==t?void 0:t.fetchPolicy,context:null==t?void 0:t.context})),p.current=!1),Object.assign(h.current,{client:o,subscription:e,options:t})}),[o,e,t,p.current]),(0,r.useEffect)((function(){if(d){var e=d.subscribe({next:function(e){var n,r,i={loading:!1,data:e.data,error:void 0,variables:null==t?void 0:t.variables};s(i),(null===(n=h.current.options)||void 0===n?void 0:n.onData)?h.current.options.onData({client:o,data:i}):(null===(r=h.current.options)||void 0===r?void 0:r.onSubscriptionData)&&h.current.options.onSubscriptionData({client:o,subscriptionData:i})},error:function(e){var n,r;s({loading:!1,data:void 0,error:e,variables:null==t?void 0:t.variables}),null===(r=null===(n=h.current.options)||void 0===n?void 0:n.onError)||void 0===r||r.call(n,e)},complete:function(){var e,t;(null===(e=h.current.options)||void 0===e?void 0:e.onComplete)?h.current.options.onComplete():(null===(t=h.current.options)||void 0===t?void 0:t.onSubscriptionComplete)&&h.current.options.onSubscriptionComplete()}});return function(){e.unsubscribe()}}}),[d])}(h.x4,{variables:{connection_id:n.connection_id,user_id:null==t?void 0:t.user_id},onData:function(e){var t=e.data;H(t.data.newMessage),U()},fetchPolicy:"network-only"});var H=function(e){var t=F.readQuery({query:h.XE});F.writeQuery({query:h.XE,data:{allMessages:{edges:[{__typename:"MessageEdge",cursor:e.time,node:e}],pageInfo:null==t?void 0:t.allMessages.pageInfo}}})};(0,r.useEffect)((function(){return C(),X(),window.addEventListener("focus",X),U(),function(){F.resetStore(),window.removeEventListener("focus",X)}}),[n]),(0,r.useEffect)((function(){if(M){var e=null;j.current&&N.current&&(e=N.current.scrollHeight-j.current,j.current=null),V(e)}}),[M,N.current]);var V=function(e){N.current&&(N.current.scrollTop=e||N.current.scrollHeight)},$=function(){if(O.current){var e=O.current;e.style.height="27px",e.style.height=e.scrollHeight+"px"}},z=function(){var e=x(w().mark((function e(){var t;return w().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(M.allMessages.pageInfo.hasPreviousPage){e.next=2;break}return e.abrupt("return");case 2:j.current=null===(t=N.current)||void 0===t?void 0:t.scrollHeight,I({variables:{first:10,before:M.allMessages.pageInfo.endCursor}});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),U=function(){var e=x(w().mark((function e(){return w().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:q({variables:{unseen:!1,connection_id:n.connection_id,user_id:null==t?void 0:t.user_id}});case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),X=function(){(0,y.O)(n.user_id)},K=function(){var e=x(w().mark((function e(r){var o,i,a,u,c,l;return w().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r.preventDefault(),e.prev=1,o=r.target,i=o.elements[2].files,a=O.current&&""!==O.current.value?O.current.value:null,e.next=7,(0,y.Tt)(i,600);case 7:if(u=e.sent,a||u){e.next=10;break}return e.abrupt("return");case 10:return c={connection_id:n.connection_id,user_id:null==t?void 0:t.user_id,receiver:n.user_id,message_text:a,message_img:u,time:Date.now().toString()},o.reset(),D(""),$(),e.next=16,R({variables:c});case 16:l=e.sent,H(l.data.createMessage),e.next=23;break;case 20:e.prev=20,e.t0=e.catch(1),b((0,y.e$)(e.t0),"error");case 23:case"end":return e.stop()}}),e,null,[[1,20]])})));return function(t){return e.apply(this,arguments)}}();return A||!T?r.createElement("div",{className:"loader-ring"}):r.createElement(r.Fragment,null,r.createElement("div",{id:"messages",ref:N,onScroll:function(){var e;0===(null===(e=N.current)||void 0===e?void 0:e.scrollTop)&&z()}},M.allMessages.edges.length>0?M.allMessages.edges.map((function(e,o){var i=e.node,a=(0,y.jm)(i.message_text);return r.createElement("div",{className:"message-bubble \n                ".concat(Number(i.user_id)===Number(null==t?void 0:t.user_id)?"me":"friend"),key:o},r.createElement("div",{className:"edit icon-div dropdown","data-dropdown":!0},r.createElement(s.G,{className:"icon",icon:f.iV1}),r.createElement(L,{style:{padding:"0"}},r.createElement(p.rU,{className:"link tight",to:"/edit-msg",state:{node:i}},"Edit message"))),i.message_img&&r.createElement("img",{className:"message-bubble-img",src:i.message_img,onClick:function(){return(0,y.B9)(i.message_img)}}),r.createElement("p",{className:"text"},null==a?void 0:a.map((function(e,t){return t%2==0?e:r.createElement("a",{href:e,key:t+e},e)}))),i.time&&r.createElement("p",{className:"time"},r.createElement("span",{id:"sender-name"},"".concat(n.name,", ")),(0,y.p6)(i.time)))})):r.createElement("div",{className:"no-messages"},r.createElement("p",null,"No messages. Write something to start a conversation with ".concat(n.name,".")))),r.createElement("div",{id:"message-tool-bar"},S&&r.createElement(k,{attachment:S,setAttachment:D}),r.createElement("form",{id:"message-tools",onSubmit:function(e){return K(e)}},r.createElement("textarea",{id:"message-text-input",ref:O,rows:1,autoFocus:!0,onChange:function(){O.current&&(0,y._7)(O.current),$()},onKeyDown:function(e){var t,n;"Enter"===e.key&&0==e.shiftKey&&(e.preventDefault(),null==O||null===(t=O.current)||void 0===t||null===(n=t.form)||void 0===n||n.requestSubmit())}}),r.createElement("div",{style:{display:"flex",gap:"0.5em"}},r.createElement(d.z,{text:"Send",className:"button-send"}),r.createElement("label",{htmlFor:"input-file"},r.createElement("div",{className:"icon-div"},r.createElement(s.G,{className:"icon",icon:f.Alc}))),r.createElement("input",{type:"file",id:"input-file",onChange:function(){var e=x(w().mark((function e(t){var n,r;return w().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(n=t.target).files){e.next=6;break}return e.next=4,(0,y.Tt)(n.files,50);case 4:r=e.sent,D(r);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()})))))}},3843:(e,t,n)=>{var r=n(2109),o=n(1702),i=Date,a=o(i.prototype.getTime);r({target:"Date",stat:!0},{now:function(){return a(new i)}})}}]);