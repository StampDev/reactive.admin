/// <reference path="../../../core/jx__.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib'], function (require, exports, React, jx) {
    "use strict";
    var InsLoginPage = (function (_super) {
        __extends(InsLoginPage, _super);
        function InsLoginPage() {
            _super.apply(this, arguments);
        }
        InsLoginPage.prototype.render = function () {
            var html = React.createElement("div", {className: "middle-box text-center loginscreen animated fadeInDown"}, React.createElement("div", null, React.createElement("div", null, React.createElement("h1", {className: "logo-name"}, "AF+")), React.createElement("h3", null, "Afriknet Market"), React.createElement("p", null, "Perfectly designed and precisely prepared admin theme with over 50 pages with extra new web app views."), React.createElement("p", null, "Login in.To see it in action."), React.createElement("form", {action: "index.html", role: "form", className: "m-t"}, React.createElement("div", {className: "form-group"}, React.createElement("input", {type: "email", required: true, placeholder: "Username", className: "form-control"})), React.createElement("div", {className: "form-group"}, React.createElement("input", {type: "password", required: true, placeholder: "Password", className: "form-control"})), React.createElement("button", {className: "btn btn-primary block full-width m-b", type: "submit"}, "Login"), React.createElement("a", {href: "#"}, React.createElement("small", null, "Forgot password?")), React.createElement("p", {className: "text-muted text-center"}, React.createElement("small", null, "Do not have an account?")), React.createElement("a", {href: "register.html", className: "btn btn-sm btn-white btn-block"}, "Create an account")), React.createElement("p", {className: "m-t"}, " ", React.createElement("small", null, "Inspinia we app framework base on Bootstrap 3 © 2014"), " ")));
            return html;
        };
        return InsLoginPage;
    }(jx.views.ReactView));
    exports.InsLoginPage = InsLoginPage;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/market/views/home/ins_login.js.map