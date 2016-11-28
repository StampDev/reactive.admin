/// <reference path="../../lib/ins_master_page.tsx" />
/// <reference path="ins_dashboard.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../lib/ins_master_page', './ins_dashboard'], function (require, exports, React, ins_master_page_1, ins_dashboard_1) {
    "use strict";
    var InsHomePage = (function (_super) {
        __extends(InsHomePage, _super);
        function InsHomePage() {
            _super.apply(this, arguments);
        }
        InsHomePage.prototype.get_page_content = function () {
            var html = React.createElement(ins_dashboard_1.InsDashboard, null);
            return html;
        };
        return InsHomePage;
    }(ins_master_page_1.InsMasterPage));
    exports.InsHomePage = InsHomePage;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/home/ins_home_page.js.map