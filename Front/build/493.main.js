"use strict";(self.webpackChunkrtcchat=self.webpackChunkrtcchat||[]).push([[493],{7493:(e,n,t)=>{t.r(n),t.d(n,{default:()=>u}),t(8309),t(9653),t(9826),t(1539);var i=t(7294),r=t(9655),c=t(4316),a=t(5108),o=t(982),l=t(9417),s=t(3981);const u=function(e){var n,t=e.friend,u=(0,a.a)().user,d=(0,c.a)(s.cz,{variables:{connection_id:t.connection_id,user_id:null==u?void 0:u.user_id},fetchPolicy:"network-only"}),m=d.data,f=d.loading,g=d.startPolling,v=d.stopPolling;return(0,i.useEffect)((function(){return g(1e4),function(){return v()}}),[]),f?i.createElement("div",{className:"loader-ring"}):i.createElement(r.rU,{style:{textDecoration:"none",color:"inherit"},to:"/chat",state:{friend:t}},i.createElement("div",{className:"list-item"},i.createElement("div",{className:"link-group"},t.img?i.createElement("img",{className:"user-img",src:t.img}):i.createElement("div",{className:"user-img"},i.createElement(o.G,{className:"icon",style:{color:"white"},icon:l.ILF})),i.createElement("p",{style:{pointerEvents:"none"}},t.name)),!f&&Number(m.unseenMessages)>Number(null==u||null===(n=u.connections.find((function(e){return e.connection_id===t.connection_id})))||void 0===n?void 0:n.latest_msg)&&i.createElement("div",{className:"alert"},"!")))}},9826:(e,n,t)=>{var i=t(2109),r=t(2092).find,c=t(1223),a="find",o=!0;a in[]&&Array(1)[a]((function(){o=!1})),i({target:"Array",proto:!0,forced:o},{find:function(e){return r(this,e,arguments.length>1?arguments[1]:void 0)}}),c(a)}}]);