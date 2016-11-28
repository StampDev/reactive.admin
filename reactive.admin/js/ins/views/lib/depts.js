// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../../core/lib'], function (require, exports, jx) {
    "use strict";
    var Depts = (function (_super) {
        __extends(Depts, _super);
        function Depts() {
            _super.call(this, 'compdept');
        }
        Depts.prototype.get_parent = function (id) {
            var target = this.findkey(id);
            if (!target) {
                return null;
            }
            return this.findkey(_.result(target, 'deptparentid'));
        };
        Depts.prototype.get_children = function (id) {
            return this.findall('deptparentid', id);
        };
        return Depts;
    }(jx.data.DataSource));
    exports.Depts = Depts;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/lib/depts.js.map