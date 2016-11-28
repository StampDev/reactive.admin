/// <reference path="../../../core/jx__.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib', 'react-bootstrap'], function (require, exports, React, jx, rb) {
    "use strict";
    var b = rb;
    var InsLoginPage = (function (_super) {
        __extends(InsLoginPage, _super);
        function InsLoginPage(props) {
            _super.call(this, props);
            this.state = {
                txt_login: {},
                txt_password: {}
            };
            this.datacontext = {
                email: '',
                password: ''
            };
        }
        InsLoginPage.prototype.render = function () {
            var html = React.createElement("div", {className: "middle-box text-center loginscreen animated fadeInDown"}, React.createElement("div", null, React.createElement("div", null, React.createElement("h1", {className: "logo-name", style: { marginLeft: -5 }}, "HR+")), React.createElement("h3", null, "Stamp HR"), React.createElement("p", {className: "hidden"}, "Perfectly designed and precisely prepared admin theme with over 50 pages with extra new web app views."), React.createElement("p", null, "Login in and see Stamp HR in action."), React.createElement("form", {role: "form", className: "m-t"}, React.createElement(b.FormGroup, {controlId: "login-email"}, React.createElement(b.FormControl, {type: "email", name: "email", required: true, placeholder: "Email", "data-bind": "textInput:email"})), React.createElement(b.FormGroup, {controlId: "login-passw"}, React.createElement(b.FormControl, {type: "password", name: "password", required: true, placeholder: "Password", "data-bind": "textInput:password"})), React.createElement("button", {className: "btn btn-primary block full-width m-b", type: "button", onClick: this.login.bind(this)}, "Login"), React.createElement("a", {href: "#"}, React.createElement("small", null, "Forgot password?")), React.createElement("p", {className: "text-muted text-center"}, React.createElement("small", null, "Do not have an account?")), React.createElement("a", {href: "/register", className: "btn btn-sm btn-white btn-block"}, "Create an account")), React.createElement("p", {className: "m-t"}, " ", React.createElement("small", null, "stamp dev © 2017"), " ")));
            return html;
        };
        InsLoginPage.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.root.find('.form-group').css('margin-bottom', '10px');
            this.root.find('form').validate();
            ko.applyBindings(this.datacontext, this.root.find('form')[0]);
        };
        InsLoginPage.prototype.login = function () {
            var _this = this;
            if (this.root.find('form').valid()) {
                utils.spin(this.root);
                this.app.login(this.datacontext.email, this.datacontext.password)
                    .then(function () {
                    _this.app.router.navigate('/');
                }).fail(function (err) {
                    toastr.error(JSON.stringify(err));
                }).finally(function () {
                    utils.unspin(_this.root);
                });
            }
        };
        return InsLoginPage;
    }(jx.views.ReactView));
    exports.InsLoginPage = InsLoginPage;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/home/ins_login.js.map