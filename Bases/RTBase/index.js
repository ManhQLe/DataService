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
            var Pack = JSON.parse(data);
            me.Emit(Pack.Event, Pack.Data);
        }
        catch (ex) {
            me.constructor.OnMessageError(me, ex);
        }
    });
}
EventCtrl.ExtendsTo(RTBase);

RTBase.GetMessageString = function (e, o) {
    return JSON.stringify({ "Event": e, "Data": o });
}

RTBase.OnClose = function (Client,ws) {
}

RTBase.OnMessageError = function (Client,ws) {
}

RTBase.BroadCast = function (e, d) {
    var s = this.GetMessageString(e, d);
    this.Clients.forEach(function (ws) {
        ws.send(s);
    })
}

RTBase.ExtendsTo = function (SubClass) {
    this.baseConstructor.ExtendsTo.call(this, SubClass);
    SubClass.GetMessageString = this.GetMessageString;
    SubClass.BroadCast = this.BroadCast;
    SubClass.OnClose = this.OnClose;
    SubClass.OnMessageError = this.OnMessageError;
    SubClass.Clients = [];
}

RTBase.prototype.BroadCast = function (e, d) {   
    console.log(this.constructor.BroadCast.toString()); 
    this.constructor.BroadCast(e, d);
}

RTBase.prototype.SendJSON = function (o) {
    this.ws.send(JSON.stringify(o));            
}

RTBase.prototype.SendMessage = function (e, o) {
    this.ws.send(this.constructor.GetMessageString(e, o));
}

module.exports = RTBase;
