// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib', 'react-bootstrap', '../../lib/ins_master_page'], function (require, exports, React, jx, rb, ins_master_page_1) {
    "use strict";
    var b = rb;
    var CompanyExplorer = (function (_super) {
        __extends(CompanyExplorer, _super);
        function CompanyExplorer() {
            _super.apply(this, arguments);
        }
        CompanyExplorer.prototype.get_page_content = function () {
            return React.createElement(Explorer, null);
        };
        return CompanyExplorer;
    }(ins_master_page_1.InsMasterPage));
    exports.CompanyExplorer = CompanyExplorer;
    var Explorer = (function (_super) {
        __extends(Explorer, _super);
        function Explorer() {
            _super.apply(this, arguments);
        }
        Explorer.prototype.render = function () {
            var ui = this.get_uiSchema();
            var html = React.createElement("div", {className: "animated fadeInRight"}, React.createElement("div", {className: "ibox"}, React.createElement("div", {className: "ibox-content", style: { minHeight: 700 }}, React.createElement(b.Col, {lg: 12}, "subdepartment path"), React.createElement(b.Col, {lg: 3}, React.createElement("h2", null, " ", React.createElement("i", {className: "fa fa-cubes"}), " Subdepartment"), React.createElement("hr", null)), React.createElement(b.Col, {lg: 7}, React.createElement("h2", null, React.createElement("i", {className: "fa fa-user"}), " Employees"), React.createElement("hr", null)), React.createElement(b.Col, {lg: 2}, React.createElement("div", {className: "alert alert-info"}, React.createElement("h3", null, "Actions")), React.createElement(b.ListGroup, null, React.createElement(b.ListGroupItem, {href: "#"}, React.createElement("i", {className: "fa fa-plus m-r-sm"}), " ", React.createElement("span", null, "Invite users")), React.createElement(b.ListGroupItem, {href: "#"}, React.createElement("i", {className: "fa fa-plus-square m-r-sm"}), " ", React.createElement("span", null, "Add department")), React.createElement(b.ListGroupItem, {href: "#"}, React.createElement("i", {className: "fa fa-edit m-r-sm"}), " ", React.createElement("span", null, "Edit department")), React.createElement(b.ListGroupItem, {href: "#"}, React.createElement("i", {className: "fa fa-times m-r-sm"}), " ", React.createElement("span", null, "Delete department")))))));
            return html;
        };
        return Explorer;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/ins/views/comp/comp_explorer.js.map