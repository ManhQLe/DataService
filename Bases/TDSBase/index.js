var TDS = require("tedious");
var Async8 = require("async8");
var SqlConnection = TDS.Connection;
var SqlCommand = TDS.Request;
var APIBase = require.main.require("./APIBase");


function Connect(Done, param, i, gparams) {
    
}

class TDSBase extends APIBase {
    constructor(req, res) {
        super(req, res);
        this.Connections = {};
    }

    Init(Def, Conns) {
        super(Def, Conns);
        var LinkedConns = Def.Connections || [];
        var me = this;
        Async8.DPQueue(LinkedConns, Connect, function (Ret, err) {
            
        }, Conns);
    }
}
