/// <reference path="profile_occptree.tsx" />
/// <reference path="profiles_new.tsx" />
/// <reference path="../../../../typings/sweetalert/sweetalert.d.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-bootstrap', '../../../core/lib', './profile_occptree'], function (require, exports, React, rb, jx, profile_occptree_1) {
    "use strict";
    var b = rb;
    var DataMode;
    (function (DataMode) {
        DataMode[DataMode["view"] = 0] = "view";
        DataMode[DataMode["edit"] = 1] = "edit";
    })(DataMode || (DataMode = {}));
    var ProfileEditBasicInfo = (function (_super) {
        __extends(ProfileEditBasicInfo, _super);
        function ProfileEditBasicInfo(props) {
            _super.call(this, props);
            this.state.datamode = DataMode.view;
        }
        Object.defineProperty(ProfileEditBasicInfo.prototype, "ds", {
            get: function () {
                var _this = this;
                if (!this.__ds) {
                    this.__ds = new jx.data.DataSource('prof');
                    this.__ds.dm.entityChanged.subscribe(function (args) {
                        _this.entity_changed(args);
                    });
                }
                return this.__ds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileEditBasicInfo.prototype, "prof", {
            get: function () {
                return this.ds.dm.getEntities('prof')[0];
            },
            enumerable: true,
            configurable: true
        });
        ProfileEditBasicInfo.prototype.entity_changed = function (args) {
            if (args.entityAction === breeze.EntityAction.PropertyChange) {
                this.newState({
                    datamode: DataMode.edit
                });
            }
            else {
                this.newState({
                    datamode: DataMode.view
                });
            }
        };
        ProfileEditBasicInfo.prototype.render = function () {
            var _this = this;
            var can_save = this.state.datamode === DataMode.edit ? 'primary' : 'default';
            var can_cancel = this.state.datamode === DataMode.edit ? 'warning' : 'default';
            var html = React.createElement(b.Row, null, React.createElement("div", null, React.createElement(b.Col, {lg: 12}, React.createElement("h1", {style: { display: 'inline-block' }}, "Basic information"), React.createElement(rb.Button, {bsStyle: can_cancel, bsSize: "small", onClick: this.cancel_edit.bind(this), className: "pull-right"}, React.createElement("i", {className: "fa fa-times"}), " cancel"), React.createElement(rb.Button, {bsStyle: can_save, bsSize: "small", onClick: this.save_changes.bind(this), className: "pull-right m-r-xs"}, React.createElement("i", {className: "fa fa-check"}), " save")), React.createElement(b.Col, {lg: 12}, React.createElement("hr", null)), React.createElement(b.Col, {lg: 12}, React.createElement("form", {style: {}}, React.createElement("h3", null, "Profile title"), React.createElement(b.FormGroup, null, React.createElement(b.FormControl, {name: "proftitle", type: "text", "data-bind": "textInput:PROFTITLE"})), React.createElement("br", null), React.createElement("h3", null, React.createElement("span", {className: "isco-title"}, "Isco occupation"), React.createElement(rb.Button, {bsStyle: "primary", onClick: this.select_occp.bind(this), className: "btn-outline pull-right hidden"}, "select the profile isco occupation")), React.createElement("div", {className: "m-t-sm"}, React.createElement("h3", null, React.createElement("strong", {className: "occp text-info"}))), React.createElement("br", null), React.createElement("h3", null, "Profile description"), React.createElement(jx.controls.QuillEditor, {onChange: this.on_descr_changed.bind(this), entity: this.prof, property: "PROFDESCRIPTION"})))), React.createElement(jx.modal.Modal, {ref: 'modal', title: "Select an isco occupation", bsSize: "lg", onFinish: function () { return _this.store_occp_select(); }}));
            return html;
        };
        ProfileEditBasicInfo.prototype.on_descr_changed = function () {
        };
        ProfileEditBasicInfo.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.load_profile().then(function () {
                            _this.update_occp(_.result(_this.prof, 'OCCPID')).done();
                            _this.apply_bindings();
                        });
                    }
                    break;
                case 'occp-selected':
                    {
                        this.occpinfo = this.current_event.data;
                    }
                    break;
                case 'occp-unselected':
                    {
                        this.occpinfo = null;
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        ProfileEditBasicInfo.prototype.select_occp = function (e) {
            e.preventDefault();
            this.refs['modal'].show(React.createElement(profile_occptree_1.OccpTreeView, {owner: this}));
        };
        ProfileEditBasicInfo.prototype.store_occp_select = function () {
            var _this = this;
            var d = Q.defer();
            var opts = {
                title: 'Warning',
                text: 'Activities and Skills not associated with the selected isco occupation will be deleted. Continue?',
                type: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
            };
            swal(opts, function (ok) {
                if (ok) {
                    _this.update_occp(_this.current_event.data['occpid'], true);
                    d.resolve(true);
                }
                else {
                    d.reject(false);
                }
            });
            return d.promise;
        };
        ProfileEditBasicInfo.prototype.update_occp = function (occpid, reset) {
            var _this = this;
            var ds = new jx.data.DataSource('occp');
            this.root.find('.occp').empty();
            this.root.find('.occp').append($('<i class="fa fa-spin fa-spinner" ></i>'));
            return ds.fetch_data({
                where: {
                    'ID': occpid
                }
            }).then(function (data) {
                _this.root.find('.occp').html(_.result(data[0], 'OCCPCONCEPT_EN'));
                if (reset) {
                    _this.prof['OCCPID'](_this.occpinfo['occpid']);
                    _this.broadcast({
                        action: 'occp-stored',
                        data: data[0]
                    });
                }
                return true;
            }).fail(function (err) {
                toastr.error(JSON.stringify(err));
                return false;
            });
        };
        ProfileEditBasicInfo.prototype.apply_bindings = function () {
            ko.applyBindings(this.prof, this.root.find('form')[0]);
        };
        ProfileEditBasicInfo.prototype.load_profile = function () {
            var _this = this;
            utils.spin(this.root);
            var d = Q.defer();
            this.ds.fetch_data({
                where: {
                    ID: { 'eq': this.props.profid }
                }
            }).then(function () {
                d.resolve(true);
            }).finally(function () {
                utils.unspin(_this.root);
            });
            return d.promise;
        };
        ProfileEditBasicInfo.prototype.cancel_edit = function () {
            var _this = this;
            if (this.state.datamode != DataMode.edit) {
                return;
            }
            if (this.ds.dm.hasChanges()) {
                utils.can_looseChanges({
                    title: 'Do you want cancel changes made this profile?',
                    text: 'These changes will be lost'
                }).then(function (ok) {
                    if (ok) {
                        var occpid = _this.prof.entityAspect.originalValues['OCCPID'];
                        if (occpid != _.result(_this.prof, 'OCCPID')) {
                            _this.update_occp(occpid, true)
                                .then(function () {
                                _this.ds.dm['rejectChanges']();
                                _this.newState({
                                    datamode: DataMode.view
                                });
                            });
                        }
                        else {
                            _this.ds.dm['rejectChanges']();
                            _this.newState({
                                datamode: DataMode.view
                            });
                        }
                    }
                });
            }
        };
        ProfileEditBasicInfo.prototype.save_changes = function () {
            var _this = this;
            if (this.state.datamode != DataMode.edit) {
                return;
            }
            var d = Q.defer();
            if (this.ds.dm.hasChanges()) {
                utils.spin(this.root);
                this.ds.saveChanges().then(function () {
                    toastr.success('Data saved successfully');
                    _this.broadcast({
                        action: 'profile-saved',
                        data: _this.prof
                    });
                    d.resolve(true);
                }).fail(function (err) {
                    toastr.error(JSON.stringify(err));
                    d.reject(false);
                }).finally(function () {
                    utils.unspin(_this.root);
                });
            }
            return d.promise;
        };
        return ProfileEditBasicInfo;
    }(jx.views.ReactiveView));
    exports.ProfileEditBasicInfo = ProfileEditBasicInfo;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/profiles/profile_edit_basicinfo.js.map