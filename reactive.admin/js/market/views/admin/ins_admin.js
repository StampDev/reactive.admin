// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../lib/ins_master_page'], function (require, exports, React, ins_master_page_1) {
    "use strict";
    var InsAdminPage = (function (_super) {
        __extends(InsAdminPage, _super);
        function InsAdminPage() {
            _super.apply(this, arguments);
        }
        InsAdminPage.prototype.get_page_content = function () {
            var html = React.createElement("div", {className: "animated fadeInRight"}, React.createElement("h1", null, React.createElement("i", {className: "fa fa-th-large"}), " Admin page"));
            return html;
        };
        return InsAdminPage;
    }(ins_master_page_1.InsMasterPage));
    exports.InsAdminPage = InsAdminPage;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/market/views/admin/ins_admin.js.map