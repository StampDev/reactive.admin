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
define(["require", "exports", 'react', '../../../core/lib', '../../../core/ui', 'react-bootstrap'], function (require, exports, React, jx, ui, rb) {
    "use strict";
    var b = rb;
    var EmployeeCard = (function (_super) {
        __extends(EmployeeCard, _super);
        function EmployeeCard(props) {
            _super.call(this, props);
            _.extend(this.state, props);
        }
        EmployeeCard.prototype.componentWillReceiveProps = function (next) {
            _super.prototype.componentWillReceiveProps.call(this, next);
            _.extend(this.state, next);
        };
        EmployeeCard.prototype.render = function () {
            var __ui = this.get_ui_template();
            var html = React.createElement(b.Row, {style: { marginBottom: 30 }}, React.createElement("form", null, React.createElement(b.Col, {lg: 12}, React.createElement("h1", null, "Profile"), React.createElement("hr", null), React.createElement(b.Col, {lg: 6}, React.createElement("h3", null, "Name"), __ui.name), React.createElement(b.Col, {lg: 6}, React.createElement("h3", null, "Surname"), __ui.surname)), React.createElement(b.Col, {lg: 12}, React.createElement(b.Col, {lg: 6}, React.createElement("h3", null, "Email"), __ui.email), React.createElement(b.Col, {lg: 6}, React.createElement("h3", null, "Phone"), __ui.phone)), React.createElement(b.Col, {lg: 12}, React.createElement(b.Col, {lg: 12}, React.createElement("h3", null, "About"), __ui.aboutme)), React.createElement("br", null)));
            return html;
        };
        EmployeeCard.prototype.get_ui_template = function () {
            var __ui = {
                name: React.createElement(Text, {owner: this, field: "USRRNAME", item: this.props.usrr, icon: "fa fa-user"}),
                surname: React.createElement(Text, {owner: this, field: "USRRSURNAME", item: this.props.usrr, icon: "fa fa-user"}),
                email: React.createElement(Text, {owner: this, field: "USRREMAIL", item: this.props.usrr, icon: "fa fa-envelope-o"}),
                surname1: React.createElement(b.FormGroup, null, React.createElement(b.InputGroup, null, React.createElement(b.InputGroup.Addon, null, React.createElement("i", {className: "fa fa-user"})), React.createElement(b.FormControl, {name: "surname", placeholder: "Surname", "data-bind": "textInput:USRRSURNAME"}))),
                email1: React.createElement(b.FormGroup, null, React.createElement(b.InputGroup, null, React.createElement(b.InputGroup.Addon, null, React.createElement("i", {className: "fa fa-envelope-o"})), React.createElement(b.FormControl, {type: "email", required: true, placeholder: "Email", "data-bind": "textInput:USRREMAIL"}))),
                phone: React.createElement(ui.TextIcon, {icon: "fa-phone", placeholder: "Phone", "data-bind": "textInput:USRRPHONE"}),
                aboutme: React.createElement(ui.TextArea, {placeholder: "About"}),
            };
            return __ui;
        };
        EmployeeCard.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        EmployeeCard.prototype.bind_controls = function () {
            ko.applyBindings(this.props.usrr, this.root.find('form')[0]);
            this.root.find('form').validate();
        };
        return EmployeeCard;
    }(ui.TypeView));
    exports.EmployeeCard = EmployeeCard;
    var EmpsHeaderInfo = (function (_super) {
        __extends(EmpsHeaderInfo, _super);
        function EmpsHeaderInfo() {
            _super.apply(this, arguments);
        }
        EmpsHeaderInfo.prototype.render = function () {
            var html = React.createElement("div", {className: "row", style: { marginBottom: 30 }}, React.createElement("div", {className: "col-md-6"}, React.createElement("div", {className: "profile-image"}, React.createElement("img", {src: "/ins/img/a4.jpg", className: "img-circle circle-border m-b-md", alt: "profile"})), React.createElement("div", {className: "profile-info"}, React.createElement("div", {className: ""}, React.createElement("div", null, React.createElement("h2", {className: "no-margins"}, "Alex Smith"), React.createElement("h4", null, "Founder of Groupeq"), React.createElement("small", null, "There are many variations of passages of Lorem Ipsum available, but the majority" + ' ' + "have suffered alteration in some form Ipsum available."))))), React.createElement("div", {className: "col-md-3"}, React.createElement("table", {className: "table small m-b-xs"}, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "142"), " Projects"), React.createElement("td", null, React.createElement("strong", null, "22"), " Followers")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "61"), " Comments"), React.createElement("td", null, React.createElement("strong", null, "54"), " Articles")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "154"), " Tags"), React.createElement("td", null, React.createElement("strong", null, "32"), " Friends"))))), React.createElement("br", null));
            return html;
        };
        return EmpsHeaderInfo;
    }(ui.TypeView));
    exports.EmpsHeaderInfo = EmpsHeaderInfo;
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text() {
            _super.apply(this, arguments);
        }
        Text.prototype.render = function () {
            var ui = this.get_ui_template();
            ui.input = React.createElement(b.FormControl, __assign({required: this.props.required, placeholder: this.props.placeholder}, this.props));
            var html = React.createElement(b.FormGroup, null, ui.content, React.createElement("span", {className: "errors"}));
            return html;
        };
        Text.prototype.get_ui_template = function () {
            var ui = {};
            ui.input = React.createElement(b.FormControl, __assign({required: this.props.required, placeholder: this.props.placeholder}, this.props));
            if (this.props.icon) {
                ui.content = React.createElement(b.InputGroup, null, React.createElement(b.InputGroup.Addon, null, React.createElement("i", {className: "{0}".format(this.props.icon)})), ui.input);
            }
            else {
                ui.content = ui.input;
            }
            return ui;
        };
        return Text;
    }(ui.TypeView));
    exports.Text = Text;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/emps/emps_view_card.js.map