(this["webpackJsonptestreact-fe"]=this["webpackJsonptestreact-fe"]||[]).push([[4],{182:function(e,t,a){"use strict";a.r(t);var n=a(9),l=a(10),r=a(12),c=a(11),u=a(1),s=a.n(u),m=a(51),i=a(123),o=a(127),E=a(118),d=a(116),h=a(183),f=(a(153),a(172),function(e){Object(r.a)(a,e);var t=Object(c.a)(a);function a(e){var l;return Object(n.a)(this,a),(l=t.call(this,e)).getUserList=function(){fetch("https://randomuser.me/api/?results=10",{method:"GET"}).then((function(e){if(e.ok)return e.json()})).then((function(e){l.setState({userlist:e.results}),console.log("data : ",e)}))},l.state={userlist:[]},l}return Object(l.a)(a,[{key:"componentDidMount",value:function(){this.getUserList()}},{key:"render",value:function(){var e=this.state.userlist;return s.a.createElement(m.a,{title:"Page Baru ",breadcrumbs:[{name:"Test update",active:!0}],className:"Page Baru "},s.a.createElement(i.a,null,s.a.createElement(o.a,null,s.a.createElement("h3",null,"User List")),s.a.createElement(o.a,{style:{textAlign:"right"}},s.a.createElement(E.a,null,"Ini Button"),s.a.createElement(E.a,null,"Ini Button 2"),s.a.createElement(E.a,null,"Ini Button 3")),s.a.createElement(d.a,null,s.a.createElement(h.a,{responsive:!0},s.a.createElement("thead",null,s.a.createElement("tr",{className:"text-capitalize align-middle text-center"},s.a.createElement("th",null,"Nama"),s.a.createElement("th",null,"Email"),s.a.createElement("th",null,"Umur"),s.a.createElement("th",null,"Jenis Kelamin"),s.a.createElement("th",null,"Alamat"),s.a.createElement("th",null,"No HP"))),s.a.createElement("tbody",null,e&&e.map((function(e){return s.a.createElement("tr",{key:e.id},s.a.createElement("td",null,e.name.first," ",e.name.last),s.a.createElement("td",null,e.email),s.a.createElement("td",null,e.dob.age),s.a.createElement("td",null,e.gender),s.a.createElement("td",null,e.location.street.name),s.a.createElement("td",null,e.cell))})))))))}}]),a}(s.a.Component));t.default=f}}]);
//# sourceMappingURL=4.fbb880ce.chunk.js.map