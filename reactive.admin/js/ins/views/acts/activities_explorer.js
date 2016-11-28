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
define(["require", "exports", 'react', '../../../core/lib', '../lib/lightexplorer', 'react-bootstrap'], function (require, exports, React, jx, li, rb) {
    "use strict";
    var b = rb;
    var ProfileActivsExplorer = (function (_super) {
        __extends(ProfileActivsExplorer, _super);
        function ProfileActivsExplorer(props) {
            _super.call(this, props);
            if (this.props.owner['add_page']) {
                this.props.owner['add_page'](this);
            }
        }
        ProfileActivsExplorer.prototype.get_datalist_settings = function () {
            return {
                allow_delete_row: true,
                allow_edit_row: false,
                model: 'acts',
                row_count: true,
                settings: {
                    "ordering": false,
                    "info": false,
                    searching: false,
                    lengthChange: false,
                    columns: [
                        {
                            title: 'Activity', data: 'ACTSDESCR_EN'
                        }
                    ]
                }
            };
        };
        ProfileActivsExplorer.prototype.get_explorer_title = function () {
            return 'Activities';
        };
        ProfileActivsExplorer.prototype.get_selector_add_new_title = function () {
            return 'Select one or more activities';
        };
        ProfileActivsExplorer.prototype.get_explorer_add_new_label = function () {
            return 'add new activity';
        };
        ProfileActivsExplorer.prototype.get_dataselector_settings = function () {
            var opts = this.get_datalist_settings();
            opts.allow_delete_row = false;
            opts.allow_edit_row = false;
            opts.settings.lengthChange = true;
            opts.settings.searching = true;
            return opts;
        };
        ProfileActivsExplorer.prototype.get_dataselector_view = function (props) {
            var view = React.createElement("div", null, React.createElement("div", {className: "bg-info p-xs"}, React.createElement("h4", null, "ISCO occupation"), React.createElement("h3", null, _.result(this.occp_obj, 'OCCPCONCEPT_EN'))), React.createElement("hr", {className: "hr-line-dashed"}), React.createElement(ProfileActivsSelector, __assign({owner: this}, props)));
            return view;
        };
        ProfileActivsExplorer.prototype.on_notify = function () {
            var _this = this;
            return _super.prototype.on_notify.call(this).then(function (rst) {
                if (_this.current_event.action === 'occp-stored') {
                    _this.occpisco = _.result(_this.current_event.data, 'OCCPISCO');
                    return _this.get_occp_obj();
                }
                return rst;
            });
        };
        ProfileActivsExplorer.prototype.get_datalist_view = function (props) {
            var view = React.createElement(ProfileActivsDatalist, __assign({owner: this}, props));
            return view;
        };
        ProfileActivsExplorer.prototype.get_occp_obj = function () {
            var _this = this;
            var d = Q.defer();
            var ds = new jx.data.DataSource('occp');
            ds.exec_query({
                where: {
                    'OCCPISCO': { 'eq': this.occpisco }
                }
            }).then(function (data) {
                _this.occp_obj = data[0];
            });
            return d.promise;
        };
        ProfileActivsExplorer.prototype.validate_page = function () {
            var ok = _super.prototype.validate_page.call(this);
            if (ok) {
                if (!this.datalist_view.data || this.datalist_view.data.length == 0) {
                    toastr.error('You must select at least one activity');
                    return false;
                }
            }
            this.broadcast({
                action: 'activs-stored',
                data: this.datalist_view.data
            });
            return ok;
        };
        return ProfileActivsExplorer;
    }(li.LightExplorer));
    exports.ProfileActivsExplorer = ProfileActivsExplorer;
    var ProfileActivsSelector = (function (_super) {
        __extends(ProfileActivsSelector, _super);
        function ProfileActivsSelector() {
            _super.apply(this, arguments);
        }
        ProfileActivsSelector.prototype.load_data = function () {
            var _this = this;
            var d = Q.defer();
            var __where = { 'ACTSISCO': { 'startsWith': this.props.occpisco } };
            if (this.props.excluded_ids && this.props.excluded_ids.length > 0) {
                __where = {
                    not: {
                        'ID': {
                            in: _.map(this.props.excluded_ids, function (id) {
                                return "'{0}'".format(id);
                            }) }
                    }
                };
                __where = {
                    'and': [
                        { 'ACTSISCO': { 'startsWith': this.props.occpisco } },
                        {
                            'and': _.map(this.props.excluded_ids, function (id) {
                                return { 'ID': { 'ne': id } };
                            })
                        }
                    ]
                };
            }
            var qry = {
                where: __where,
                orderBy: ["ACTSDESCR_EN"]
            };
            this.ds.fetch_data(qry).then(function () {
                var data = _this.ds.dm.getEntities('acts');
                d.resolve(data);
            }).fail(function (err) {
                toastr.error(JSON.stringify(err));
            });
            return d.promise;
        };
        return ProfileActivsSelector;
    }(li.LightExplorerDataSelector_View));
    var ProfileActivsDatalist = (function (_super) {
        __extends(ProfileActivsDatalist, _super);
        function ProfileActivsDatalist() {
            _super.apply(this, arguments);
        }
        ProfileActivsDatalist.prototype.load_data = function () {
            var _this = this;
            var d = Q.defer();
            var list = deepcopy(this.data);
            if (list.length === 0) {
                list.push('-1');
            }
            var qry = {
                where: { 'ID': { in: list } },
                orderBy: ["ACTSDESCR_EN"]
            };
            this.ds.dm.clear();
            this.ds.fetch_data(qry).then(function () {
                var data = _this.ds.dm.getEntities('acts');
                d.resolve(data);
            }).fail(function (err) {
                toastr.error(JSON.stringify(err));
            });
            return d.promise;
        };
        ProfileActivsDatalist.prototype.on_notify = function () {
            var _this = this;
            return _super.prototype.on_notify.call(this).then(function (rst) {
                if (_this.current_event.action === 'occp-stored') {
                    _this.data.length = 0;
                    _this.local_load_data();
                }
                return true;
            });
        };
        return ProfileActivsDatalist;
    }(li.LightExplorerDatalist_View));
    exports.ProfileActivsDatalist = ProfileActivsDatalist;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/acts/activities_explorer.js.map