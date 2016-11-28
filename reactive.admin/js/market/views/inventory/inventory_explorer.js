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
    var AericlesExplorerPage = (function (_super) {
        __extends(AericlesExplorerPage, _super);
        function AericlesExplorerPage() {
            _super.apply(this, arguments);
        }
        AericlesExplorerPage.prototype.get_page_content = function () {
            var html = React.createElement("div", null, React.createElement("div", {className: "animated fadeInRight"}, React.createElement("h1", null, React.createElement("i", {className: "fa fa-cubes"}), " Inventory")));
            return html;
        };
        return AericlesExplorerPage;
    }(ins_master_page_1.InsMasterPage));
    exports.AericlesExplorerPage = AericlesExplorerPage;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/market/views/inventory/inventory_explorer.js.map