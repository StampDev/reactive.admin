/// <amd-dependency path="url-pattern" />
// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../core/lib', "url-pattern"], function (require, exports, React, jx) {
    "use strict";
    var _urlp = require('url-pattern');
    var InsPageBreadCrumb = (function (_super) {
        __extends(InsPageBreadCrumb, _super);
        function InsPageBreadCrumb() {
            _super.apply(this, arguments);
        }
        InsPageBreadCrumb.prototype.render = function () {
            var route = jx.local.get(jx.constants.router.current_route);
            var menu = this.app.router.find_matching_menu(route.path);
            var parent = _.find(this.app.router.flatten_menus, function (mn) { return mn.name === menu.parent; });
            var header = parent ? (parent.header ? parent.header : parent.title)
                : menu.header ? menu.header : menu.title;
            var items = [];
            if (menu.name != 'home') {
                items.push(React.createElement("li", null, React.createElement("a", {href: "/"}, "Home")));
                if (parent) {
                    items.push(React.createElement("li", null, React.createElement("a", {href: "#"}, parent.title)));
                }
                var title = menu.header ? menu.header : menu.title;
                items.push(React.createElement("li", {className: "active"}, React.createElement("a", {href: "#"}, React.createElement("strong", null, title))));
            }
            var html = React.createElement("div", {className: "row wrapper border-bottom white-bg page-heading"}, React.createElement("div", {className: "col-lg-5"}, React.createElement("h2", null, header), React.createElement("ol", {className: "breadcrumb"}, items)), React.createElement("div", {className: "col-lg-7"}, React.createElement("div", {className: ""}, this.state.custom_content)));
            return html;
        };
        InsPageBreadCrumb.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case 'update-page-title':
                    {
                        this.setState({
                            pagetitle: this.current_event.data
                        });
                    }
                    break;
                case 'on-custom-content':
                    {
                        this.newState({
                            custom_content: this.current_event.data
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return InsPageBreadCrumb;
    }(jx.views.ReactiveView));
    exports.InsPageBreadCrumb = InsPageBreadCrumb;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/lib/ins_page_breadcrumb.js.map