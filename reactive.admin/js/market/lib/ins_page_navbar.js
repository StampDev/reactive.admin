// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../core/lib'], function (require, exports, React, jx) {
    "use strict";
    var InsPageNavBar = (function (_super) {
        __extends(InsPageNavBar, _super);
        function InsPageNavBar() {
            _super.apply(this, arguments);
        }
        InsPageNavBar.prototype.render = function () {
            var html = React.createElement("nav", {role: "navigation", className: "navbar-default navbar-static-side"}, React.createElement("div", {className: "sidebar-collapse"}, React.createElement("ul", {id: "side-menu", className: "nav metismenu"}, React.createElement("li", {className: "nav-header"}, React.createElement("div", {className: "dropdown profile-element"}, React.createElement("span", null, React.createElement("img", {src: "/ins/img/profile_small.jpg", className: "img-circle", alt: "image"})), React.createElement("a", {href: "#", className: "dropdown-toggle", "data-toggle": "dropdown"}, React.createElement("span", {className: "clear"}, React.createElement("span", {className: "block m-t-xs"}, React.createElement("strong", {className: "font-bold"}, "David Williams")), " ", React.createElement("span", {className: "text-muted text-xs block"}, "Art Director ", React.createElement("b", {className: "caret"})))), React.createElement("ul", {className: "dropdown-menu animated fadeInRight m-t-xs"}, React.createElement("li", null, React.createElement("a", {href: "profile.html"}, "Profile")), React.createElement("li", null, React.createElement("a", {href: "contacts.html"}, "Contacts")), React.createElement("li", null, React.createElement("a", {href: "mailbox.html"}, "Mailbox")), React.createElement("li", {className: "divider"}), React.createElement("li", null, React.createElement("a", {href: "login.html"}, "Logout")))), React.createElement("div", {className: "logo-element"}, "HR+")), React.createElement("li", {className: "active"}, React.createElement("a", {href: "/"}, React.createElement("i", {className: "fa fa-home"}), " ", React.createElement("span", {className: "nav-label"}, "Home"), " ")), React.createElement("li", null, React.createElement("a", {href: "/inventory"}, React.createElement("i", {className: "fa fa-cubes"}), " ", React.createElement("span", {className: "nav-label"}, "Inventory"), " ")), React.createElement("li", null, React.createElement("a", {href: "/admin"}, React.createElement("i", {className: "fa fa-th-large"}), " ", React.createElement("span", {className: "nav-label"}, "Admin"), " ")))));
            return html;
        };
        InsPageNavBar.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.highlight_active_menu();
        };
        InsPageNavBar.prototype.highlight_active_menu = function () {
            $('.sidebar-collapse li').removeClass('active');
            $('.sidebar-collapse li a').removeClass('active');
            var route = jx.local.get(jx.constants.router.current_route);
            var menu = route.path;
            //if (!menu || menu === '/') {
            //    menu = '/account/dashboard'
            //}
            $('#side-menu').find('[href="{0}"]'.format(menu)).closest('li').addClass('active');
            //$('.nav-second-level [href="{0}"]'.format(menu)).closest('.collapse').addClass('in');
            //$('.nav-second-level [href="{0}"]'.format(menu)).closest('li').addClass('active');
            //$('.nav-second-level [href="{0}"]'.format(menu)).parents('li').last().addClass('active');
        };
        return InsPageNavBar;
    }(jx.views.ReactView));
    exports.InsPageNavBar = InsPageNavBar;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/market/lib/ins_page_navbar.js.map