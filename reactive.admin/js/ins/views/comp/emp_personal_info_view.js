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
    var EmpPersonalInfo = (function (_super) {
        __extends(EmpPersonalInfo, _super);
        function EmpPersonalInfo(props) {
            _super.call(this, props);
            this.state.datamode = DataMode.view;
        }
        EmpPersonalInfo.prototype.get_model = function () {
            return 'usr';
        };
        EmpPersonalInfo.prototype.render = function () {
            if (this.state.loading) {
                return React.createElement("i", {className: "fa fa-spin fa-spinner"});
            }
            var viewform = React.createElement(EmpViewForm, {owner: this, usr: this.item});
            if (this.state.datamode === DataMode.edit) {
                viewform = React.createElement(EmpViewFormEdit, {owner: this, usr: this.item});
            }
            var view_visible = this.state.datamode === DataMode.view ? '' : 'hidden';
            var edit_visible = this.state.datamode === DataMode.edit ? '' : 'hidden';
            var html = React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-lg-12"}, React.createElement("div", {className: "m-b-md"}, React.createElement("h2", null, React.createElement("span", {className: "text-success"}, "Personal information"), React.createElement("a", {href: "#", className: "btn btn-primary btn-xs view-mode m-l-sm btn-outline {0} ".format(view_visible), onClick: this.toggle_edit.bind(this)}, React.createElement("span", null, React.createElement("i", {className: "fa fa-edit"}), " edit")), React.createElement("a", {href: "#", className: "btn btn-success btn-xs edit-mode m-l-sm m-r-sm  btn-outline {0}".format(edit_visible), onClick: this.save.bind(this)}, React.createElement("span", null, React.createElement("i", {className: "fa fa-check"}), " save")), React.createElement("a", {href: "#", className: "btn btn-warning btn-xs edit-mode btn-outline {0}".format(edit_visible), onClick: this.cancel.bind(this)}, React.createElement("span", null, React.createElement("i", {className: "fa fa-times"}), " cancel")))), React.createElement(b.Col, {lg: 12}, viewform)));
            return html;
        };
        EmpPersonalInfo.prototype.save = function (e) {
            var _this = this;
            if (!this.ds.dm.hasChanges()) {
                this.toggle_edit(e);
                return;
            }
            utils.spin(this.root);
            var fields = this.item.entityAspect.originalValues;
            var update = _.filter(Object.keys(fields), function (f) {
                return f === "usrname" || f === "usrsurname";
            }).length > 0;
            this.save_data().then(function () {
                toastr.success('Data saved successfully');
                _this.toggle_edit(e);
                if (update) {
                    _this.broadcast({
                        action: 'update-user',
                        data: _this.item
                    });
                }
            }).finally(function () {
                utils.unspin(_this.root);
            });
        };
        EmpPersonalInfo.prototype.cancel = function (e) {
            this.cancel_data();
            this.toggle_edit(e);
        };
        EmpPersonalInfo.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case jx.constants.events.view_data_loaded:
                    {
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        EmpPersonalInfo.prototype.toggle_edit = function (e) {
            var _this = this;
            if (e) {
                e.preventDefault();
            }
            var __datamode = this.state.datamode === DataMode.edit ? DataMode.view : DataMode.edit;
            this.newState({
                datamode: __datamode
            }, function () {
                if (_this.state.datamode === DataMode.edit) {
                    ko.applyBindings(_this.item, _this.root.find('.edit-form')[0]);
                }
            });
            return false;
        };
        return EmpPersonalInfo;
    }(jx.views.ReactiveEditDataView));
    exports.EmpPersonalInfo = EmpPersonalInfo;
    var EmpViewForm = (function (_super) {
        __extends(EmpViewForm, _super);
        function EmpViewForm(props) {
            _super.call(this, props);
            this.state.usr = props.usr;
        }
        Object.defineProperty(EmpViewForm.prototype, "item", {
            get: function () {
                return this.state.usr;
            },
            enumerable: true,
            configurable: true
        });
        EmpViewForm.prototype.render = function () {
            var html = React.createElement("div", {className: "row emp-viewform", style: { fontSize: 15 }}, React.createElement("div", {className: "col-lg-9"}, React.createElement("dl", {className: "dl-horizontal"}, React.createElement("dt", null, "User name: "), " ", React.createElement("dd", null, "{0} {1}".format(_.result(this.item, 'usrname'), _.result(this.item, 'usrsurname'))), React.createElement("dt", null, "Email: "), " ", React.createElement("dd", null, _.result(this.item, 'usremail')), React.createElement("br", null), React.createElement("dt", null, React.createElement("i", {className: "fa fa-linkedin-square m-r-xs"})), " ", React.createElement("dd", null, React.createElement("a", {href: "#"}, " Linkedin url"), " "), React.createElement("dt", null, React.createElement("i", {className: "fa fa-google-plus-square m-r-xs"})), " ", React.createElement("dd", null, React.createElement("a", {href: "#"}, " Google+ url"), " "), React.createElement("dt", null, React.createElement("i", {className: "fa fa-facebook-square m-r-xs"})), " ", React.createElement("dd", null, React.createElement("a", {href: "#"}, " Facebook url"), " "))), React.createElement("div", {className: "col-lg-3", id: "cluster_info"}, React.createElement("dl", {className: "dl-horizontal"})));
            return html;
        };
        return EmpViewForm;
    }(jx.views.ReactiveView));
    var EmpViewFormEdit = (function (_super) {
        __extends(EmpViewFormEdit, _super);
        function EmpViewFormEdit() {
            _super.apply(this, arguments);
        }
        EmpViewFormEdit.prototype.render = function () {
            var html = React.createElement(b.Form, {horizontal: true, className: "edit-form"}, React.createElement(b.Col, {lg: 6, className: ""}, React.createElement("dl", {className: "dl-horizontal"}, React.createElement("dt", {style: { textAlign: 'left', marginLeft: 60, width: 70 }}, "Status: "), React.createElement("dd", {style: { marginLeft: 0 }}, React.createElement("span", {className: "label label-primary"}, "Active"))), React.createElement(TextInput, {owner: this, title: "Name", datamode: DataMode.edit, icon: "fa-user", property: "usrname", type: "text", placeholder: "User name"}), React.createElement(TextInput, {owner: this, title: "Surname", datamode: DataMode.edit, icon: "fa-user", property: "usrsurname", type: "text", placeholder: "User surname"}), React.createElement(TextInput, {owner: this, datamode: DataMode.edit, title: "Email", property: "usremail", icon: "fa-envelope", type: "email", placeholder: "Email"})), React.createElement(b.Col, {lg: 6, className: "", style: { marginTop: 40 }}, React.createElement(SocialLink, {owner: this, datamode: DataMode.edit, title: "Linkedin", property: "usrlinkedin", icon: "fa-linkedin", placeholder: "Linkedin url", type: "text", usr: this.item}), React.createElement(SocialLink, {owner: this, datamode: DataMode.edit, title: "Google+", property: "usrgoogleplus", icon: "fa-google-plus", usr: this.item, type: "text", placeholder: "Google+ url"}), React.createElement(SocialLink, {owner: this, datamode: DataMode.edit, title: "Facebook", property: "usrfacebook", icon: "fa-facebook", usr: this.item, type: "text", placeholder: "Facebook url"})));
            return html;
        };
        return EmpViewFormEdit;
    }(EmpViewForm));
    var DataMode;
    (function (DataMode) {
        DataMode[DataMode["edit"] = 0] = "edit";
        DataMode[DataMode["view"] = 1] = "view";
    })(DataMode || (DataMode = {}));
    var TextInput = (function (_super) {
        __extends(TextInput, _super);
        function TextInput(props) {
            _super.call(this, props);
            this.state.datamode = this.props.datamode;
            if (this.state.datamode === undefined) {
                this.state.datamode = DataMode.view;
            }
        }
        TextInput.prototype.render = function () {
            var view_visible = this.state.datamode === DataMode.view ? '' : 'hidden';
            var edit_visible = this.state.datamode === DataMode.edit ? '' : 'hidden';
            var html = React.createElement(b.FormGroup, {controlId: "formHorizontalEmail"}, React.createElement(b.Col, {componentClass: b.ControlLabel, sm: 4}, "{0}:".format(this.props.title)), React.createElement(b.Col, {sm: 8}, React.createElement("p", {className: "view-mode {0}".format(view_visible), style: { marginTop: 6, marginBottom: 10, fontSize: 15, fontWeight: 300 }}, React.createElement("i", {className: "fa {0} m-r-xs".format(this.props.icon)}), React.createElement("span", {"data-bind": "text:{0}".format(this.props.property)}, this.props.title)), React.createElement("div", {className: "input-group edit-mode {0}".format(edit_visible), style: { margin: 0 }}, React.createElement("span", {className: "input-group-addon"}, React.createElement("i", {className: "fa {0} m-r-xs".format(this.props.icon)})), React.createElement("input", {type: this.props.type, placeholder: this.props.placeholder, className: "form-control", "data-bind": "textInput:{0}".format(this.props.property)}))));
            return html;
        };
        TextInput.prototype.componentWillReceiveProps = function (nextProps) {
            _super.prototype.componentWillReceiveProps.call(this, nextProps);
            this.state.datamode = nextProps.datamode;
        };
        return TextInput;
    }(jx.views.ReactiveView));
    var SocialLink = (function (_super) {
        __extends(SocialLink, _super);
        function SocialLink() {
            _super.apply(this, arguments);
        }
        SocialLink.prototype.render = function () {
            var readonly = React.createElement("span", {"data-bind": "text:{0}".format(this.props.property)}, _.result(this.props.usr, this.props.property));
            var val = _.result(this.props.usr, this.props.property);
            if (!val) {
                readonly = React.createElement("span", null, this.props.placeholder);
            }
            var view_visible = this.state.datamode === DataMode.view ? '' : 'hidden';
            var edit_visible = this.state.datamode === DataMode.edit ? '' : 'hidden';
            var html = React.createElement(b.FormGroup, {controlId: "formHorizontalEmail"}, React.createElement(b.Col, {sm: 12}, React.createElement("p", {className: "view-mode {0} ".format(view_visible), style: { marginTop: 6, marginBottom: 10, fontSize: 15, fontWeight: 300 }}, React.createElement("i", {className: "fa {0} m-r-xs".format(this.props.icon)}), readonly), React.createElement("div", {className: "input-group edit-mode {0}".format(edit_visible), style: { margin: 0 }}, React.createElement("span", {className: "input-group-addon"}, React.createElement("i", {className: "fa {0} m-r-xs".format(this.props.icon)})), React.createElement("input", {type: this.props.type, className: "form-control", placeholder: this.props.placeholder, "data-bind": "textInput:{0}".format(this.props.property)}))));
            return html;
        };
        return SocialLink;
    }(TextInput));
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/comp/emp_personal_info_view.js.map