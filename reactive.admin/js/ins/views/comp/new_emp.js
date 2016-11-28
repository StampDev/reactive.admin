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
    var NewEmployeeView = (function (_super) {
        __extends(NewEmployeeView, _super);
        function NewEmployeeView(props) {
            var _this = this;
            _super.call(this, props);
            this.active_tab = 1;
            this.props.modal.save = function () {
                _this.on_save().then(function () {
                    _this.props.modal.close();
                });
            };
        }
        NewEmployeeView.prototype.render = function () {
            var _this = this;
            var tabs = [
                {
                    title: 'Invite by email',
                    content: function () {
                        var html = React.createElement("div", {"data-tab": 1}, React.createElement(InvitationMail, null));
                        return html;
                    }
                },
                {
                    title: 'Register new user',
                    content: function () {
                        var html = React.createElement("div", {"data-tab": 2}, React.createElement(RegisterEmp, {deptid: _this.props.deptid}));
                        return html;
                    }
                }
            ];
            var html = React.createElement(b.Row, {style: { 'background-color': '#ffffff', height: 365 }}, React.createElement(b.Col, {lg: 12, className: "p-sm register-form"}, React.createElement(RegisterEmp, {deptid: this.props.deptid})));
            return html;
        };
        NewEmployeeView.prototype.on_tabchange = function (tab) {
            this.active_tab = tab;
        };
        NewEmployeeView.prototype.on_save = function () {
            var $form = this.root.find('.register-form form');
            if (!$form.valid()) {
                return Q.reject(false);
            }
            return this.invite_usr({
                usremail: $form.find('[name="usremail"]').val(),
                usrname: $form.find('[name="usrname"]').val(),
                usrsurname: $form.find('[name="usrsurname"]').val(),
                usrstatus: jx.constants.data.USRSTATUS.Pendning
            });
        };
        NewEmployeeView.prototype.invite_usr = function (args) {
            var _this = this;
            utils.spin(this.root);
            var d = Q.defer();
            var user = new Backendless.User();
            user['name'] = args.usrname;
            user.username = args.usrname;
            user['usersurname'] = args.usrname;
            user['usrstatus'] = 1;
            user['compid'] = this.app.CompId;
            user.email = args.usremail;
            user.password = '1234567890';
            Backendless.UserService.register(user, new Backendless.Async(function (rst) {
                var qry = new Backendless.DataQuery();
                qry.condition = "email='{0}'".format(args.usremail);
                Backendless.Data.of(Backendless.User).find(qry, new Backendless.Async(function (rst) {
                    var emp = {
                        ___class: 'emp',
                        usrid: rst['data'][0]['objectId'],
                        empemail: args.usremail,
                        compid: _this.app.CompId,
                        deptid: _this.props.deptid
                    };
                    Backendless.Persistence.of('emp').save(emp, new Backendless.Async(function (rst) {
                        toastr.success('Employee successfully invited');
                        _this.broadcast({
                            action: 'emp-reload'
                        });
                        d.resolve(true);
                    }, function (err) {
                        toastr.error(JSON.stringify(err));
                    }));
                }, function (err) {
                }));
            }, function (err) {
                toastr.error(JSON.stringify(err));
            }));
            return d.promise;
        };
        NewEmployeeView.prototype.register_user = function () {
            return Q.resolve(true);
        };
        return NewEmployeeView;
    }(jx.views.ReactiveView));
    exports.NewEmployeeView = NewEmployeeView;
    var TabControl = (function (_super) {
        __extends(TabControl, _super);
        function TabControl() {
            _super.apply(this, arguments);
        }
        TabControl.prototype.render = function () {
            var index = 1;
            var menus = [];
            var panes = [];
            _.each(this.props.tabs, function (tab) {
                var id = utils.guid();
                var tabindex = index++;
                var active = tabindex === 1 ? 'active' : '';
                var href = 'tab-{0}'.format(id);
                var li = React.createElement("li", {role: "presentation", className: active}, React.createElement("a", {href: '#' + href, role: "tab", "data-toggle": "tab", "data-tabindex": tabindex}, tab.title));
                menus.push(li);
                var pane = React.createElement("div", {role: "tabpanel", id: href, className: "tab-pane {0}".format(active)}, tab.content());
                panes.push(pane);
            });
            var html = React.createElement("div", null, React.createElement("ul", {className: "nav nav-tabs", role: "tablist"}, menus), React.createElement("div", {className: "tab-content"}, panes));
            return html;
        };
        TabControl.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                            var tabindex = $(e.currentTarget).attr('data-tabindex');
                            if (_this.props.on_tabchange) {
                                _this.props.on_tabchange(tabindex);
                            }
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return TabControl;
    }(jx.views.ReactiveView));
    var InvitationMail = (function (_super) {
        __extends(InvitationMail, _super);
        function InvitationMail() {
            _super.apply(this, arguments);
        }
        InvitationMail.prototype.render = function () {
            var template = {
                text: "<p><h3>Stamp registration</h3><p>\n                   <p>Welcome to Stamp!</p>\n                   <p>To complete your registration, please click the link below:</p>\n                   <p class=\"text-info\"><a href=\"http://www.stamp.com?registration=1234\">http://www.stamp.com?registration=1234</a></p>"
            };
            var html = React.createElement("div", null, React.createElement("h2", null, "Send an invitation email"), React.createElement("form", null, React.createElement(b.FormGroup, {className: "m-b-sm"}, React.createElement(b.InputGroup, null, React.createElement(b.InputGroup.Addon, null, React.createElement("i", {className: "fa fa-envelope-o"})), React.createElement(b.FormControl, {type: "email", name: "email", required: true, placeholder: "Enter valid email"})), React.createElement("span", {className: "error-tag"})), React.createElement("br", null), React.createElement(jx.controls.QuillEditor, {minheight: 100, entity: template, property: "text"})));
            return html;
        };
        InvitationMail.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root.find('form').validate({
                            rules: {
                                email: {
                                    email: true,
                                    required: true
                                }
                            },
                            errorPlacement: function (err, el) {
                                $(el).closest('form').find('.error-tag').html(err);
                            }
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return InvitationMail;
    }(jx.views.ReactiveView));
    var RegisterEmp = (function (_super) {
        __extends(RegisterEmp, _super);
        function RegisterEmp() {
            _super.apply(this, arguments);
        }
        RegisterEmp.prototype.render = function () {
            var html = React.createElement("form", null, React.createElement("div", {className: "row", style: { marginTop: 0 }}, React.createElement(b.Col, {lg: 12, style: { marginTop: 0 }}, React.createElement("h2", null, "Email"), React.createElement(b.FormGroup, {className: "m-b-sm"}, React.createElement(b.InputGroup, null, React.createElement(b.InputGroup.Addon, null, React.createElement("i", {className: "fa fa-envelope-o"})), React.createElement(b.FormControl, {type: "email", name: "usremail", required: true, placeholder: "Enter valid email"})), React.createElement("span", {className: "error-tag"}))), React.createElement(b.Col, {lg: 6}, React.createElement("h2", null, "Name"), React.createElement(b.FormGroup, null, React.createElement(b.InputGroup, null, React.createElement(b.InputGroup.Addon, null, React.createElement("i", {className: "fa fa-user"})), React.createElement(b.FormControl, {type: "text", name: "usrname", required: true, placeholder: "Name"})), React.createElement("span", {className: "error-tag"}))), React.createElement(b.Col, {lg: 6}, React.createElement("h2", null, "Surname"), React.createElement(b.FormGroup, {className: "m-b-sm"}, React.createElement(b.InputGroup, null, React.createElement(b.InputGroup.Addon, null, React.createElement("i", {className: "fa fa-user"})), React.createElement(b.FormControl, {type: "text", name: "surname", required: true, placeholder: "Surname"})), React.createElement("span", {className: "error-tag"}))), React.createElement(b.Col, {lg: 12}, React.createElement("h2", null, "Department"), React.createElement("div", {className: "form-group m-b-sm"}, React.createElement("select", {className: "form-control m-b depts-select"})))));
            return html;
        };
        Object.defineProperty(RegisterEmp.prototype, "ds_depts", {
            get: function () {
                if (!this._depts_ds) {
                    this._depts_ds = new jx.data.DataSource('compdept');
                }
                return this._depts_ds;
            },
            enumerable: true,
            configurable: true
        });
        RegisterEmp.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root.validate({
                            rules: {
                                usremail: {
                                    email: true,
                                    required: true
                                },
                                usrname: { required: true },
                                usrsurname: { required: true },
                            },
                            errorPlacement: function (err, el) {
                                $(el).closest('form').find('.error-tag').html(err);
                            }
                        });
                        this.load_departments().then(function (data) {
                            _this.fill_options();
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        RegisterEmp.prototype.fill_options = function () {
            var data = this.state.items;
            if (!data.length) {
                return;
            }
            if (this.count === undefined) {
                this.count = 0;
            }
            var dept = this.state.items[0];
            var options = [{
                    id: this.props.deptid,
                    text: _.result(dept, 'deptname')
                }];
            this.root.find('.depts-select').on('change', function (e) {
            });
            this.root.find('.depts-select')['select2']({
                minimumResultsForSearch: Infinity,
                data: options
            });
            this.root.find('.select2-container').css('width', '100%');
        };
        RegisterEmp.prototype.load_departments = function () {
            var _this = this;
            var d = Q.defer();
            var qry = new Backendless.DataQuery();
            if (this.props.deptid) {
                qry.condition = "objectId='{0}'".format(this.props.deptid);
            }
            Backendless.Persistence.of('compdept').find(qry, new Backendless.Async(function (rst) {
                _this.state.items = rst['data'];
                d.resolve(rst['data']);
            }, function (err) {
                d.reject(err);
            }));
            return d.promise;
        };
        return RegisterEmp;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/comp/new_emp.js.map