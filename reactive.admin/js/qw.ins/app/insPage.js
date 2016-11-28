/// <reference path="insmenus.tsx" />
/// <reference path="../../qw.base/lib/qwview.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-bootstrap', '../../qw.base/lib/qwpage', './insmenus'], function (require, exports, React, rb, p, mn) {
    "use strict";
    var b = rb;
    var InsPage = (function (_super) {
        __extends(InsPage, _super);
        function InsPage(props) {
            _super.call(this, props);
        }
        InsPage.prototype.render = function () {
            var ui = this.get_uiSchema();
            var html = React.createElement("div", {id: 'wrapper'}, React.createElement("nav", {className: "navbar-default navbar-static-side", role: "navigation"}, ui.appMenus), React.createElement("div", {id: "page-wrapper", className: "gray-bg"}, React.createElement("div", {className: "row border-bottom"}, React.createElement("nav", {className: "navbar navbar-static-top white-bg", role: "navigation", style: { marginBottom: 0 }}, React.createElement("div", {className: "navbar-header"}, React.createElement("a", {className: "navbar-minimalize minimalize-styl-2 btn btn-primary ", href: "#"}, React.createElement("i", {className: "fa fa-bars"}), " "), React.createElement("form", {role: "search", className: "navbar-form-custom", method: "post", action: "#"}, React.createElement("div", {className: "form-group"}, React.createElement("input", {type: "text", placeholder: "Search for something...", className: "form-control", name: "top-search", id: "top-search"})))), React.createElement("ul", {className: "nav navbar-top-links navbar-right"}, React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-sign-out"}), " Log out"))))), React.createElement("div", {className: "wrapper wrapper-content animated fadeInRight"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-lg-12"}, ui.content))), React.createElement("div", {className: "footer"}, React.createElement("div", {className: "pull-right"}, "10GB of ", React.createElement("strong", null, "250GB"), " Free."), React.createElement("div", null, React.createElement("strong", null, "Copyright"), " Example Company © 2014-2015"))));
            return html;
        };
        InsPage.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            $('body').removeClass('gray-bg');
            $.getScript('/ins/js/inspinia.js');
        };
        InsPage.prototype.get_uiSchema = function () {
            return {
                appMenus: React.createElement(mn.InsMenus, {owner: this}),
                content: React.createElement("div", {className: "text-center m-t-lg"}, React.createElement("h1", null, "Welcome in INSPINIA Static SeedProject"), React.createElement("small", null, "It is an application skeleton for a typical web app.You can use it to quickly bootstrap your webapp projects and dev environment for these projects."))
            };
        };
        return InsPage;
    }(p.QwPage));
    exports.InsPage = InsPage;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/qw.ins/app/inspage.js.map