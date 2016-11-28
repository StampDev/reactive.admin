/// <reference path="../acts/activities_explorer.tsx" />
/// <reference path="../acts/activities_explorer.tsx" />
/// <reference path="../lib/lightexplorer.tsx" />
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
define(["require", "exports", 'react', 'react-bootstrap', '../../../core/lib', '../acts/activities_explorer'], function (require, exports, React, rb, jx, acts) {
    "use strict";
    var b = rb;
    var ProfileEditActivs = (function (_super) {
        __extends(ProfileEditActivs, _super);
        function ProfileEditActivs() {
            _super.apply(this, arguments);
        }
        ProfileEditActivs.prototype.render = function () {
            var html = React.createElement("div", {className: "row"}, React.createElement(b.Col, {lg: 12, className: "p-md"}, React.createElement(ProfileEditActivsExplorer, {owner: this})));
            return html;
        };
        return ProfileEditActivs;
    }(jx.views.ReactiveView));
    exports.ProfileEditActivs = ProfileEditActivs;
    var ProfileEditActivsExplorer = (function (_super) {
        __extends(ProfileEditActivsExplorer, _super);
        function ProfileEditActivsExplorer() {
            _super.apply(this, arguments);
        }
        ProfileEditActivsExplorer.prototype.get_datalist_view = function (props) {
            var view = React.createElement(ProfileEditDataList, __assign({owner: this}, props));
            return view;
        };
        ProfileEditActivsExplorer.prototype.get_datalist_settings = function () {
            var opts = _super.prototype.get_datalist_settings.call(this);
            opts.settings.columns = [
                {
                    title: 'Activity', data: 'ID'
                }
            ];
            return opts;
        };
        ProfileEditActivsExplorer.prototype.get_dataselector_settings = function () {
            var opts = _super.prototype.get_datalist_settings.call(this);
            opts.allow_delete_row = false;
            opts.allow_edit_row = false;
            opts.settings.searching = true;
            opts.settings.lengthChange = true;
            opts.settings.columns = [
                {
                    title: 'Activity', data: 'ACTSDESCR_EN'
                }
            ];
            return opts;
        };
        ProfileEditActivsExplorer.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case 'occp-stored': {
                    this.occpisco = this.current_event.data;
                    return this.get_occp_obj();
                }
                case 'start-spinning':
                    {
                        utils.spin(this.root);
                    }
                    break;
                case 'stop-spinning':
                    {
                        utils.unspin(this.root);
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return ProfileEditActivsExplorer;
    }(acts.ProfileActivsExplorer));
    exports.ProfileEditActivsExplorer = ProfileEditActivsExplorer;
    var ProfileEditDataList = (function (_super) {
        __extends(ProfileEditDataList, _super);
        function ProfileEditDataList() {
            _super.apply(this, arguments);
        }
        ProfileEditDataList.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case 'profile-loaded': {
                    this.prof = this.current_event.data['prof'];
                    this.data.length = 0;
                    _.each(this.prof['proa'](), function (d) {
                        _this.data.push(_.result(d, 'ACTSID'));
                    });
                    this.ds.dm.clear();
                    this.ds.dm.importEntities(this.prof.entityAspect.entityManager.exportEntities());
                    this.occp = this.current_event.data['occp'];
                    this.props.owner.notify({
                        action: 'occp-stored',
                        data: _.result(this.occp, 'OCCPISCO')
                    });
                    this.local_load_data();
                    return Q.resolve(true);
                }
                case 'store_selection': {
                    return _super.prototype.on_notify.call(this).then(function () {
                        return _this.save_data();
                    });
                }
                case 'occp-stored': {
                    var occpid = _.result(this.prof, 'OCCPID');
                    if (_.result(this.current_event.data, 'OCCPID')
                        != occpid) {
                        this.clear_list();
                    }
                    return _super.prototype.on_notify.call(this);
                }
                case jx.constants.events.view_initialized:
                default:
                    return _super.prototype.on_notify.call(this);
            }
        };
        ProfileEditDataList.prototype.clear_list = function () {
            // here we remove activs not related to new occp
            // fetch occp's of activs and check occpisco tree        
        };
        ProfileEditDataList.prototype.do_delete_row = function (e) {
            var _this = this;
            var d = Q.defer();
            _super.prototype.do_delete_row.call(this, e).then(function (ok) {
                _this.save_data().then(function () {
                    d.resolve(true);
                });
            });
            return d.promise;
        };
        ProfileEditDataList.prototype.save_data = function () {
            var _this = this;
            var d = Q.defer();
            this.props.owner.notify({
                action: 'start-spinning'
            });
            this.fix_insertions();
            this.fix_deletions();
            this.ds.saveChanges().then(function () {
                toastr.success('data successfully saved');
                d.resolve(true);
            }).fail(function (err) {
                toastr.error(JSON.stringify(err));
                d.reject(err);
            }).finally(function () {
                _this.props.owner.notify({
                    action: 'stop-spinning'
                });
            });
            return d.promise;
        };
        ProfileEditDataList.prototype.fix_insertions = function () {
            var _this = this;
            var src_ids = _.map(this.ds.dm.getEntities('proa'), function (obj) {
                return _.result(obj, 'ACTSID');
            });
            _.each(this.data, function (id) {
                var to_insert = _.filter(src_ids, function (src_id) {
                    return src_id === id;
                }).length === 0;
                if (to_insert) {
                    _this.ds.dm.createEntity('proa', {
                        ID: utils.guid(),
                        ACTSID: id,
                        PROFID: _.result(_this.prof, 'ID'),
                        OCCPID: _.result(_this.prof, 'OCCPID')
                    });
                }
            });
        };
        ProfileEditDataList.prototype.fix_deletions = function () {
            var _this = this;
            _.each(this.ds.dm.getEntities('proa'), function (obj) {
                var actid = _.result(obj, 'ACTSID');
                var to_delete = _.filter(_this.data, function (id) {
                    return actid === id;
                }).length === 0;
                if (to_delete) {
                    obj.entityAspect.setDeleted();
                }
            });
        };
        ProfileEditDataList.prototype.load_data = function () {
            var ids = _.map(this.data, function (id) {
                return {
                    ID: id
                };
            });
            return Q.resolve(ids);
        };
        ProfileEditDataList.prototype.createdCell = function (cell, cellData, rowData, row, col) {
            if (col === 1) {
                $(cell).empty();
                $(cell).append($('<i class="fa fa-spin fa-spinner" ></i>'));
                var ds = new jx.data.DataSource('acts');
                ds.exec_query({
                    where: {
                        ID: { 'eq': rowData['ID'] }
                    }
                }).then(function (data) {
                    $(cell).empty();
                    var act = data[0];
                    $(cell).append($('<p class="tr-fontsize">{0}</p>'.format(_.result(act, 'ACTSDESCR_EN'))));
                });
            }
        };
        return ProfileEditDataList;
    }(acts.ProfileActivsDatalist));
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/profiles/profile_edit_activs.js.map