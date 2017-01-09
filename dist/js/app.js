"use strict";!function(){function e(e){return Array.prototype.slice.call(e)}function t(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function n(e,n,o){var r,i=new Promise(function(i,u){r=e[n].apply(e,o),t(r).then(i,u)});return i.request=r,i}function o(e,t,o){var r=n(e,t,o);return r.then(function(e){if(e)return new a(e,r.request)})}function r(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]}})})}function i(e,t,o,r){r.forEach(function(r){r in o.prototype&&(e.prototype[r]=function(){return n(this[t],r,arguments)})})}function u(e,t,n,o){o.forEach(function(o){o in n.prototype&&(e.prototype[o]=function(){return this[t][o].apply(this[t],arguments)})})}function c(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return o(this[t],r,arguments)})})}function s(e){this._index=e}function a(e,t){this._cursor=e,this._request=t}function p(e){this._store=e}function f(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)}})}function d(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new f(n)}function l(e){this._db=e}r(s,"_index",["name","keyPath","multiEntry","unique"]),i(s,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),c(s,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(a,"_cursor",["direction","key","primaryKey","value"]),i(a,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(e){e in IDBCursor.prototype&&(a.prototype[e]=function(){var n=this,o=arguments;return Promise.resolve().then(function(){return n._cursor[e].apply(n._cursor,o),t(n._request).then(function(e){if(e)return new a(e,n._request)})})})}),p.prototype.createIndex=function(){return new s(this._store.createIndex.apply(this._store,arguments))},p.prototype.index=function(){return new s(this._store.index.apply(this._store,arguments))},r(p,"_store",["name","keyPath","indexNames","autoIncrement"]),i(p,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getAllKeys","count"]),c(p,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),u(p,"_store",IDBObjectStore,["deleteIndex"]),f.prototype.objectStore=function(){return new p(this._tx.objectStore.apply(this._tx,arguments))},r(f,"_tx",["objectStoreNames","mode"]),u(f,"_tx",IDBTransaction,["abort"]),d.prototype.createObjectStore=function(){return new p(this._db.createObjectStore.apply(this._db,arguments))},r(d,"_db",["name","version","objectStoreNames"]),u(d,"_db",IDBDatabase,["deleteObjectStore","close"]),l.prototype.transaction=function(){return new f(this._db.transaction.apply(this._db,arguments))},r(l,"_db",["name","version","objectStoreNames"]),u(l,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(t){[p,s].forEach(function(n){n.prototype[t.replace("open","iterate")]=function(){var n=e(arguments),o=n[n.length-1],r=(this._store||this._index)[t].apply(this._store,n.slice(0,-1));r.onsuccess=function(){o(r.result)}}})}),[s,p].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,o=[];return new Promise(function(r){n.iterateCursor(e,function(e){return e?(o.push(e.value),void 0!==t&&o.length==t?void r(o):void e["continue"]()):void r(o)})})})});var h={open:function(e,t,o){var r=n(indexedDB,"open",[e,t]),i=r.request;return i.onupgradeneeded=function(e){o&&o(new d(i.result,e.oldVersion,i.transaction))},r.then(function(e){return new l(e)})},"delete":function(e){return n(indexedDB,"deleteDatabase",[e])}};"undefined"!=typeof module?module.exports=h:self.idb=h}();
!function(e){function r(e,r){e._queue=[];var o=e.objectStore(r),t=10,n=Date.now();!function u(){for(;e._queue.length;)e._queue.shift()(),n=Date.now();Date.now()-n<t&&(c.call(o,-(1/0)).onsuccess=u)}()}function o(e){var r="objectStore"in e?e.objectStore:e;return r.transaction}function t(e,r,o,t){return new Promise(function(n,u){t._queue.push(function(){var t=r.apply(e,o);t.onsuccess=function(){n(t.result)},t.onerror=function(){u(t.error)}})})}var n=IDBFactory.prototype.open;IDBFactory.prototype.open=function(e,o){var t,u=Object(o).version;t=u?n.call(this,e,u):n.call(this,e);var c=Object(o).upgrade;c&&(t.onupgradeneeded=function(e){var o="\0(IndexedDB Promises Upgrade Hack)\0";try{t.result.createObjectStore(o)}catch(n){}r(t.transaction,o),c(t.result,e.oldVersion)});var a=Object(o).blocked;return a&&(t.onblocked=a),new Promise(function(e,r){t.onsuccess=function(){e(t.result)},t.onerror=function(){r(t.error)}})};var u=IDBFactory.prototype.deleteDatabase;IDBFactory.prototype.deleteDatabase=function(e,r){var o=u.call(indexedDB,e),t=Object(r).blocked;return t&&(o.onblocked=t),new Promise(function(e,r){o.onsuccess=function(){e(o.result)},o.onerror=function(){r(o.error)}})};var c=IDBObjectStore.prototype.get,a=IDBDatabase.prototype.transaction;IDBDatabase.prototype.transaction=function(e,o){var t=a.apply(this,arguments),n="string"==typeof e?e:e[0];r(t,n);var u=new Promise(function(e,r){t.oncomplete=function(){e(void 0)},t.onabort=function(e){r(t.error)}});return u.abort=t.abort.bind(t),u.objectStore=t.objectStore.bind(t),u.db=t.db,u.mode=t.mode,u},[[IDBObjectStore,["put","add","delete","get","clear","count"]],[IDBIndex,["get","getKey","count"]],[IDBCursor,["update","delete"]]].forEach(function(e){var r=e[0],n=e[1];n.forEach(function(e){var n=r.prototype[e];r.prototype[e]=function(){var e=this,r=arguments,u=o(this);return t(e,n,r,u)}})}),[[IDBObjectStore,["openCursor"]],[IDBIndex,["openCursor","openKeyCursor"]]].forEach(function(e){var r=e[0],t=e[1];t.forEach(function(e){var t=r.prototype[e];r.prototype[e]=function(){var e=this,r=arguments,n=o(this);return new Promise(function(o,u){n._queue.push(function(){var n=t.apply(e,r);n.onsuccess=function(){n.result&&(n.result._request=n),o(n.result)},n.onerror=function(){u(n.error)}})})}})}),["continue","advance"].forEach(function(e){var r=IDBCursor.prototype[e];IDBCursor.prototype[e]=function(){var e=this,t=arguments,n=o(this.source);return new Promise(function(o,u){n._queue.push(function(){r.apply(e,t);var n=e._request;n.onsuccess=function(){o(n.result)},n.onerror=function(){u(n.error)}})})}}),IDBCursor.prototype.all=function(){var e=this,r=e._request;return new Promise(function(o,t){function n(){if(!r.result)return void o(u);try{u.push({key:e.key,primaryKey:e.primaryKey,value:e.value}),e["continue"]().then(n,t)}catch(c){t(c)}}var u=[];r.onsuccess=n,r.onerror=function(){t(r.error)},n()})},IDBCursor.prototype.forEach=function(e){var r=this,o=r._request;return new Promise(function(t,n){function u(){if(!o.result)return void t(void 0);try{e({key:r.key,primaryKey:r.primaryKey,value:r.value}),r["continue"]().then(u,n)}catch(c){n(c)}}o.onsuccess=u,o.onerror=function(){n(o.error)},u()})}}(this);
var defaultTrainData={response_code:200,train:[{name:"SAU JANATA EXP",number:"19018",src_departure_time:"00:55",classes:[{available:"Y","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"N","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"Y","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:1,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"01:16",travel_time:"00:21",from:{name:"SURAT",code:"ST"}},{name:"ADI BDTS LOKSHAKTI EXP",number:"22928",src_departure_time:"01:15",classes:[{available:"Y","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"Y","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"Y","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:2,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"01:38",travel_time:"00:23",from:{name:"SURAT",code:"ST"}},{name:"INDB - BCT AVANTIKA EXP.",number:"12962",src_departure_time:"01:50",classes:[{available:"Y","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"Y","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"Y","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:3,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"02:16",travel_time:"00:26",from:{name:"SURAT",code:"ST"}},{name:"GUJARAT MAIL",number:"12902",src_departure_time:"02:10",classes:[{available:"Y","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"Y","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"Y","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:4,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"02:30",travel_time:"00:20",from:{name:"SURAT",code:"ST"}},{name:"ARAVALI EXPRESS",number:"19708",src_departure_time:"02:17",classes:[{available:"Y","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"Y","class-code":"2S"},{available:"N","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"Y","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:5,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"02:43",travel_time:"00:26",from:{name:"SURAT",code:"ST"}},{name:"SAURASHTRA MAIL",number:"19006",src_departure_time:"02:38",classes:[{available:"Y","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"Y","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"Y","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:6,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"02:57",travel_time:"00:19",from:{name:"SURAT",code:"ST"}},{name:"SURAT VR PASS",number:"59038",src_departure_time:"04:15",classes:[{available:"-","class-code":"3A"},{available:"-","class-code":"FC"},{available:"-","class-code":"3E"},{available:"-","class-code":"2S"},{available:"-","class-code":"1A"},{available:"-","class-code":"SL"},{available:"-","class-code":"CC"},{available:"-","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:7,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"04:53",travel_time:"00:38",from:{name:"SURAT",code:"ST"}},{name:"FLYING RANI S.F. EXPRESS",number:"12922",src_departure_time:"05:25",classes:[{available:"N","class-code":"3A"},{available:"Y","class-code":"FC"},{available:"N","class-code":"3E"},{available:"Y","class-code":"2S"},{available:"N","class-code":"1A"},{available:"N","class-code":"SL"},{available:"Y","class-code":"CC"},{available:"N","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:8,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"05:58",travel_time:"00:33",from:{name:"SURAT",code:"ST"}},{name:"AHMADABAD PASS",number:"59440",src_departure_time:"06:55",classes:[{available:"-","class-code":"3A"},{available:"-","class-code":"FC"},{available:"-","class-code":"3E"},{available:"-","class-code":"2S"},{available:"-","class-code":"1A"},{available:"-","class-code":"SL"},{available:"-","class-code":"CC"},{available:"-","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:9,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"08:05",travel_time:"01:10",from:{name:"SURAT",code:"ST"}},{name:"KUTCH EXPRESS",number:"19132",src_departure_time:"07:05",classes:[{available:"Y","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"Y","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"Y","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:10,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"07:26",travel_time:"00:21",from:{name:"SURAT",code:"ST"}},{name:"ST  - BL MEMU",number:"69152",src_departure_time:"09:20",classes:[{available:"-","class-code":"3A"},{available:"-","class-code":"FC"},{available:"-","class-code":"3E"},{available:"-","class-code":"2S"},{available:"-","class-code":"1A"},{available:"-","class-code":"SL"},{available:"-","class-code":"CC"},{available:"-","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:11,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"09:59",travel_time:"00:39",from:{name:"SURAT",code:"ST"}},{name:"BHUJ BDTS  EXP",number:"19116",src_departure_time:"09:58",classes:[{available:"Y","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"Y","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"Y","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:12,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"10:21",travel_time:"00:23",from:{name:"SURAT",code:"ST"}},{name:"PASCHIM EXPRESS",number:"12926",src_departure_time:"10:25",classes:[{available:"Y","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"Y","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"Y","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:13,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"10:48",travel_time:"00:23",from:{name:"SURAT",code:"ST"}},{name:"GUJARAT EXPRESS",number:"19012",src_departure_time:"11:15",classes:[{available:"N","class-code":"3A"},{available:"Y","class-code":"FC"},{available:"N","class-code":"3E"},{available:"Y","class-code":"2S"},{available:"N","class-code":"1A"},{available:"N","class-code":"SL"},{available:"Y","class-code":"CC"},{available:"N","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:14,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"11:33",travel_time:"00:18",from:{name:"SURAT",code:"ST"}},{name:"SAURASHTRA EXP",number:"19216",src_departure_time:"12:40",classes:[{available:"Y","class-code":"3A"},{available:"Y","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"N","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"N","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:15,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"13:18",travel_time:"00:38",from:{name:"SURAT",code:"ST"}},{name:"FZR BCT JANATA",number:"19024",src_departure_time:"13:35",classes:[{available:"N","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"N","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"N","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:16,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"14:03",travel_time:"00:28",from:{name:"SURAT",code:"ST"}},{name:"ST - BDTS INTERCITY EXP",number:"12936",src_departure_time:"16:05",classes:[{available:"N","class-code":"3A"},{available:"Y","class-code":"FC"},{available:"N","class-code":"3E"},{available:"Y","class-code":"2S"},{available:"N","class-code":"1A"},{available:"N","class-code":"SL"},{available:"Y","class-code":"CC"},{available:"N","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:17,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"16:30",travel_time:"00:25",from:{name:"SURAT",code:"ST"}},{name:"BH VIRAR PASS",number:"59010",src_departure_time:"16:25",classes:[{available:"-","class-code":"3A"},{available:"-","class-code":"FC"},{available:"-","class-code":"3E"},{available:"-","class-code":"2S"},{available:"-","class-code":"1A"},{available:"-","class-code":"SL"},{available:"-","class-code":"CC"},{available:"-","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:18,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"17:01",travel_time:"00:36",from:{name:"SURAT",code:"ST"}},{name:"ST-SJN MEMU",number:"69142",src_departure_time:"17:25",classes:[{available:"-","class-code":"3A"},{available:"-","class-code":"FC"},{available:"-","class-code":"3E"},{available:"-","class-code":"2S"},{available:"-","class-code":"1A"},{available:"-","class-code":"SL"},{available:"-","class-code":"CC"},{available:"-","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:19,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"17:58",travel_time:"00:33",from:{name:"SURAT",code:"ST"}},{name:"SURAT VR PASS",number:"59048",src_departure_time:"18:20",classes:[{available:"-","class-code":"3A"},{available:"-","class-code":"FC"},{available:"-","class-code":"3E"},{available:"-","class-code":"2S"},{available:"-","class-code":"1A"},{available:"-","class-code":"SL"},{available:"-","class-code":"CC"},{available:"-","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:20,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"18:57",travel_time:"00:37",from:{name:"SURAT",code:"ST"}},{name:"VG VALSAD PASS",number:"59050",src_departure_time:"18:55",classes:[{available:"-","class-code":"3A"},{available:"-","class-code":"FC"},{available:"-","class-code":"3E"},{available:"-","class-code":"2S"},{available:"-","class-code":"1A"},{available:"-","class-code":"SL"},{available:"-","class-code":"CC"},{available:"-","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:21,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"19:34",travel_time:"00:39",from:{name:"SURAT",code:"ST"}},{name:"AHMEDABAD PASSENGER",number:"59442",src_departure_time:"21:35",classes:[{available:"-","class-code":"3A"},{available:"-","class-code":"FC"},{available:"-","class-code":"3E"},{available:"-","class-code":"2S"},{available:"-","class-code":"1A"},{available:"-","class-code":"SL"},{available:"-","class-code":"CC"},{available:"-","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:22,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"22:16",travel_time:"00:41",from:{name:"SURAT",code:"ST"}},{name:"DEHRADUN EXP",number:"19020",src_departure_time:"22:30",classes:[{available:"Y","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"N","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"Y","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:23,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"23:02",travel_time:"00:32",from:{name:"SURAT",code:"ST"}},{name:"GUJARAT QUEEN",number:"19034",src_departure_time:"22:55",classes:[{available:"N","class-code":"3A"},{available:"Y","class-code":"FC"},{available:"N","class-code":"3E"},{available:"Y","class-code":"2S"},{available:"N","class-code":"1A"},{available:"N","class-code":"SL"},{available:"Y","class-code":"CC"},{available:"N","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:24,days:[{runs:"Y","day-code":"MON"},{runs:"Y","day-code":"TUE"},{runs:"Y","day-code":"WED"},{runs:"Y","day-code":"THU"},{runs:"Y","day-code":"FRI"},{runs:"Y","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"23:31",travel_time:"00:36",from:{name:"SURAT",code:"ST"}},{name:"ADI-KOP EXPRESS",number:"11049",src_departure_time:"23:50",classes:[{available:"Y","class-code":"3A"},{available:"N","class-code":"FC"},{available:"N","class-code":"3E"},{available:"N","class-code":"2S"},{available:"N","class-code":"1A"},{available:"Y","class-code":"SL"},{available:"N","class-code":"CC"},{available:"Y","class-code":"2A"}],to:{name:"NAVSARI",code:"NVS"},no:25,days:[{runs:"N","day-code":"MON"},{runs:"N","day-code":"TUE"},{runs:"N","day-code":"WED"},{runs:"N","day-code":"THU"},{runs:"N","day-code":"FRI"},{runs:"N","day-code":"SAT"},{runs:"Y","day-code":"SUN"}],dest_arrival_time:"00:15",travel_time:"00:25",from:{name:"SURAT",code:"ST"}}],total:25,error:""};
var railwayMaster=function(){};railwayMaster.prototype.bindSource=function(){$("#txtSource").autocomplete({source:function(t,e){fetch("http://api.railwayapi.com/suggest_station/name/"+$("#txtSource").val().trim()+"/apikey/"+apikey+"/").then(function(t){200==t.status&&t.json().then(function(t){for(var a=[],n=t.station,r=0;r<n.length;r++)a.push({label:n[r].fullname,value:n[r].fullname,code:n[r].code});e(a)})})["catch"](function(t){})},select:function(t,e){$("#txtSource").attr("data-stnCode",$(e)[0].item.code)},minLength:3})},railwayMaster.prototype.bindDest=function(){$("#txtDest").autocomplete({source:function(t,e){fetch("http://api.railwayapi.com/suggest_station/name/"+$("#txtDest").val().trim()+"/apikey/"+apikey+"/").then(function(t){200==t.status&&t.json().then(function(t){for(var a=[],n=t.station,r=0;r<n.length;r++)a.push({label:n[r].fullname,value:n[r].fullname,code:n[r].code});e(a)})})["catch"](function(t){})},select:function(t,e){$("#txtDest").attr("data-stnCode",$(e)[0].item.code)},minLength:3})},railwayMaster.prototype.searchButtonClick=function(){$("#btnSearch").click(function(){if($("#loader")[0].style.display="",""!=$("#txtDest").val()&&""!=$("#txtSource").val()){var t=new Date,e=t.getDate()+"-"+(t.getMonth()+1),a=idb.open("TrainBetwStation",1,function(t){var e=t.createObjectStore("trainBetwStation",{keyPath:"id"});e.createIndex("sourceDestIndex",["source","dest"],{unique:!0})}),n=[{name:"SURAT",code:"ST"},{name:"NAVSARI",code:"NVS"},{name:"VALSAD",code:"BL"},{name:"VAPI",code:"VAPI"},{name:"DADAR",code:"DR"},{name:"MUMBAI CST",code:"CSTM"}],r=n.filter(function(t){return t.name===$("#txtSource").val()})[0],o=n.filter(function(t){return t.name===$("#txtDest").val()})[0];fetch("http://api.railwayapi.com/between/source/"+(void 0!=r?r.code:$("#txtSource").attr("data-stnCode"))+"/dest/"+(void 0!=o?o.code:$("#txtDest").attr("data-stnCode"))+"/date/"+e+"/apikey/"+apikey+"/").then(function(t){return 200!=t.status?a.then(function(t){var e=t.transaction("trainBetwStation","readwrite"),a=e.objectStore("trainBetwStation"),n=a.index("sourceDestIndex"),r=n.get(IDBKeyRange.only([$("#txtSource").val(),$("#txtDest").val()]));r.then(function(t){if(t){var e=objRailway.getHtmString(t.json);$("#listTrain").html(e)}})}).then(function(){console.log("Added")}):void t.json().then(function(t){a.then(function(e){var a=e.transaction("trainBetwStation","readwrite"),n=a.objectStore("trainBetwStation"),r=(n.index("sourceDestIndex"),$("#txtSource").val()+"-"+$("#txtDest").val());return n.put({source:$("#txtSource").val(),dest:$("#txtDest").val(),sourceCode:$("#txtSource").attr("data-stnCode"),DestCode:$("#txtDest").attr("data-stnCode"),json:t,id:r}),a.complete}).then(function(){console.log("Added")})["catch"](function(t){});var e=objRailway.getHtmString(t);$("#listTrain").html(e),$("#loader")[0].style.display="none"})})["catch"](function(t){a.then(function(t){var e=t.transaction("trainBetwStation","readwrite"),a=e.objectStore("trainBetwStation"),n=a.index("sourceDestIndex"),r=n.get(IDBKeyRange.only([$("#txtSource").val(),$("#txtDest").val()]));r.then(function(t){if(t){var e=objRailway.getHtmString(t.json);$("#listTrain").html(e),$("#loader")[0].style.display="none"}})}).then(function(){console.log("Added")}),$("#loader")[0].style.display="none"})}})},railwayMaster.prototype.getHtmString=function(t){for(var e=t.train,a="",n=0;n<e.length;n++)0==n&&(a='<table class="table table-striped table-bordered"><thead><tr><th>Train Number</th><th>Train Name</th><th>Source</th><th>Depature</th><th>Destination</th><th>Arrival</th><th><table class="table table-bordered"><thead><tr><th colspan="7">Day Run</th></tr></thead><tbody><tr><td>M</td><td>T</td><td>W</td><td>T</td><td>F</td><td>S</td><td>S</td></tr></tbody></table></th><th><table class="table table-bordered"><thead><tr><th colspan="7">Classes</th></tr></thead><tbody><tr><td>1A</td><td>2A</td><td>3A</td><td>CC</td><td>SS</td><td>2S</td><td>3E</td></tr></tbody></table></th></tr></thead><tbody>'),a+="<tr><td>"+t.train[n].number+"</td><td>"+t.train[n].name+"</td><td>"+t.train[n].from.name+"</td><td>"+t.train[n].src_departure_time+"</td><td>"+t.train[n].to.name+"</td><td>"+t.train[n].dest_arrival_time+'</td><td><table class="table table-bordered"><tbody><tr><td>'+t.train[n].days[0].runs+"</td><td>"+t.train[n].days[1].runs+"</td><td>"+t.train[n].days[2].runs+"</td><td>"+t.train[n].days[3].runs+"</td><td>"+t.train[n].days[4].runs+"</td><td>"+t.train[n].days[5].runs+"</td><td>"+t.train[n].days[6].runs+'</td></tr></tbody></table> </td><td><table class="table table-bordered"><tbody><tr><td>'+t.train[n].classes[1].available+"</td><td>"+t.train[n].classes[7].available+"</td><td>"+t.train[n].classes[6].available+"</td><td>"+t.train[n].classes[0].available+"</td><td>"+t.train[n].classes[3].available+"</td><td>"+t.train[n].classes[4].available+"</td><td>"+t.train[n].classes[5].available+"</td></tr></tbody></table></td></tr>",n==e.length-1&&(a+="</tbody></table>");return""==a&&(a="<div class='panel-heading'>Records not found</div>"),a},railwayMaster.prototype.displayDefaultTrainList=function(){$("#txtSource").val("SURAT"),$("#txtDest").val("NAVSARI "),$("#txtSource").attr("data-stnCode","ST"),$("#txtDest").attr("data-stnCode","NVS");var t=idb.open("TrainBetwStation",1,function(t){var e=t.createObjectStore("trainBetwStation",{keyPath:"id"});e.createIndex("sourceDestIndex",["source","dest"],{unique:!0})});t.then(function(t){var e=t.transaction("trainBetwStation","readwrite"),a=e.objectStore("trainBetwStation"),n=(a.index("sourceDestIndex"),$("#txtSource").val()+"-"+$("#txtDest").val());return a.put({source:$("#txtSource").val(),dest:$("#txtDest").val(),sourceCode:$("#txtSource").attr("data-stnCode"),DestCode:$("#txtDest").attr("data-stnCode"),json:defaultTrainData,id:n}),e.complete}).then(function(){console.log("Added")})["catch"](function(t){});var e=this.getHtmString(defaultTrainData);$("#listTrain").html(e)};