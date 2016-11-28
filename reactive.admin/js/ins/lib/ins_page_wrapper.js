/// <reference path="../../core/jx__.tsx" />
/// <reference path="ins_wrapper_content.tsx" />
/// <reference path="ins_page_breadcrumb.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../core/lib', './ins_page_breadcrumb', './ins_page_subnavbar', './ins_wrapper_content'], function (require, exports, React, jx, ins_page_breadcrumb_1, ins_page_subnavbar_1, ins_wrapper_content_1) {
    "use strict";
    var InsPageWrapper = (function (_super) {
        __extends(InsPageWrapper, _super);
        function InsPageWrapper() {
            _super.apply(this, arguments);
        }
        InsPageWrapper.prototype.render = function () {
            var html = React.createElement("div", {id: "page-wrapper", className: "gray-bg dashbard-1"}, React.createElement(ins_page_subnavbar_1.InsPageSubNavBar, null), React.createElement(ins_page_breadcrumb_1.InsPageBreadCrumb, null), React.createElement(ins_wrapper_content_1.InsWrapperContent, null));
            return html;
        };
        return InsPageWrapper;
    }(jx.views.ReactView));
    exports.InsPageWrapper = InsPageWrapper;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/lib/ins_page_wrapper.js.map