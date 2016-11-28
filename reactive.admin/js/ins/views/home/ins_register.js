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
            this.datacontext = {
                name: '',
                surname: '',
                email: '',
                compname: '',
                password: ''
            };
        }
        InsLoginPage.prototype.render = function () {
            var html = React.createElement("div", {className: "middle-box text-center loginscreen animated fadeInDown"}, React.createElement("div", null, React.createElement("div", null, React.createElement("h1", {className: "logo-name"}, "HR+")), React.createElement("h2", null, "Stamp HR"), React.createElement("p", null, "Create a new account on Stamp HR and see it in action."), React.createElement("form", {role: "form", className: "m-t"}, React.createElement(b.FormGroup, {controlId: "register-comp"}, React.createElement(b.FormControl, {type: "text", name: "comp", required: true, placeholder: "Company name", "data-bind": "textInput:compname"})), React.createElement(b.FormGroup, {controlId: "register-name"}, React.createElement(b.FormControl, {type: "text", name: "name", required: true, placeholder: "First name", "data-bind": "textInput:name"})), React.createElement(b.FormGroup, {controlId: "register-surname"}, React.createElement(b.FormControl, {type: "text", name: "surname", required: true, placeholder: "Last name", "data-bind": "textInput:surname"})), React.createElement(b.FormGroup, {controlId: "login-email"}, React.createElement(b.FormControl, {type: "email", name: "email", required: true, placeholder: "Email", "data-bind": "textInput:email"})), React.createElement(b.FormGroup, {controlId: "login-passw"}, React.createElement(b.FormControl, {type: "password", name: "password", required: true, placeholder: "Password", "data-bind": "textInput:password"})), React.createElement("div", {className: "form-group"}, React.createElement(jx.controls.CheckBox, null), React.createElement("span", {className: "m-l-xs"}, "Agree the terms and policy")), React.createElement("button", {type: "button", className: "btn btn-primary block full-width m-b", onClick: this.register.bind(this)}, "Register"), React.createElement("p", {className: "text-muted text-center"}, React.createElement("small", null, "Already have an account?")), React.createElement("a", {className: "btn btn-sm btn-white btn-block", href: "/login"}, "Login")), React.createElement("p", {className: "m-t"}, " ", React.createElement("small", null, "stamp dev © 2017"), " ")));
            return html;
        };
        InsLoginPage.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.root.find('.form-group').css('margin-bottom', '10px');
            this.root.find('form').validate();
            ko.applyBindings(this.datacontext, this.root.find('form')[0]);
        };
        InsLoginPage.prototype.register = function () {
            var _this = this;
            if (this.root.find('form').valid()) {
                utils.spin(this.root);
                var user = new Backendless.User();
                user['name'] = user.username = this.datacontext.name;
                user.username = this.datacontext.name;
                user.email = this.datacontext.email;
                user.password = this.datacontext.password;
                Backendless.UserService.register(user, new Backendless.Async(function (rst) {
                    _this.create_new_comp().then(function () {
                        _this.app.login(_this.datacontext.email, _this.datacontext.password)
                            .then(function () {
                            _this.app.router.navigate('/company/chart');
                        }).fail(function (err) {
                            _this.error(err);
                            utils.unspin(_this.root);
                        });
                    }).fail(function (err) {
                        toastr.error(JSON.stringify(err));
                    }).finally(function () {
                        utils.unspin(_this.root);
                    });
                }, function (err) {
                    toastr.error(JSON.stringify(err));
                    utils.unspin(_this.root);
                }));
            }
        };
        InsLoginPage.prototype.create_new_comp = function () {
            var _this = this;
            var d = Q.defer();
            var dx = new jx.bx.DataSource('comp');
            var ds = new jx.data.DataSource('comp');
            var id = utils.guid();
            ds.dm.createEntity('comp', {
                ID: id,
                COMPNAME: this.datacontext.compname,
                COMPEMAIL: this.datacontext.email,
                COMPCOUNTRY: 'GR',
                COMPADDRESS: ' '
            });
            ds.saveChanges().then(function (rst) {
                var usr = Backendless.UserService.getCurrentUser();
                usr.compid = id;
                Backendless.UserService.update(usr, new Backendless.Async(function (arg) {
                    _this.add_dept(id).then(function () {
                        d.resolve(true);
                    });
                }, function (err) {
                    d.reject(err);
                }));
            }).fail(function (err) {
                d.reject(err);
            });
            return d.promise;
        };
        InsLoginPage.prototype.add_dept = function (compid) {
            var _this = this;
            var d = Q.defer();
            var ds = new jx.data.DataSource('compdept');
            var dept = ds.dm.createEntity('compdept', {
                id: utils.guid(),
                compid: compid,
                deptname: 'Main department'
            });
            ds.saveChanges().then(function () {
                var usr_ds = new jx.data.DataSource('emp');
                usr_ds.call({
                    method: 'invite_new_user',
                    params: {
                        usremail: _this.datacontext.email,
                        name: _this.datacontext.name,
                        surname: _this.datacontext.surname,
                        usrstatus: 1,
                        compid: _this.app.CompId,
                        deptid: _.result(dept, 'id')
                    }
                }).then(function () {
                    d.resolve(true);
                }).fail(function (err) {
                    toastr.error(JSON.stringify(err));
                    d.reject(false);
                });
            }).fail(function (err) {
                toastr.error(JSON.stringify(err));
            });
            return d.promise;
        };
        return InsLoginPage;
    }(jx.views.ReactView));
    exports.InsLoginPage = InsLoginPage;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/home/ins_register.js.map