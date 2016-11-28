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
    var InsPageSubNavBar = (function (_super) {
        __extends(InsPageSubNavBar, _super);
        function InsPageSubNavBar() {
            _super.apply(this, arguments);
        }
        InsPageSubNavBar.prototype.render = function () {
            var html = React.createElement("div", {className: "row border-bottom"}, React.createElement("nav", {style: { marginBottom: 0 }, role: "navigation", className: "navbar navbar-static-top"}, React.createElement("div", {className: "navbar-header"}, React.createElement("a", {href: "#", className: "navbar-minimalize minimalize-styl-2 btn btn-primary "}, React.createElement("i", {className: "fa fa-bars"}), " "), React.createElement("form", {action: "search_results.html", className: "navbar-form-custom", role: "search"}, React.createElement("div", {className: "form-group"}, React.createElement("input", {type: "text", id: "top-search", name: "top-search", className: "form-control", placeholder: "Search for something..."})))), React.createElement("ul", {className: "nav navbar-top-links navbar-right"}, React.createElement("li", null, React.createElement("span", {className: "m-r-sm text-muted welcome-message"}, "Welcome to INSPINIA+ Admin Theme.")), React.createElement("li", {className: "dropdown"}, React.createElement("a", {href: "#", "data-toggle": "dropdown", className: "dropdown-toggle count-info"}, React.createElement("i", {className: "fa fa-envelope"}), "  ", React.createElement("span", {className: "label label-warning"}, "16")), React.createElement("ul", {className: "dropdown-menu dropdown-messages"}, React.createElement("li", null, React.createElement("div", {className: "dropdown-messages-box"}, React.createElement("a", {className: "pull-left", href: "profile.html"}, React.createElement("img", {src: "/ins/img/a7.jpg", className: "img-circle", alt: "image"})), React.createElement("div", {className: "media-body"}, React.createElement("small", {className: "pull-right"}, "46h ago"), React.createElement("strong", null, "Mike Loreipsum"), " started following ", React.createElement("strong", null, "Monica Smith"), ". ", React.createElement("br", null), React.createElement("small", {className: "text-muted"}, "3 days ago at 7:58 pm - 10.06.2014")))), React.createElement("li", {className: "divider"}), React.createElement("li", null, React.createElement("div", {className: "dropdown-messages-box"}, React.createElement("a", {className: "pull-left", href: "profile.html"}, React.createElement("img", {src: "/ins/img/a4.jpg", className: "img-circle", alt: "image"})), React.createElement("div", {className: "media-body "}, React.createElement("small", {className: "pull-right text-navy"}, "5h ago"), React.createElement("strong", null, "Chris Johnatan Overtunk"), " started following ", React.createElement("strong", null, "Monica Smith"), ". ", React.createElement("br", null), React.createElement("small", {className: "text-muted"}, "Yesterday 1:21 pm - 11.06.2014")))), React.createElement("li", {className: "divider"}), React.createElement("li", null, React.createElement("div", {className: "dropdown-messages-box"}, React.createElement("a", {className: "pull-left", href: "profile.html"}, React.createElement("img", {src: "/ins/img/profile.jpg", className: "img-circle", alt: "image"})), React.createElement("div", {className: "media-body "}, React.createElement("small", {className: "pull-right"}, "23h ago"), React.createElement("strong", null, "Monica Smith"), " love ", React.createElement("strong", null, "Kim Smith"), ". ", React.createElement("br", null), React.createElement("small", {className: "text-muted"}, "2 days ago at 2:30 am - 11.06.2014")))), React.createElement("li", {className: "divider"}), React.createElement("li", null, React.createElement("div", {className: "text-center link-block"}, React.createElement("a", {href: "mailbox.html"}, React.createElement("i", {className: "fa fa-envelope"}), " ", React.createElement("strong", null, "Read All Messages")))))), React.createElement("li", {className: "dropdown"}, React.createElement("a", {href: "#", "data-toggle": "dropdown", className: "dropdown-toggle count-info"}, React.createElement("i", {className: "fa fa-bell"}), "  ", React.createElement("span", {className: "label label-primary"}, "8")), React.createElement("ul", {className: "dropdown-menu dropdown-alerts"}, React.createElement("li", null, React.createElement("a", {href: "mailbox.html"}, React.createElement("div", null, React.createElement("i", {className: "fa fa-envelope fa-fw"}), " You have 16 messages", React.createElement("span", {className: "pull-right text-muted small"}, "4 minutes ago")))), React.createElement("li", {className: "divider"}), React.createElement("li", null, React.createElement("a", {href: "profile.html"}, React.createElement("div", null, React.createElement("i", {className: "fa fa-twitter fa-fw"}), " 3 New Followers", React.createElement("span", {className: "pull-right text-muted small"}, "12 minutes ago")))), React.createElement("li", {className: "divider"}), React.createElement("li", null, React.createElement("a", {href: "grid_options.html"}, React.createElement("div", null, React.createElement("i", {className: "fa fa-upload fa-fw"}), " Server Rebooted", React.createElement("span", {className: "pull-right text-muted small"}, "4 minutes ago")))), React.createElement("li", {className: "divider"}), React.createElement("li", null, React.createElement("div", {className: "text-center link-block"}, React.createElement("a", {href: "notifications.html"}, React.createElement("strong", null, "See All Alerts"), React.createElement("i", {className: "fa fa-angle-right"})))))), React.createElement("li", null, React.createElement("a", {href: "login.html"}, React.createElement("i", {className: "fa fa-sign-out"}), " Log out")), React.createElement("li", null, React.createElement("a", {className: "right-sidebar-toggle"}, React.createElement("i", {className: "fa fa-tasks"}))))));
            return html;
        };
        return InsPageSubNavBar;
    }(jx.views.ReactView));
    exports.InsPageSubNavBar = InsPageSubNavBar;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/market/lib/ins_page_subnavbar.js.map