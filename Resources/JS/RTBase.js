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
            var A = new Uint8Array(data);
            var DV = new DataView(data);
            var HeadLen = DV.getInt32(0);
            var BLen = data.byteLength - (HeadLen + 4);

            var Pack = JSON.parse(atob(String.fromCharCode.apply(null, A.slice(4, 4 + HeadLen))));
            
            me.Emit(Pack.Event, Pack.Data)
        }
        catch (ex) {
            me.OnMessageError(ex);
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

RTBase.EncodeStringToBytes = function (s, b) {
    var BLen = b ? b.byteLength : 0;
    s = btoa(s);
    var start = 4;
    var Len = s.length + start + BLen;

    var starts = 0;
    var A = new Uint8Array(Len);
    var DV = new DataView(A);
    DV.setInt32(0, s.length);

    var c = Len >> 2;
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

    BLen ? A.set(b, s.length + 4) : 1;

    return A;
}


RTBase.prototype.SendMessage = function (e, o,b) {
    var L = b ? b.length : 0;
    var A = this.constructor.EncodeStringToBytes(this.GetMessageString(e, o), b);
    this.ws.send(A);       
}

RTBase.ExtendsTo = function (SubClass) {
    this.baseConstructor.ExtendsTo.call(this, SubClass);
    SubClass.GetMessageString = this.GetMessageString;
    SubClass.EncodeStringToBytes = this.EncodeStringToBytes;
}


