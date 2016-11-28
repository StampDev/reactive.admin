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
    var ProfSkillsExplorer = (function (_super) {
        __extends(ProfSkillsExplorer, _super);
        function ProfSkillsExplorer(props) {
            _super.call(this, props);
            if (this.props.owner['add_page']) {
                this.props.owner['add_page'](this);
            }
        }
        ProfSkillsExplorer.prototype.get_datalist_settings = function () {
            return {
                allow_delete_row: true,
                allow_edit_row: false,
                model: 'skls',
                row_count: true,
                settings: {
                    "ordering": false,
                    "info": false,
                    searching: false,
                    lengthChange: false,
                    columns: [
                        {
                            title: 'Skill', data: 'SKLSCONCEPT'
                        }
                    ]
                }
            };
        };
        ProfSkillsExplorer.prototype.get_explorer_title = function () {
            return 'Profile skills';
        };
        ProfSkillsExplorer.prototype.get_selector_add_new_title = function () {
            return 'Select or insert one or more skills';
        };
        ProfSkillsExplorer.prototype.get_explorer_add_new_label = function () {
            return 'add new skill';
        };
        ProfSkillsExplorer.prototype.get_dataselector_settings = function () {
            var opts = this.get_datalist_settings();
            opts.allow_delete_row = false;
            opts.allow_edit_row = false;
            opts.settings.lengthChange = true;
            opts.settings.searching = true;
            opts.settings.ordering = true;
            opts.settings.info = true;
            return opts;
        };
        ProfSkillsExplorer.prototype.get_dataselector_view = function (props) {
            var view = React.createElement("div", null, React.createElement("div", {className: "bg-info p-xs"}, React.createElement("h4", null, "ISCO occupation"), React.createElement("h3", null, _.result(this.occp_obj, 'OCCPCONCEPT_EN'))), React.createElement("hr", {className: "hr-line-dashed"}), React.createElement(ProfSkillsSelector_View, __assign({owner: this}, props)));
            return view;
        };
        ProfSkillsExplorer.prototype.get_datalist_view = function (props) {
            var view = React.createElement(ProfSkillsDatalist, __assign({owner: this}, props));
            return view;
        };
        ProfSkillsExplorer.prototype.on_notify = function () {
            var _this = this;
            return _super.prototype.on_notify.call(this).then(function (rst) {
                if (_this.current_event.action === 'occp-stored') {
                    _this.occpisco = _.result(_this.current_event.data, 'OCCPISCO');
                    return _this.get_occp_obj();
                }
                return rst;
            });
        };
        ProfSkillsExplorer.prototype.get_occp_obj = function () {
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
        ProfSkillsExplorer.prototype.validate_page = function () {
            var ok = _super.prototype.validate_page.call(this);
            if (ok) {
                if (!this.datalist_view.data || this.datalist_view.data.length == 0) {
                    toastr.error('You must select at least one skill');
                    return false;
                }
            }
            this.broadcast({
                action: 'skills-stored',
                data: this.datalist_view.data
            });
            return ok;
        };
        return ProfSkillsExplorer;
    }(li.LightExplorer));
    exports.ProfSkillsExplorer = ProfSkillsExplorer;
    var ProfSkillsSelector_View = (function (_super) {
        __extends(ProfSkillsSelector_View, _super);
        function ProfSkillsSelector_View() {
            _super.apply(this, arguments);
        }
        ProfSkillsSelector_View.prototype.load_data = function () {
            var d = Q.defer();
            var ds = new jx.data.DataSource('occp');
            var sql = "SELECT DISTINCT S.* \n        FROM OCCS OS \n        JOIN SKLS S ON S.ID = OS.SKLSID \n        JOIN OCCP_ISCO ISCO ON OS.OCCPID = ISCO.ID \n        WHERE EXISTS (SELECT 1 FROM OCCP P WHERE P.OCCPISCO = '{0}' \n        AND ISCO.OCCPPARENTISCO LIKE P.OCCPISCO + '%' )\n        ORDER BY S.SKLSCONCEPT\n        ".format(this.props.occpisco);
            ds.exec_raw(sql).then(function (data) {
                d.resolve(data);
            });
            return d.promise;
        };
        ProfSkillsSelector_View.prototype.fetch_skills_from_occp = function (occp_data) {
            var d = Q.defer();
            var occs_ds = new jx.data.DataSource('occs');
            var occp_ids = _.map(occp_data, function (d) {
                return _.result(d, 'ID');
            });
            occs_ds.fetch_data({
                where: { 'OCCPID': { in: occp_ids } }
            }).then(function (data) {
                var skls_ids = _.map(data, function (d) {
                    return _.result(d, 'SKLSID');
                });
                var skls_ds = new jx.data.DataSource('skls');
                skls_ds.fetch_data({
                    where: { 'ID': { in: skls_ids } }
                }).then(function (_data) {
                    d.resolve(_data);
                });
            });
            return d.promise;
        };
        return ProfSkillsSelector_View;
    }(li.LightExplorerDataSelector_View));
    var ProfSkillsDatalist = (function (_super) {
        __extends(ProfSkillsDatalist, _super);
        function ProfSkillsDatalist() {
            _super.apply(this, arguments);
        }
        ProfSkillsDatalist.prototype.load_data = function () {
            var _this = this;
            var d = Q.defer();
            var list = deepcopy(this.data);
            if (list.length === 0) {
                list.push('-1');
            }
            var qry = {
                where: { 'ID': { in: list } },
                orderBy: ["SKLSCONCEPT"]
            };
            this.ds.dm.clear();
            this.ds.fetch_data(qry).then(function () {
                var data = _this.ds.dm.getEntities('skls');
                d.resolve(data);
            }).fail(function (err) {
                toastr.error(JSON.stringify(err));
            });
            return d.promise;
        };
        ProfSkillsDatalist.prototype.on_notify = function () {
            var _this = this;
            return _super.prototype.on_notify.call(this).then(function (rst) {
                if (_this.current_event.action === 'occp-stored') {
                    _this.data.length = 0;
                    _this.local_load_data();
                }
                return true;
            });
        };
        return ProfSkillsDatalist;
    }(li.LightExplorerDatalist_View));
    exports.ProfSkillsDatalist = ProfSkillsDatalist;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/skills/skills_explorer.js.map