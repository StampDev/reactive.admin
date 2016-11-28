/// <reference path="depts_utils.tsx" />
/// <reference path="emp_list.tsx" />
/// <reference path="new_emp.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib', 'react-bootstrap', '../../lib/ins_master_page', './depts_utils', './emp_list', './new_emp'], function (require, exports, React, jx, rb, ins_master_page_1, dept, list, new_emp_1) {
    "use strict";
    var b = rb;
    var EmpExplorer = (function (_super) {
        __extends(EmpExplorer, _super);
        function EmpExplorer() {
            _super.apply(this, arguments);
        }
        EmpExplorer.prototype.get_page_content = function () {
            return React.createElement(Explorer, null);
        };
        return EmpExplorer;
    }(ins_master_page_1.InsMasterPage));
    exports.EmpExplorer = EmpExplorer;
    var Explorer = (function (_super) {
        __extends(Explorer, _super);
        function Explorer(props) {
            _super.call(this, props);
            this.state.loading = true;
            this.state.dept_filter = list.EmpListFilter.active;
        }
        //deptid: string;
        Explorer.prototype.render = function () {
            if (this.state.loading) {
                return React.createElement(jx.views.LoaderView, null);
            }
            var html = React.createElement("div", {className: "animated fadeInRight"}, React.createElement("div", {className: "ibox"}, React.createElement("div", {className: "ibox-content col-lg-12", style: { minHeight: 700 }}, React.createElement(b.Col, {lg: 12}, React.createElement(dept.CompDeptBreadCrumView, {owner: this, start_by_loading: true, id: this.state.deptid})), React.createElement("hr", {className: "hr-line-dashed"}), React.createElement(b.Col, {lg: 3}, React.createElement(dept.DeptHierarchyView, {owner: this, start_by_loading: true, id: this.state.deptid})), React.createElement(b.Col, {lg: 9}, React.createElement(b.Row, null, React.createElement(b.Col, {lg: 3}, React.createElement("h1", null, React.createElement("i", {className: "fa fa-user m-r-md"}), React.createElement("span", null, "Employees"))), React.createElement(b.Col, {lg: 9}, React.createElement(EmplistActions, {owner: this}))), React.createElement("hr", null), React.createElement(list.EmpList, {owner: this, deptid: this.state.deptid, dept_filter: this.state.dept_filter})))));
            return html;
        };
        Explorer.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.broadcast({
                            action: 'update-page-title',
                            data: React.createElement("h1", null, React.createElement("i", {className: "fa fa-user m-r-md"}), React.createElement("span", null, "Employees"))
                        });
                        if (this.state.loading) {
                            this.load();
                        }
                    }
                    break;
                case 'reload':
                    {
                        this.setState({
                            loading: true
                        }, function () {
                            _this.load();
                        });
                    }
                    break;
                case 'Invite-user':
                    {
                        this.invite_user();
                    }
                    break;
                case 'on-emplist-filtered':
                    {
                        this.newState({
                            dept_filter: this.current_event.data
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        Explorer.prototype.load = function () {
            var _this = this;
            var url_ctx = jx.local.get(jx.constants.router.current_route);
            var id = url_ctx.params['deptid'];
            if (!id) {
                if (!this.state.deptid) {
                    this.state.loading = true;
                    Backendless.Persistence.of('compdept').find({
                        condition: 'deptparentid is null'
                    }, new Backendless.Async(function (rst) {
                        if (rst['data'].length) {
                            _this.state.deptid = _.result(rst['data'][0], utils.key);
                            _this.setState({
                                loading: false
                            });
                        }
                    }, function (err) {
                        toastr.error(JSON.stringify(err));
                    }));
                }
                else {
                    this.setState({
                        loading: false
                    });
                }
            }
            else {
                this.state.deptid = id;
                this.setState({
                    loading: false
                });
            }
        };
        Explorer.prototype.invite_user = function () {
            var _this = this;
            jx.modal.Show({
                inmodal: true,
                icon: React.createElement("i", {className: "fa fa-user-plus modal-icon"}),
                title: 'Invite new user',
                content: function (modal) {
                    return React.createElement(new_emp_1.NewEmployeeView, {owner: _this, modal: modal, deptid: _this.state.deptid});
                }
            });
            $('.modal-body').addClass('col-lg-12');
        };
        return Explorer;
    }(jx.views.ReactiveView));
    var EmplistActions = (function (_super) {
        __extends(EmplistActions, _super);
        function EmplistActions(props) {
            _super.call(this, props);
            this.state.filter = list.EmpListFilter.active;
            this.filters = [
                { filter: list.EmpListFilter.all, descr: 'All users' },
                { filter: list.EmpListFilter.active, descr: 'Active employees' },
                { filter: list.EmpListFilter.pending, descr: 'Pending invitations' }
            ];
        }
        EmplistActions.prototype.render = function () {
            var _this = this;
            var filter = _.find(this.filters, function (f) {
                return f.filter === _this.state.filter;
            });
            var html = React.createElement("div", null, React.createElement("button", {className: "btn btn-success btn-lg pull-right"}, React.createElement("i", {className: "fa fa-plus-square m-r-sm"}), " ", React.createElement("span", null, "Add new department")), React.createElement("button", {className: "btn btn-primary btn-lg pull-right m-r-lg", onClick: this.invite_user.bind(this)}, React.createElement("i", {className: "fa fa-user-plus m-r-sm"}), " ", React.createElement("span", null, "Invite new user")), React.createElement("div", {className: "pull-right m-r-lg"}, React.createElement("div", {className: "btn-group xbtn"}, React.createElement("button", {type: "button", className: "btn btn-default btn-lg"}, React.createElement("span", {className: "m-r-xs"}, "Filter: "), React.createElement("span", null, filter.descr)), React.createElement("button", {type: "button", className: "btn btn-default  btn-lg dropdown-toggle", "data-toggle": "dropdown"}, React.createElement("span", {className: "caret"}), React.createElement("span", {className: "sr-only"}, "Toggle Dropdown")), React.createElement("ul", {className: "dropdown-menu", role: "menu"}, React.createElement("li", null, React.createElement("a", {style: { fontSize: 14 }, href: "#", "data-filter": list.EmpListFilter.active}, "Active employees")), React.createElement("li", null, React.createElement("a", {style: { fontSize: 14 }, href: "#", "data-filter": list.EmpListFilter.pending}, "Pending invitations")), React.createElement("li", null, React.createElement("a", {style: { fontSize: 14 }, href: "#", "data-filter": list.EmpListFilter.all}, "All users"))))));
            return html;
        };
        EmplistActions.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root.find('.btn-group a').on('click', function (e) {
                            e.preventDefault();
                            var __filter = parseInt($(e.currentTarget).attr('data-filter'));
                            _this.newState({
                                filter: __filter
                            }, function () {
                                _this.props.owner.notify({
                                    action: 'on-emplist-filtered',
                                    data: __filter
                                });
                            });
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        EmplistActions.prototype.invite_user = function () {
            this.props.owner.notify({
                action: 'Invite-user'
            });
        };
        return EmplistActions;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/comp/emp_explorer.js.map