'use strict'
const C8 = require("ctrl8");
const EventCtrl = C8.EventCtrl;
function RTBase(Init) {
    RTBase.baseConstructor.call(this, Init);
    var me = this;

    this.Prop("UserInfo");
    this.Prop("AppDir");
    this.Prop("wss");
    this.Prop("ws");

    me.constructor.Clients.push(this.ws);

    this.ws.on("close", function () {
        var idx = me.constructor.Clients.indexOf(me.ws);
        idx >= 0 ? me.constructor.Clients.splice(idx, 1) : 0;
        me.constructor.OnClose(me, me.ws);
    })
    this.ws.on("message", function (data, flags) {
        try {
            var A = new Uint8Array(data);                        
            var DV = new DataView(data);            
            var HeadLen = DV.getInt32(0);
            var BLen = data.byteLength - (HeadLen + 4);

            var Pack = JSON.parse(atob(String.fromCharCode.apply(null, A.slice(4, 4 + HeadLen))));
                        
            me.Emit(Pack.Event, Pack.Data, BLen >= 0 ? A.slice(HeadLen + 4).buffer : null);
        }
        catch (ex) {
            me.constructor.OnMessageError(me, ex);
        }
    });
}
EventCtrl.ExtendsTo(RTBase);

RTBase.GetMessageString = function (e, o, b) {
    return JSON.stringify({ "Event": e, "Data": o });
}
RTBase.EncodeStringToBytes = function (s) {
    s = btoa(s);
    var start = 4;
    var Len = s.length + start;

    var starts = 0;
    var A = new Uint8Array(Len);
    var DV = new DataView(A);
    DV.setInt32(0, s.length);

    var c = Len >>2;
    for (var i = 0; i < c; i++) {
        A[start++] = s.charCodeAt(starts++);
        A[start++] = s.charCodeAt(starts++);
        A[start++] = s.charCodeAt(starts++);
        A[start++] = s.charCodeAt(starts++);
    }

    c = Len & 3;
    for (var i = 0; i < c; i++) {
        A[start++] = s.charCodeAt(starts++);
    }

    return A;
}

RTBase.OnClose = function (Client,ws) {
}

RTBase.OnMessageError = function (Client,ws) {
}

RTBase.BroadCast = function (e, d, b) {
    var L = b ? b.length : 0;
    var A = RTBase.EncodeStringToBytes(this.GetMessageString(e, d));
    
    this.Clients.forEach(function (ws) {
        ws.send(A, {
            "fin": L ? true : false
        });
        L ? ws.send(b) : 0;
    })
}

RTBase.prototype.BroadCast = function (e, d, b) {
    this.constructor.BroadCast(e, d, b);
}

RTBase.prototype.SendMessage = function (e, o, b) {
    var L = b ? b.length : 0;
    var A = RTBase.EncodeStringToBytes(this.GetMessageString(e, o));
    this.ws.send(A, {
        "fin": L ? true : false
    });
    L ? this.ws.send(b) : 0;
}

RTBase.ExtendsTo = function (SubClass) {
    this.baseConstructor.ExtendsTo.call(this, SubClass);
    SubClass.GetMessageString = this.GetMessageString;
    SubClass.BroadCast = this.BroadCast;
    SubClass.OnClose = this.OnClose;
    SubClass.OnMessageError = this.OnMessageError;
    SubClass.Clients = [];
}

module.exports = RTBase;
