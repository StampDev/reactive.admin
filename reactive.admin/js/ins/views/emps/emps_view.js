/// <reference path="../lib/dataform.tsx" />
/// <reference path="emps_view_card.tsx" />
/// <reference path="../../../core/ui.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", 'react', 'react-bootstrap', './emps_view_card', '../../../core/ui', '../lib/dataform'], function (require, exports, React, rb, crd, ui, dataform_1) {
    "use strict";
    var b = rb;
    (function (OpenMode) {
        OpenMode[OpenMode["ADD"] = 0] = "ADD";
        OpenMode[OpenMode["EDIT"] = 1] = "EDIT";
    })(exports.OpenMode || (exports.OpenMode = {}));
    var OpenMode = exports.OpenMode;
    var EmpsView = (function (_super) {
        __extends(EmpsView, _super);
        function EmpsView() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(EmpsView.prototype, "openmode", {
            get: function () {
                return this.props.id ? OpenMode.EDIT : OpenMode.ADD;
            },
            enumerable: true,
            configurable: true
        });
        EmpsView.prototype.render = function () {
            var ui = this.get_ui_template();
            var html = React.createElement("div", {className: "emp-view", style: { minHeight: 650 }}, React.createElement("h1", {className: ui.title_color, style: { marginBottom: 30 }}, ui.icon, " ", ui.title, " ", ui.buttons), React.createElement("hr", null), ui.header_info, ui.content_per_mode);
            return html;
        };
        EmpsView.prototype.get_ui_template = function () {
            var dataform = React.createElement(EmployeeDetails, {Id: this.props.id, header: "Details", model: "usrr", owner: this, actionmode: dataform_1.ActionMode.btnDefault});
            var ui = {
                icon: this.openmode === OpenMode.ADD ? React.createElement("i", {className: "fa fa-user-o", style: { marginRight: 10 }})
                    : React.createElement("i", {className: "fa fa-pencil-square", style: { marginRight: 10 }}),
                title_color: this.openmode != OpenMode.ADD ? 'text-success' : 'text-info',
                title: this.openmode === OpenMode.ADD ? 'Add new employee' : 'Edit new employee',
                delete_button: React.createElement(rb.Button, {bsStyle: "warning", bsSize: "small", className: "btn-outline pull-right"}, React.createElement("i", {className: "fa fa-trash text-warning"})),
                separator: React.createElement("hr", null),
                content_per_mode: dataform,
                header_info: (this.state.loading || this.openmode === OpenMode.ADD) ? null
                    : React.createElement(crd.EmpsHeaderInfo, {owner: this})
            };
            if (this.openmode === OpenMode.ADD) {
                ui.delete_button = null;
            }
            if (this.openmode === OpenMode.EDIT) {
            }
            return ui;
        };
        return EmpsView;
    }(ui.TypeView));
    exports.EmpsView = EmpsView;
    var EmployeeDetails = (function (_super) {
        __extends(EmployeeDetails, _super);
        function EmployeeDetails() {
            _super.apply(this, arguments);
        }
        EmployeeDetails.prototype.insert_new = function () {
            var values = _.extend(_super.prototype.insert_new.call(this), {
                COMPID: this.app.currentUser['compid'],
                USRRPASSWORD: '123456789',
                USRRCREATEDATE: moment().toISOString(),
                USRRTYPE: 1,
                USRRSTATUS: 0
            });
            return values;
        };
        EmployeeDetails.prototype.get_uiContent = function () {
            var __ui = this.get_schema_ui();
            var html = React.createElement(b.Row, {style: { marginBottom: 30 }}, React.createElement(b.Col, {lg: 12}, React.createElement(b.Col, {lg: 6}, React.createElement("h3", null, "Name"), __ui.name), React.createElement(b.Col, {lg: 6}, React.createElement("h3", null, "Surname"), __ui.surname)), React.createElement(b.Col, {lg: 12}, React.createElement(b.Col, {lg: 6}, React.createElement("h3", null, "Email"), __ui.email), React.createElement(b.Col, {lg: 6}, React.createElement("h3", null, "Phone"), __ui.phone)), React.createElement(b.Col, {lg: 12}, React.createElement(b.Col, {lg: 12}, React.createElement("h3", null, "About"), __ui.aboutme)), React.createElement("br", null));
            return html;
        };
        EmployeeDetails.prototype.get_schema_ui = function () {
            var readonly = this.state.datamode === dataform_1.DataMode.ViewMode;
            var __ui = {
                name: React.createElement(Text, {owner: this, bind: "USRRNAME", icon: "fa fa-user"}),
                surname: React.createElement(Text, {owner: this, bind: "USRRSURNAME", icon: "fa fa-user"}),
                email: React.createElement(Text, {owner: this, bind: "USRREMAIL", icon: "fa fa-email"}),
                phone: React.createElement(Text, {owner: this, placeholder: "Phone", bind: "USRRPHONE"}),
                aboutme: React.createElement(ui.TextArea, {placeholder: "About"}),
            };
            return __ui;
        };
        return EmployeeDetails;
    }(dataform_1.DataForm));
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(props) {
            _super.call(this, props);
            this.state.readonly = this.props.readonly;
        }
        Text.prototype.render = function () {
            var ui = this.get_ui_template();
            var html = React.createElement(b.FormGroup, null, ui.content, React.createElement("span", {className: "errors"}));
            return html;
        };
        Text.prototype.componentWillReceiveProps = function (next) {
            _super.prototype.componentWillReceiveProps.call(this, next);
            this.state.readonly = next.readonly;
        };
        Text.prototype.get_ui_template = function () {
            var ui = {};
            var _props = this.props;
            var bind = this.props.bind ? 'textInput:{0}'.format(this.props.bind) : null;
            if (this.state.readonly) {
                bind = 'text:{0}'.format(this.props.bind);
                ui.content = React.createElement("h2", {"data-bind": bind});
            }
            else {
                ui.input = React.createElement(b.FormControl, __assign({bsSize: "large", "data-bind": bind}, _props));
                if (this.props.icon) {
                    ui.content = React.createElement(b.InputGroup, null, React.createElement(b.InputGroup.Addon, null, React.createElement("i", {className: "{0}".format(this.props.icon)})), ui.input);
                }
                else {
                    ui.content = ui.input;
                }
            }
            return ui;
        };
        return Text;
    }(ui.TypeView));
    exports.Text = Text;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/emps/emps_view.js.map