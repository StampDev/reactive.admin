/// <reference path="../../qw.base/lib/qwview.tsx" />
/// <reference path="../../qw.base/lib/qwpage.tsx" />
/// <reference path="../../qw.base/lib/qwtypes.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-bootstrap', '../../qw.base/lib/qwpage'], function (require, exports, React, rb, page) {
    "use strict";
    var b = rb;
    var InsMenus = (function (_super) {
        __extends(InsMenus, _super);
        function InsMenus() {
            _super.apply(this, arguments);
        }
        InsMenus.prototype.render = function () {
            var html = React.createElement("div", {className: "sidebar-collapse"}, React.createElement("ul", {className: "nav metismenu", id: "side-menu"}, React.createElement("li", {className: "nav-header"}, React.createElement("div", {className: "dropdown profile-element"}, React.createElement("a", {"data-toggle": "dropdown", className: "dropdown-toggle", href: "#"}, React.createElement("span", {className: "clear"}, " ", React.createElement("span", {className: "block m-t-xs"}, " ", React.createElement("strong", {className: "font-bold"}, "David Williams")), " ", React.createElement("span", {className: "text-muted text-xs block"}, "Art Director ", React.createElement("b", {className: "caret"})), " "), " "), React.createElement("ul", {className: "dropdown-menu animated fadeInRight m-t-xs"}, React.createElement("li", null, React.createElement("a", {href: "#"}, "Logout")))), React.createElement("div", {className: "logo-element"}, "IN+")), this.build_menus()));
            return html;
        };
        InsMenus.prototype.build_menus = function () {
            var menus = this.app.appSettings.Menus;
            var count = 0;
            var views = _.map(menus, function (menu) {
                var is_active = count++ === 0 ? 'active' : '';
                var html = React.createElement("li", {className: "{0}".format(is_active)}, React.createElement("a", {href: menu.url}, React.createElement("i", {className: "{0}".format(menu.icon)}), React.createElement("span", {className: "nav-label"}, "{0}".format(menu.title))));
                return html;
            });
            return views;
        };
        return InsMenus;
    }(page.QwAppMenus));
    exports.InsMenus = InsMenus;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/qw.ins/app/insmenus.js.map