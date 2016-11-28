// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Datatype;
    (function (Datatype) {
        Datatype[Datatype["string"] = 0] = "string";
        Datatype[Datatype["bool"] = 1] = "bool";
        Datatype[Datatype["int"] = 2] = "int";
        Datatype[Datatype["date"] = 3] = "date";
        Datatype[Datatype["datetime"] = 4] = "datetime";
    })(Datatype || (Datatype = {}));
    var prop = {
        name: 'code',
        type: Datatype.string,
    };
    var ProductModule = {
        title: 'Products',
        table: 'item',
        properties: {
            'id': { primary: true },
            'code': {
                type: 'string',
                display: 'code',
                visible: true,
                required: true,
                unique: true,
                row: 1,
                ui: {}
            },
            active: {
                type: ''
            }
        }
    };
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/modules.js.map