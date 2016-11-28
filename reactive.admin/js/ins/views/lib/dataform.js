var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib', 'react-bootstrap', '../../../core/ui'], function (require, exports, React, jx, rb, ui) {
    "use strict";
    var b = rb;
    (function (ActionMode) {
        ActionMode[ActionMode["EditSwitch"] = 0] = "EditSwitch";
        ActionMode[ActionMode["btnDefault"] = 1] = "btnDefault";
        ActionMode[ActionMode["AllowsOn"] = 2] = "AllowsOn";
    })(exports.ActionMode || (exports.ActionMode = {}));
    var ActionMode = exports.ActionMode;
    (function (DataMode) {
        DataMode[DataMode["EditMode"] = 0] = "EditMode";
        DataMode[DataMode["ViewMode"] = 1] = "ViewMode";
    })(exports.DataMode || (exports.DataMode = {}));
    var DataMode = exports.DataMode;
    var DataForm = (function (_super) {
        __extends(DataForm, _super);
        function DataForm(props) {
            _super.call(this, props);
            // init action mode
            this.state.actionmode = props.actionmode;
            if (!this.state.actionmode) {
                this.state.actionmode = ActionMode.EditSwitch;
            }
            this.state.datamode = DataMode.ViewMode;
            this.state.loading = true;
        }
        Object.defineProperty(DataForm.prototype, "ds", {
            get: function () {
                if (!this.__ds) {
                    this.__ds = new jx.data.DataSource(this.get_modelname());
                }
                return this.__ds;
            },
            enumerable: true,
            configurable: true
        });
        DataForm.prototype.get_modelname = function () {
            return this.props.model;
        };
        Object.defineProperty(DataForm.prototype, "item", {
            get: function () {
                if (!this.__item) {
                    if (this.IsNew) {
                        this.__item = this.insert_new();
                    }
                    else {
                        this.__item = this.ds.dm.getEntities(this.get_modelname())[0];
                    }
                }
                return this.__item;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataForm.prototype, "IsNew", {
            get: function () {
                return !this.props.Id;
            },
            enumerable: true,
            configurable: true
        });
        DataForm.prototype.render = function () {
            var ui = this.get_uiSchema();
            var html = React.createElement("form", null, ui.header, " ", ui.buttons, ui.top_separator, ui.uiContent, ui.footer);
            return html;
        };
        DataForm.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.load_data().then(function () {
                            _this.initState({
                                loading: false
                            }, function () {
                                _this.root.find('form').validate();
                                _this.bind_controls();
                            });
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        DataForm.prototype.load_data = function () {
            var _this = this;
            if (!this.IsNew) {
                return this.ds.fetch_data(this.build_whereclause()).then(function () {
                    return [_this.item];
                });
            }
            else {
                return Q.resolve([this.item]);
            }
        };
        DataForm.prototype.build_whereclause = function () {
            var qry = {
                where: {
                    ID: this.props.Id
                }
            };
            return qry;
        };
        DataForm.prototype.bind_controls = function () {
            ko.cleanNode(this.root[0]);
            ko.applyBindings(this.item, this.root[0]);
        };
        DataForm.prototype.insert_new = function () {
            return this.ds.dm.createEntity(this.get_modelname(), this.get_initial_values());
        };
        DataForm.prototype.get_initial_values = function () {
            return {
                ID: utils.guid()
            };
        };
        DataForm.prototype.get_uiContent = function () {
            return {};
        };
        DataForm.prototype.get_uiSchema = function () {
            var ui = {
                header: React.createElement("h1", {style: { display: 'inline-block' }}, this.props.header),
                top_separator: React.createElement("hr", null),
                buttons: this.get_action_buttons(),
                uiContent: this.get_uiContent()
            };
            return ui;
        };
        DataForm.prototype.get_action_buttons = function () {
            var btn_edit_visible = 'hidden';
            var btn_commit_visible = 'hidden';
            var btn_save_enabled = 'default';
            var btn_cancel_enabled = 'default';
            switch (this.state.actionmode) {
                case ActionMode.EditSwitch:
                    {
                        if (this.state.datamode === DataMode.ViewMode) {
                            btn_edit_visible = '';
                        }
                        else {
                            btn_commit_visible = '';
                            btn_save_enabled = 'primary';
                            btn_cancel_enabled = 'warning';
                        }
                    }
                    break;
                case ActionMode.AllowsOn:
                    {
                        btn_commit_visible = '';
                        btn_save_enabled = 'primary';
                        btn_cancel_enabled = 'warning';
                    }
                    break;
                case ActionMode.btnDefault:
                    {
                        btn_commit_visible = '';
                        if (this.state.datamode === DataMode.EditMode) {
                            btn_save_enabled = 'primary';
                            btn_cancel_enabled = 'warning';
                        }
                        else {
                            btn_save_enabled = 'default';
                            btn_cancel_enabled = 'default';
                        }
                    }
                    break;
            }
            var btns = [
                React.createElement(rb.Button, {bsStyle: "{0}".format(btn_cancel_enabled), onClick: this.cancel_edit.bind(this), bsSize: "small", className: "btn-cancel btn-outline pull-right m-l-sm {0}".format(btn_commit_visible)}, React.createElement("i", {className: "fa fa-times"}), " cancel"),
                React.createElement(rb.Button, {bsStyle: "{0}".format(btn_save_enabled), onClick: this.save_data.bind(this), bsSize: "small", className: "btn-save btn-outline pull-right m-l-sm {0}".format(btn_commit_visible)}, React.createElement("i", {className: "fa fa-check"}), " save"),
                React.createElement(rb.Button, {bsStyle: "info", bsSize: "small", onClick: this.enter_edit.bind(this), className: "btn-edit btn-outline pull-right m-l-sm {0}".format(btn_edit_visible)}, React.createElement("i", {className: "fa fa-edit"}), " edit")
            ];
            return btns;
        };
        DataForm.prototype.cancel_edit = function (e) {
            var _this = this;
            this.initState({
                datamode: DataMode.ViewMode
            }, function () {
                _this.bind_controls();
            });
        };
        DataForm.prototype.enter_edit = function (e) {
            var _this = this;
            this.initState({
                datamode: DataMode.EditMode
            }, function () {
                _this.bind_controls();
            });
        };
        DataForm.prototype.save_data = function (e) {
            var _this = this;
            this.initState({
                datamode: DataMode.ViewMode
            }, function () {
                _this.bind_controls();
            });
        };
        return DataForm;
    }(ui.TypeView));
    exports.DataForm = DataForm;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/lib/dataform.js.map