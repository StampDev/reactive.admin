/// <reference path="emp_job_roles.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib', 'react-bootstrap', '../lib/emp_explorer', './emp_job_roles'], function (require, exports, React, jx, rb, emp_explorer_1, emp_job_roles_1) {
    "use strict";
    var b = rb;
    var EmpProfessionalInfo = (function (_super) {
        __extends(EmpProfessionalInfo, _super);
        function EmpProfessionalInfo() {
            _super.apply(this, arguments);
        }
        EmpProfessionalInfo.prototype.render = function () {
            var html = React.createElement("div", null, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-lg-12"}, React.createElement("div", {className: "m-b-md"}, React.createElement("h2", null, "Professional profile")))), React.createElement(b.Row, null, React.createElement(b.Col, {lg: 12}, React.createElement(EmpStatistics, null))), React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-lg-12"}, React.createElement(jx.views.TabControl, null, React.createElement(b.Tabs, {defaultActiveKey: 1, id: "tabs"}, React.createElement(b.Tab, {eventKey: 1, title: "Experience history"}, React.createElement("br", null), React.createElement(emp_job_roles_1.EmpJobExplorer, {owner: this, emp: this.props.emp})), React.createElement(b.Tab, {eventKey: 2, title: "Activities"}, React.createElement("br", null), React.createElement(EmpActsExplorer, {owner: this, emp: this.props.emp})), React.createElement(b.Tab, {eventKey: 3, title: "Skills"}, React.createElement("br", null), React.createElement(EmpSkillsExplorer, {owner: this, emp: this.props.emp})))))));
            return html;
        };
        return EmpProfessionalInfo;
    }(jx.views.ReactiveView));
    exports.EmpProfessionalInfo = EmpProfessionalInfo;
    var EmpStatistics = (function (_super) {
        __extends(EmpStatistics, _super);
        function EmpStatistics() {
            _super.apply(this, arguments);
        }
        EmpStatistics.prototype.render = function () {
            var html = React.createElement("div", null, React.createElement("table", {width: '100%'}, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, React.createElement("div", {style: { marginRight: 10 }}, React.createElement("h5", null, "Usage"), React.createElement("h2", null, "65%"), React.createElement("div", {className: "progress progress-mini"}, React.createElement("div", {style: { width: '68%' }, className: "progress-bar"})), React.createElement("div", {className: "m-t-sm small"}, "last update 4: 32 pm."))), React.createElement("td", null, React.createElement("div", {style: { marginRight: 25 }}, React.createElement("h5", null, "Search hits"), React.createElement("h2", null, "14%"), React.createElement("div", {className: "progress progress-mini"}, React.createElement("div", {style: { width: '38%' }, className: "progress-bar progress-bar-danger"})), React.createElement("div", {className: "m-t-sm small"}, "last update 4: 32 pm.")))))), React.createElement("hr", null));
            return html;
        };
        return EmpStatistics;
    }(jx.views.ReactiveView));
    var EmpActsExplorer = (function (_super) {
        __extends(EmpActsExplorer, _super);
        function EmpActsExplorer() {
            _super.apply(this, arguments);
        }
        EmpActsExplorer.prototype.get_title = function () {
            return 'My professional activities';
        };
        EmpActsExplorer.prototype.get_select_title = function () {
            return 'Select one or more activities';
        };
        EmpActsExplorer.prototype.get_detail_field = function () {
            return 'actid';
        };
        EmpActsExplorer.prototype.get_detail_table = function () {
            return 'usra';
        };
        EmpActsExplorer.prototype.get_lookup_table = function () {
            return 'acts';
        };
        EmpActsExplorer.prototype.get_lookup_field = function () {
            return 'ACTSDESCR_EN';
        };
        EmpActsExplorer.prototype.get_exec_paging = function (dt, req, draw, setts) {
            utils.spin(dt.root);
            var sql_count = 'select count(*) total from acts';
            var where = null;
            var search_term = dt.api.settings().search();
            if (search_term) {
                where = " ACTSDESCR_EN like '%{0}%' ".format(search_term);
            }
            if (dt.occpinfo) {
                if (where) {
                    where = "{0} and (ACTSISCO like '{1}%') ".format(where, dt.occpinfo.occpisco);
                }
                else {
                    where = "ACTSISCO like '{0}%' ".format(dt.occpinfo.occpisco);
                }
            }
            var _not_in = undefined;
            var exclude_ids = _.map(dt.props.usr['usra'](), function (a) { return _.result(a, 'actid'); });
            if (exclude_ids && exclude_ids.length > 0) {
                _.each(exclude_ids, function (id) {
                    if (!_not_in) {
                        _not_in = "'{0}'".format(id);
                    }
                    else {
                        _not_in = "{0}, '{1}'".format(_not_in, id);
                    }
                });
                _not_in = ' (ID NOT IN ({0})) '.format(_not_in);
            }
            if (_not_in) {
                where = where ?
                    '{0} and {1}'.format(where, _not_in)
                    : _not_in;
            }
            if (where) {
                sql_count = '{0} where {1} '.format(sql_count, where);
            }
            var ds = new jx.data.DataSource('acts');
            ds.exec_raw(sql_count).then(function (rst) {
                var total_count = _.result(rst[0], 'total');
                var sql = 'select * from acts ';
                if (where) {
                    sql = '{0} where {1} '.format(sql, where);
                }
                sql = '{0} order by ACTSDESCR_EN offset {1} rows fetch next {2} rows only'.format(sql, req['start'], req['length']);
                ds.exec_raw(sql).then(function (list) {
                    var info = {
                        draw: req['draw'],
                        recordsTotal: list['length'],
                        recordsFiltered: total_count,
                        data: list
                    };
                    draw(info);
                }).finally(function () {
                    utils.unspin(dt.root);
                });
            });
        };
        return EmpActsExplorer;
    }(emp_explorer_1.EmpExplorer));
    var EmpSkillsExplorer = (function (_super) {
        __extends(EmpSkillsExplorer, _super);
        function EmpSkillsExplorer() {
            _super.apply(this, arguments);
        }
        EmpSkillsExplorer.prototype.get_title = function () {
            return 'My professional skills';
        };
        EmpSkillsExplorer.prototype.get_select_title = function () {
            return 'Select one or more skills';
        };
        EmpSkillsExplorer.prototype.get_detail_field = function () {
            return 'sklsid';
        };
        EmpSkillsExplorer.prototype.get_detail_table = function () {
            return 'usrs';
        };
        EmpSkillsExplorer.prototype.get_lookup_table = function () {
            return 'skls';
        };
        EmpSkillsExplorer.prototype.get_lookup_field = function () {
            return 'SKLSCONCEPT';
        };
        EmpSkillsExplorer.prototype.get_exec_paging = function (dt, req, draw, setts) {
            utils.spin(dt.root);
            var base_sql = "\n            SELECT DISTINCT S.* \n            FROM OCCS OS \n            JOIN SKLS S ON S.ID = OS.SKLSID \n            JOIN OCCP_ISCO ISCO ON OS.OCCPID = ISCO.ID \n        ";
            var sql_count = 'select count(*) total from ({0}) A'.format(base_sql);
            var where = null;
            var search_term = dt.api.settings().search();
            if (search_term) {
                where = " S.{0} like '%{1}%' ".format(dt.props.lookup_field, search_term);
            }
            if (dt.occpinfo) {
                var base_where = "\n                EXISTS (SELECT 1 FROM OCCP P WHERE P.OCCPISCO = '{0}'\n                   AND ISCO.OCCPPARENTISCO LIKE P.OCCPISCO + '%' )\n            ".format(dt.occpinfo.occpisco);
                if (where) {
                    where = "{0} and {1} ".format(where, base_where);
                }
                else {
                    where = base_where;
                }
            }
            var _not_in = undefined;
            var exclude_ids = _.map(dt.props.usr['usrs'](), function (s) { return _.result(s, 'sklsid'); });
            if (exclude_ids && exclude_ids.length > 0) {
                _.each(exclude_ids, function (id) {
                    if (!_not_in) {
                        _not_in = "'{0}'".format(id);
                    }
                    else {
                        _not_in = "{0}, '{1}'".format(_not_in, id);
                    }
                });
                _not_in = ' (S.ID NOT IN ({0})) '.format(_not_in);
            }
            if (_not_in) {
                where = where ?
                    '{0} and {1}'.format(where, _not_in)
                    : _not_in;
            }
            if (where) {
                sql_count = 'select count(*) total from ({0} where {1} ) A '.format(base_sql, where);
            }
            else {
                sql_count = 'select count(*) total from ({0}) A '.format(base_sql);
            }
            var ds = new jx.data.DataSource('skls');
            ds.exec_raw(sql_count).then(function (rst) {
                var total_count = _.result(rst[0], 'total');
                var sql = base_sql;
                if (where) {
                    sql = '{0} where {1}'.format(sql, where);
                }
                sql = '{0} order BY S.SKLSCONCEPT offset {1} rows fetch next {2} rows only'.format(sql, req['start'], req['length']);
                ds.exec_raw(sql).then(function (list) {
                    var info = {
                        draw: req['draw'],
                        recordsTotal: list['length'],
                        recordsFiltered: total_count,
                        data: list
                    };
                    draw(info);
                }).finally(function () {
                    utils.unspin(dt.root);
                });
            });
            return null;
        };
        return EmpSkillsExplorer;
    }(emp_explorer_1.EmpExplorer));
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/comp/emp_professional_info_view.js.map