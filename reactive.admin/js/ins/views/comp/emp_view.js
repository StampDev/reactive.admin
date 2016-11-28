/// <reference path="emp_header_info_view.tsx" />
/// <reference path="../lib/emp_explorer.tsx" />
/// <reference path="emp_personal_info_view.tsx" />
/// <reference path="emp_professional_info_view.tsx" />
// <reference path="../profiles/profile_occptree.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib', 'react-bootstrap', '../../lib/ins_master_page', './emp_personal_info_view', './emp_header_info_view', './emp_professional_info_view', '../comp/emp_edu_view'], function (require, exports, React, jx, rb, ins_master_page_1, emp_personal_info_view_1, emp_header_info_view_1, emp_professional_info_view_1, edu) {
    "use strict";
    var b = rb;
    var EmpView = (function (_super) {
        __extends(EmpView, _super);
        function EmpView() {
            _super.apply(this, arguments);
        }
        EmpView.prototype.get_page_content = function () {
            return React.createElement(EmpViewForm, {start_by_loading: true});
        };
        return EmpView;
    }(ins_master_page_1.InsMasterPage));
    exports.EmpView = EmpView;
    var EmpViewForm = (function (_super) {
        __extends(EmpViewForm, _super);
        function EmpViewForm(props) {
            _super.call(this, props);
        }
        EmpViewForm.prototype.get_model = function () {
            return 'emp';
        };
        EmpViewForm.prototype.load_data = function (qry) {
            var __id = jx.url.get_param('empid');
            var __qry = {
                where: {
                    id: __id
                },
                expand: ['jbr']
            };
            return this.ds.exec_query(__qry);
        };
        EmpViewForm.prototype.render = function () {
            var profInfo = null;
            if (this.state.loading) {
                return React.createElement("i", {className: "fa fa-spin fa-spinner fa-2x"});
            }
            var emp = this.ds.findkey(jx.url.get_param('empid'));
            var html = React.createElement(b.Row, null, React.createElement(b.Col, {lg: 12, className: "animated fadeInRight", style: { paddingLeft: 20, paddingRight: 20 }}, React.createElement(jx.views.IBox, null, React.createElement("div", {style: { minHeight: 700 }}, React.createElement(b.Row, null, React.createElement(b.Col, {lg: 5}, React.createElement(emp_header_info_view_1.EmpsHeaderInfo, {owner: this, emp: emp, start_by_loading: true}), React.createElement("hr", null), React.createElement(emp_personal_info_view_1.EmpPersonalInfo, {owner: this, id: _.result(emp, 'usrid'), start_by_loading: true}), React.createElement("hr", null), React.createElement(edu.EmpEduView, {owner: this, emp: emp})), React.createElement(b.Col, {lg: 7}, React.createElement(emp_professional_info_view_1.EmpProfessionalInfo, {emp: emp})))))));
            return html;
        };
        EmpViewForm.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root.find('.ibox-content').css('min-height', '700px');
                        if (this.state.loading) {
                            this.load_data().then(function () {
                                utils.unspin(_this.root);
                                _this.broadcast({
                                    action: 'on-custom-content',
                                    data: React.createElement(FindEmployeeCombo, {owner: _this})
                                });
                                _this.newState({
                                    loading: false
                                });
                            }).fail(function (err) {
                                toastr.error(JSON.stringify(err));
                            });
                        }
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return EmpViewForm;
    }(jx.views.ReactiveEditDataView));
    var FindEmployeeCombo = (function (_super) {
        __extends(FindEmployeeCombo, _super);
        function FindEmployeeCombo() {
            _super.apply(this, arguments);
        }
        FindEmployeeCombo.prototype.render = function () {
            var html = React.createElement("div", null, React.createElement(b.Col, {lg: 3, style: { paddingLeft: 0 }}, React.createElement("h2", null, "Find employee", React.createElement("i", {className: "fa fa-search m-l-xs", "aria-hidden": "true"}))), React.createElement(b.Col, {lg: 8, className: "m-t-md"}, React.createElement("select", {className: "form-control emps-select"}, React.createElement("option", null))));
            return html;
        };
        FindEmployeeCombo.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root.find('.emps-select').on('change', function (e) {
                            var empid = _this.root.find('.emps-select').val();
                            var url = '/company/employees/employee/{0}'.format(empid);
                            _this.app.router.navigate(url);
                        });
                        var ds = new jx.data.DataSource('emp_usr_view');
                        ds.exec_query({
                            where: {
                                compid: this.app.CompId
                            }
                        }).then(function (list) {
                            var options = _.map(list, function (d) {
                                return {
                                    id: _.result(d, 'empid'),
                                    text: '{0} {1}'.format(_.result(d, 'usrname'), _.result(d, 'usrsurname'))
                                };
                            });
                            _this.root.find('select')['select2']({
                                data: options,
                                placeholder: "Select an employee",
                            });
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return FindEmployeeCombo;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/comp/emp_view.js.map