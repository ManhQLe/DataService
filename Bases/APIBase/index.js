'use strict';
const Ctrl8 = require("ctrl8");

function APIBase(Init) {
    APIBase.baseConstructor.call(this, Init);
    this.Prop("Definition");


}

APIBase.prototype.Exec= function(Done){

}

Ctrl8.ExtendsTo(APIBase);

module.exports = APIBAse;