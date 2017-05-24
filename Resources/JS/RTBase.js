function RTBase(Init) {
    RTBase.baseConstructor.call(this, Init);
    var me = this;

    this.Prop("WSUrl", location.protocol.replace("http", "ws") + "//" + location.host);  
    this.Prop("AppUrl");
    this.Prop("OnClose", function () { });
    this.Prop("OnOpen", function () { });
    this.Prop("MessageError", function () { });

    var ws = new WebSocket(this.WSUrl + this.AppUrl);
    this.ws = ws;
    
    
    ws.onopen = function () {
        me.OnOpen(me.ws);
    }

    ws.onmessage = function (evt) {
        try {
            var Pack = JSON.parse(evt.data);
            me.Emit(Pack.Event, Pack.Data)
        }
        catch (ex) {
            me.MessageError(ex);
        }
    }

    ws.onclose = function () {        
        me.OnClose(me.ws);
    }    
}
EventCtrl.ExtendsTo(RTBase);


RTBase.ExtendsTo = function (SubClass) {
    Ctrl8.ExtendsTo.call(this, SubClass);
    SubClass.GetMessageString = this.GetMessageString;
}


RTBase.GetMessageString = function (e, o) {
    return JSON.stringify({ "Event": e, "Data": o });
}

RTBase.prototype.SendJSON = function (o) {
    this.ws.send(JSON.stringify(o));
}

RTBase.prototype.SendMessage = function (e, o) {
    this.ws.send(RTBase.GetMessageString(e, o));
}




