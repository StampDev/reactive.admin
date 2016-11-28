/// <reference path="../../lib/ins_master_page.tsx" />
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
    var InsHomePage = (function (_super) {
        __extends(InsHomePage, _super);
        function InsHomePage() {
            _super.apply(this, arguments);
        }
        InsHomePage.prototype.get_page_content = function () {
            var html = React.createElement("div", {className: "animated fadeInRight"}, React.createElement("h1", null, React.createElement("i", {className: "fa fa-home"}), " Home page"));
            return html;
        };
        return InsHomePage;
    }(ins_master_page_1.InsMasterPage));
    exports.InsHomePage = InsHomePage;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/market/views/home/ins_home_page.js.map