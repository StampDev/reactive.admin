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
            var html = React.createElement("nav", {role: "navigation", className: "navbar-default navbar-static-side "}, React.createElement("div", {className: "sidebar-collapse"}, React.createElement("ul", {id: "side-menu", className: "nav metismenu"}, React.createElement("li", {className: "nav-header"}, React.createElement("div", {className: "dropdown profile-element"}, React.createElement("span", null, React.createElement("img", {src: "/ins/img/profile_small.jpg", className: "img-circle", alt: "image"})), React.createElement("a", {href: "#", className: "dropdown-toggle", "data-toggle": "dropdown"}, React.createElement("span", {className: "clear"}, React.createElement("span", {className: "block m-t-xs"}, React.createElement("strong", {className: "font-bold"}, "David Williams")), " ", React.createElement("span", {className: "text-muted text-xs block"}, "Art Director ", React.createElement("b", {className: "caret"})))), React.createElement("ul", {className: "dropdown-menu animated fadeInRight m-t-xs"}, React.createElement("li", null, React.createElement("a", {href: "#"}, "Profile")), React.createElement("li", null, React.createElement("a", {href: "#"}, "Contacts")), React.createElement("li", null, React.createElement("a", {href: "#"}, "Mailbox")), React.createElement("li", {className: "#"}), React.createElement("li", null, React.createElement("a", {href: "#"}, "Logout")))), React.createElement("div", {className: "logo-element"}, "HR+")), this.build_menus())));
            return html;
        };
        InsPageNavBar.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        InsPageNavBar.prototype.build_menus = function () {
            var _this = this;
            var route = jx.local.get(jx.constants.router.current_route);
            var active_url = route ? route.path : null;
            // get menus as defined in app context
            var appMenus = _.filter(this.app.get_menus(), function (mn) { return !mn.hidden; });
            var menus = [];
            _.each(appMenus, function (menu) {
                var children = menu.submenus ?
                    _.filter(menu.submenus, function (sub) { return !sub.hidden; }) : [];
                var sub_menus = null;
                if (children.length) {
                    var has_active_submenu = false;
                    var subs = _.map(children, function (c) {
                        var flatten_menu = _.find(_this.app.router.flatten_menus, function (mn) {
                            return mn.name === c.name;
                        });
                        var submenu_is_active = (active_url && _this.app.router.matching_url(active_url, flatten_menu.url)) ? 'active' : '';
                        if (!submenu_is_active) {
                            if (flatten_menu.alters) {
                                var found = _.filter(flatten_menu.alters, function (alt) {
                                    var mn = _this.app.router.find_menu_by_name(alt);
                                    return mn && _this.app.router.matching_url(active_url, mn.url);
                                }).length > 0;
                                submenu_is_active = found ? 'active' : '';
                            }
                        }
                        has_active_submenu = has_active_submenu || submenu_is_active != '';
                        var li = React.createElement("li", {className: "li-menu sub-menu no-outline {0}".format(submenu_is_active)}, React.createElement("a", {"data-menu": c.name, "data-menu-parent": menu.name, href: flatten_menu.url, className: "no-outline"}, c.title));
                        return li;
                    });
                    var collapse = has_active_submenu ? 'collapse in' : 'collapse';
                    sub_menus =
                        React.createElement("ul", {className: "nav nav-second-level {0}".format(collapse)}, subs);
                }
                var lookup = _.find(_this.app.router.flatten_menus, function (mn) {
                    return mn.name === menu.name;
                });
                var icon = menu.icon ? React.createElement("i", {className: menu.icon}) : null;
                var arrow = children.length > 0 ? React.createElement("span", {className: "fa arrow"}) : null;
                var active = has_active_submenu || (_this.app.router.matching_url(active_url, lookup.url)) ? 'active' : '';
                var _view = React.createElement("li", {className: "li-menu root-menu no-outline {0}".format(active)}, React.createElement("a", {href: lookup.url, "data-menu": menu.name, className: "no-outline"}, icon, React.createElement("span", null, menu.title), arrow), sub_menus);
                menus.push(_view);
            });
            return menus;
        };
        return InsPageNavBar;
    }(jx.views.ReactiveView));
    exports.InsPageNavBar = InsPageNavBar;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/lib/ins_page_menus.js.map