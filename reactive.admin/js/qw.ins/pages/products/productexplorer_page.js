/// <reference path="../../../qw.base/lib/qwexplorer.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-bootstrap', '../../app/inspage', '../../../qw.base/lib/qwexplorer'], function (require, exports, React, rb, ins, ex) {
    "use strict";
    var b = rb;
    var ProductExplorerPage = (function (_super) {
        __extends(ProductExplorerPage, _super);
        function ProductExplorerPage() {
            _super.apply(this, arguments);
        }
        ProductExplorerPage.prototype.get_uiSchema = function () {
            var ui = _super.prototype.get_uiSchema.call(this);
            ui.content = React.createElement(ExplorerContent, {owner: this});
            return ui;
        };
        return ProductExplorerPage;
    }(ins.InsPage));
    exports.ProductExplorerPage = ProductExplorerPage;
    var ExplorerContent = (function (_super) {
        __extends(ExplorerContent, _super);
        function ExplorerContent() {
            _super.apply(this, arguments);
        }
        ExplorerContent.prototype.get_model = function () {
            return 'products';
        };
        return ExplorerContent;
    }(ex.QwExplorer));
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/qw.ins/pages/products/productexplorer_page.js.map