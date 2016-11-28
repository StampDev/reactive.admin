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
    var Page404 = (function (_super) {
        __extends(Page404, _super);
        function Page404() {
            _super.apply(this, arguments);
        }
        Page404.prototype.render = function () {
            var html = React.createElement("div", {className: "middle-box text-center animated fadeInDown"}, React.createElement("h1", null, "404"), React.createElement("h3", {className: "font-bold"}, "Page Not Found"), React.createElement("div", {className: "error-desc"}, "Sorry, but the page you are looking for has note been found.Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.", React.createElement("form", {role: "form", className: "form-inline m-t"}, React.createElement("div", {className: "form-group"}, React.createElement("input", {type: "text", placeholder: "Search for page", className: "form-control"})), React.createElement("button", {className: "btn btn-primary", type: "submit"}, "Search"))));
            return html;
        };
        return Page404;
    }(jx.views.ReactView));
    exports.Page404 = Page404;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/market/views/404page.js.map