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
    var SmrtMenus = (function (_super) {
        __extends(SmrtMenus, _super);
        function SmrtMenus() {
            _super.apply(this, arguments);
        }
        SmrtMenus.prototype.render = function () {
            var html = React.createElement("aside", {id: "left-panel"}, React.createElement("div", {className: "login-info"}, React.createElement("span", null, " ", React.createElement("a", {href: "javascript:void(0);", id: "show-shortcut", "data-action": "toggleShortcut"}, React.createElement("img", {src: "/smrt/img/avatars/sunny.png", alt: "me", className: "online"}), React.createElement("span", null, "john.doe"), React.createElement("i", {className: "fa fa-angle-down"})))), React.createElement("nav", null, React.createElement("ul", null, this.build_menus())), React.createElement("span", {className: "minifyme", "data-action": "minifyMenu"}, " ", React.createElement("i", {className: "fa fa-arrow-circle-left hit"}), " "));
            return html;
        };
        SmrtMenus.prototype.build_menus = function () {
            var menus = this.app.appSettings.Menus;
            var count = 0;
            var views = _.map(menus, function (menu) {
                var is_active = count++ === 0 ? 'active' : '';
                var html = React.createElement("li", {className: ""}, React.createElement("a", {href: menu.url, title: menu.title}, React.createElement("i", {className: "{0}".format(menu.icon)}), React.createElement("span", {className: "menu-item-parent"}, "{0}".format(menu.title))));
                return html;
            });
            return views;
        };
        return SmrtMenus;
    }(page.QwAppMenus));
    exports.SmrtMenus = SmrtMenus;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/qw.smrt/app/smrtmenus.js.map