var express = require('express')
var path = require('path');
var Async8 = require('async8');
var router = express.Router()
var fs = require("fs");
var Dir = path.join(global.RootDir, "API");

router.all('/*/:name', Handle);

function GetConfig(Done, P,GP) {
    var req = GP.req;
    var res = GP.res;
    var FolderDir = path.join(Dir, req.params["0"]);
    var ConfigDir = path.join(FolderDir, "config.json");
    var Name = req.params.name;
    if (fs.existsSync(ConfigDir)) {
        fs.readFile(ConfigDir, 'utf8', function (err, data) {
            if (err)
                Done(null, err);
            else {
                try {
                    Done(JSON.parse(data));
                }
                catch (ex) {
                    Done(null, ex);
                }
            }
        });
    }
    else
        Done(null, "Missing configuration");
}

function GetParams(Done, Config, GP) {
    var req = GP.req;
    var res = GP.res;
    try {
        var Name = req.params.name;
        var B = GetBody(req);
        for (var x in req.query) {
            B.hasOwnProperty(x) ? 1 :
                B[x] = req.query[x];
        }
        var Service = Config.Services[Name];
        var Def = Service?Service.Def:null;        
        if (Def) {
            var DBLookup = Config.DBConnections || {};
            var Params = {};
            for (var p in Def.Parameters) {
                var val = B[p];
                if (val !== undefined) {
                    switch (Def.Parameters[p]) {
                        case "Number":
                            val = val ? Number.parseFloat(val) : val;
                            break;
                        case "Int":
                            val = val ? Number.parseInt(val) : val;
                            break;
                        case "DateTime":
                            val = val ? new Date(val) : val;
                            break;
                        case "Boolean":
                            val = val ? (val == "true" || val == "1") : false;
                    }
                    Params[p] = val;
                }
            }

            var Conn = [];
            (Def.Connections || []).forEach(function (x) {
                Conn.push(DBLookup[x]);
            });

            var Input = {
                "Parameters": Params,
                "Props": Def.Props,
                "Connections": Conn
            }

            Done(Input);
        }
        else {            
            throw "Cannot find: " + Name;
        }

    } catch (ex) {
        console.log(ex);
        Done(null, ex);
    }
}

function Execute(Done,Input,GP) {
    GP.res.json(Input);
}


function Handle(req, res) {
    Async8.Queue(
        [GetConfig, GetParams, Execute],
        null,
        function (d, err) {
            if (err) 
                InternalError(res, err);            
        },
        {
            "req": req, "res": res
        }
    );

}

function GetBody(req) {
    var b = {};
    try {
        b =  JSON.parse(req.body ? req.body : "{}");
    }
    catch (ex) {
        
    }
    return b;
}

function InternalError(res,d) {
    res.status(500).json({ "error": d ? d : "Internal Error" });
}

function NotFound(res,d) {
    res.status(404).json({ "error": d ? d : "Not found" });
}

module.exports = router;