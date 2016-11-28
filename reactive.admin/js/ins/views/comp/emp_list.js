// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../../../core/lib', 'react-bootstrap'], function (require, exports, React, ReactDOM, jx, rb) {
    "use strict";
    var b = rb;
    (function (EmpListFilter) {
        EmpListFilter[EmpListFilter["pending"] = 0] = "pending";
        EmpListFilter[EmpListFilter["active"] = 1] = "active";
        EmpListFilter[EmpListFilter["all"] = 2] = "all";
    })(exports.EmpListFilter || (exports.EmpListFilter = {}));
    var EmpListFilter = exports.EmpListFilter;
    var EmpList = (function (_super) {
        __extends(EmpList, _super);
        function EmpList(props) {
            _super.call(this, props);
            this.state.filter = this.props.dept_filter;
        }
        EmpList.prototype.render = function () {
            var html = React.createElement("div", null, React.createElement(EmpDatalist, {owner: this, allow_edit_row: true, allow_delete_row: true, row_count: true, dept_filter: this.state.filter, deptid: this.props.deptid}));
            return html;
        };
        EmpList.prototype.componentWillReceiveProps = function (next) {
            this.state.filter = next.dept_filter;
            _super.prototype.componentWillReceiveProps.call(this, next);
        };
        EmpList.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case jx.forms.actions.EDIT_ROW:
                    {
                        var id = this.current_event.data;
                        this.app.router.navigate('/company/employees/employee/{0}'.format(id));
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return EmpList;
    }(jx.views.ReactiveView));
    exports.EmpList = EmpList;
    var EmpDatalist = (function (_super) {
        __extends(EmpDatalist, _super);
        function EmpDatalist(props) {
            _super.call(this, props);
            this.props.owner['__datalist'] = this;
            this.state.dept_filter = this.props.dept_filter;
        }
        EmpDatalist.prototype.get_model = function () {
            return 'emp_usr_view';
        };
        EmpDatalist.prototype.render = function () {
            if (this.state.loading) {
                return _super.prototype.render.call(this);
            }
            var content = null;
            if (this.state.data.length > 0) {
                content = _super.prototype.render.call(this);
            }
            else {
                content =
                    React.createElement("div", {className: "alert alert-info"}, React.createElement("h3", {className: "m-l-xs"}, "No employee has been added to this department yet"), React.createElement("p", null, "Invite your employees to join Stamp"));
            }
            //style={{ minHeight: 650 }}
            var html = React.createElement("div", {className: "m-b-lg"}, content);
            return html;
        };
        Object.defineProperty(EmpDatalist.prototype, "tbl_settings", {
            get: function () {
                var setts = {
                    columns: [
                        {
                            title: '', data: 'objectId', width: '30%'
                        },
                        {
                            title: '', data: 'empemail', width: '20%'
                        }
                    ]
                };
                return setts;
            },
            enumerable: true,
            configurable: true
        });
        EmpDatalist.prototype.createdCell = function (cell, cellData, rowData, row, col) {
            if (col === 1) {
                var html = React.createElement(EmpRowView, {emp: rowData, owner: this});
                ReactDOM.render(html, $(cell)[0]);
            }
            //if (col == 2) {
            //    var html = <RowDeptInfo owner={this} emp={rowData}  />;
            //    ReactDOM.render(html, $(cell)[0]);
            //}
        };
        EmpDatalist.prototype.createdRow = function (row, data, dataIndex) {
            _super.prototype.createdRow.call(this, row, data, dataIndex);
            $(row).attr('data-rowid', _.result(data, utils.key));
            $(row).css('height', '80px');
        };
        EmpDatalist.prototype.load_data = function () {
            var d = Q.defer();
            var qry = new Backendless.DataQuery();
            qry.condition = "compid='{0}' and deptid='{1}'".format(this.app.CompId, this.props.deptid);
            Backendless.Persistence.of('emp').find(qry, new Backendless.Async(function (list) {
                d.resolve(list['data']);
            }, function (err) {
                d.reject(err);
            }));
            return d.promise;
        };
        EmpDatalist.prototype.on_notify = function () {
            return _super.prototype.on_notify.call(this);
        };
        EmpDatalist.prototype.componentWillReceiveProps = function (next) {
            this.state.reload = this.state.dept_filter != next.dept_filter;
            this.state.dept_filter = next.dept_filter;
            _super.prototype.componentWillReceiveProps.call(this, next);
        };
        EmpDatalist.prototype.componentDidUpdate = function () {
            var _this = this;
            _super.prototype.componentDidUpdate.call(this);
            if (this.state.reload) {
                this.state.reload = false;
                this.local_load_data().then(function () {
                    _this.state.reload = false;
                });
            }
        };
        EmpDatalist.prototype.local_load_data = function () {
            var _this = this;
            return _super.prototype.local_load_data.call(this).then(function () {
                _this.root['slimScroll']({
                    height: 'auto',
                });
                return true;
            });
        };
        return EmpDatalist;
    }(jx.forms.ui.DataList));
    var EmpRowView = (function (_super) {
        __extends(EmpRowView, _super);
        function EmpRowView(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        Object.defineProperty(EmpRowView.prototype, "usr_dx", {
            get: function () {
                if (!this.__usr_ds) {
                    this.__usr_ds = new jx.data.DataSource('usr');
                }
                return this.__usr_ds;
            },
            enumerable: true,
            configurable: true
        });
        EmpRowView.prototype.render = function () {
            if (this.state.loading) {
                return React.createElement("i", {className: "fa fa-spin fa-spinner"});
            }
            var usr = this.state.usr;
            var usrstatus = 'Status: pending';
            switch (_.result(usr, 'usrstatus')) {
                case 0:
                    break;
                case 1:
                    usrstatus = 'Status: active';
                    break;
            }
            var url = '/company/employees/employee/{0}'.format(_.result(this.props.emp, 'objectId'));
            var html = React.createElement("div", null, React.createElement("table", null, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, React.createElement("span", {className: "glyphicon glyphicon-user m-r-md", style: { fontSize: '3em' }})), React.createElement("td", null, React.createElement("h3", null, React.createElement("a", {href: url}, React.createElement("span", {className: "m-r-sm"}, _.result(usr, 'name')), React.createElement("span", null, _.result(usr, 'name'))), React.createElement("div", null, React.createElement("small", null, usrstatus))))))));
            return html;
        };
        EmpRowView.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        if (this.state.loading) {
                            bx.fetch(Backendless.User, {
                                condition: "objectId='{0}'".format(_.result(this.props.emp, 'usrid'))
                            }).then(function (data) {
                                _this.setState({
                                    loading: false,
                                    usr: data[0]
                                });
                            });
                        }
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return EmpRowView;
    }(jx.views.ReactiveView));
    var RowDeptInfo = (function (_super) {
        __extends(RowDeptInfo, _super);
        function RowDeptInfo(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        RowDeptInfo.prototype.render = function () {
            if (this.state.loading) {
                return React.createElement("i", {className: "fa fa-spin fa-spinner"});
            }
            var html = React.createElement("div", null, React.createElement("div", null, React.createElement("span", null, "email: "), React.createElement("h4", {className: "inline text-success"}, React.createElement("a", {href: "#"}, _.result(this.props.emp, 'empemail')))), React.createElement("div", null, React.createElement("span", null, "department: "), React.createElement("span", {className: "text-success", style: { fontWeight: 400 }}, _.result(this.state.dept, 'deptname'))));
            return html;
        };
        RowDeptInfo.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        if (this.state.loading) {
                            var ds = new jx.data.DataSource('compdept');
                            ds.exec_query({
                                where: { id: _.result(this.props.emp, 'deptid') }
                            }).then(function () {
                                _this.newState({
                                    loading: false,
                                    dept: ds.findkey(_.result(_this.props.emp, 'deptid'))
                                });
                            });
                        }
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return RowDeptInfo;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/comp/emp_list.js.map