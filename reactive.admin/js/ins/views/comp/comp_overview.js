/// <reference path="comp_deptview.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../../../core/lib', 'react-bootstrap', '../../lib/ins_master_page', './comp_deptview'], function (require, exports, React, ReactDOM, jx, rb, ins_master_page_1, comp_deptview_1) {
    "use strict";
    var b = rb;
    var CompOverview = (function (_super) {
        __extends(CompOverview, _super);
        function CompOverview() {
            _super.apply(this, arguments);
        }
        CompOverview.prototype.get_page_content = function () {
            return React.createElement(CompChart, null);
        };
        return CompOverview;
    }(ins_master_page_1.InsMasterPage));
    exports.CompOverview = CompOverview;
    var CompChart = (function (_super) {
        __extends(CompChart, _super);
        function CompChart(props) {
            _super.call(this, props);
            this.data = [];
            this.count = 1;
            this.state.loading = true;
        }
        Object.defineProperty(CompChart.prototype, "ds", {
            get: function () {
                if (!this.__ds) {
                    this.__ds = new jx.data.DataSource('compdept');
                }
                return this.__ds;
            },
            enumerable: true,
            configurable: true
        });
        CompChart.prototype.render = function () {
            if (this.state.loading) {
                return React.createElement(jx.views.LoaderView, {owner: this});
            }
            var html = React.createElement("div", {className: "row animated fadeInRight"}, React.createElement("div", {className: "col-lg-10"}, React.createElement("div", {className: "row", style: { overflowX: 'scroll', minHeight: 750 }}, React.createElement("div", {className: "chart-view"}))), React.createElement("div", {className: "col-lg-2 pull-right"}, React.createElement("div", {className: "ibox-content b-r-md", style: { minHeight: 700 }}, React.createElement("div", {className: "alert alert-info"}, React.createElement("h3", null, "Actions")), React.createElement("div", {className: "list-group"}, React.createElement("a", {href: "##", className: "list-group-item list-group-item-action"}, React.createElement("i", {className: "fa fa-plus m-r-sm"}), " ", React.createElement("span", null, "Invite users")), React.createElement("a", {href: "##", className: "list-group-item list-group-item-action", onClick: this.add_department.bind(this)}, React.createElement("i", {className: "fa fa-plus-square m-r-sm"}), " ", React.createElement("span", null, "Add department"))))), React.createElement(jx.modal.Modal, {ref: 'modal', inmodal: true, icon: React.createElement("i", {className: "fa fa-cube modal-icon"}), title: "Add department"}));
            return html;
        };
        CompChart.prototype.init_chart = function () {
            var _this = this;
            var orgChart = this.root.find('.chart-view')['orgChart']({
                data: this.data
            });
            _.each(this.root.find('.chart-view .node'), function (node) {
                var _nodeid = $(node).attr('node-id');
                var obj = _.find(_this.data, function (d) { return d.id === parseInt(_nodeid); });
                var view = React.createElement(ChartItem, {owner: _this, item: obj});
                ReactDOM.render(view, $(node)[0]);
            });
        };
        CompChart.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.load_depts().then(function () {
                            _this.newState({
                                loading: false
                            }, function () {
                                _this.init_chart();
                            });
                        });
                    }
                    break;
                case 'add-department':
                    {
                        var parentid = null;
                        var outline = null;
                        if (this.current_event.data && this.current_event.data['parentid']) {
                            parentid = this.current_event.data['parentid'];
                            outline = this.current_event.data['outline'];
                        }
                        this.refs['modal'].show(React.createElement(comp_deptview_1.CompDeptView, {modal: this.refs['modal'], parentid: parentid, outline: outline, owner: this}));
                    }
                    break;
                case 'edit-department':
                    {
                        this.refs['modal'].show(React.createElement(comp_deptview_1.CompDeptView, {modal: this.refs['modal'], id: this.current_event.data['id'], owner: this}));
                    }
                    break;
                case 'post-department-finished':
                    {
                        this.newState({
                            loading: true
                        }, function () {
                            _this.notify({
                                action: jx.constants.events.view_initialized
                            });
                        });
                    }
                    break;
                case 'delete-department':
                    {
                        utils.ask_question('Are you sure you want to delete the department', 'This will move all the underlying subdeopartments and employees').then(function (ok) {
                            if (ok) {
                                var id = _this.current_event.data['id'];
                                var obj = _.find(_this.ds.dm.getEntities('compdept'), function (d) {
                                    return _.result(d, 'id') === id;
                                });
                                obj.entityAspect.setDeleted();
                                utils.spin(_this.root);
                                _this.ds.save_changes()
                                    .then(function () {
                                    toastr.success('Data saved successfully');
                                    _this.broadcast({
                                        action: 'post-department-finished'
                                    });
                                })
                                    .fail(function (err) {
                                    toastr.error(JSON.stringify(err));
                                })
                                    .finally(function () {
                                    utils.unspin(_this.root);
                                });
                            }
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        CompChart.prototype.load_depts = function () {
            var _this = this;
            var d = Q.defer();
            this.ds.dm.clear();
            this.ds.exec_query({
                where: { 'compid': { eq: _.result(this.app.currentUser, 'compid') } }
            }).then(function () {
                var nodes = _this.ds.dm.getEntities('compdept');
                var root = _.find(nodes, function (d) { return !_.result(d, 'deptparentid'); });
                if (nodes.length === 0) {
                    _this.data = [];
                }
                else {
                    _this.data = _this.init_node(root, nodes, 0);
                }
                d.resolve(true);
            });
            return d.promise;
        };
        CompChart.prototype.init_node = function (obj, data, parentid) {
            var _this = this;
            var nodes = [
                {
                    id: this.count++,
                    compdeptid: _.result(obj, 'id'),
                    compdeptparentid: _.result(obj, 'deptparentid'),
                    name: _.result(obj, 'deptname'),
                    parent: parentid
                }
            ];
            var children = _.filter(data, function (d) {
                return d['deptparentid']() === obj['id']();
            });
            _.each(children, function (chd) {
                var children_nodes = _this.init_node(chd, data, nodes[0].id);
                nodes = nodes.concat(children_nodes);
            });
            return nodes;
        };
        CompChart.prototype.add_department = function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.notify({
                action: 'add-department'
            });
        };
        return CompChart;
    }(jx.views.ReactiveView));
    var ChartItem = (function (_super) {
        __extends(ChartItem, _super);
        function ChartItem() {
            _super.apply(this, arguments);
        }
        ChartItem.prototype.render = function () {
            var hide_delete = !_.result(this.props.item, 'compdeptparentid') ? 'hidden' : '';
            var dept_href = '/company/structure/dept/{0}'.format(_.result(this.props.item, 'compdeptid'));
            // !sos: compdeptid to avoid conflict with reserved jquery.orgchart "id" property
            var html = React.createElement(b.Row, {"data-id": _.result(this.props.item, 'compdeptid'), "data-outline": _.result(this.props.item, 'deptoutline'), style: { paddingLeft: 10, paddingRight: 10 }}, React.createElement(b.Col, {lg: 12, className: "border-bottom", style: { paddingBottom: 10 }}, React.createElement("table", {width: '100%'}, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, React.createElement("h2", {className: "text-info"}, React.createElement("a", {href: dept_href}, this.props.item.name))), React.createElement("td", {width: '35%'}, React.createElement("a", {href: "#", className: "text-danger m-l-sm pull-right chart-action chart-action-idle {0}".format(hide_delete), onClick: this.delete_department.bind(this)}, React.createElement("i", {className: "fa fa-trash"})), React.createElement("a", {href: "#", className: "text-info m-l-sm pull-right chart-action chart-action-idle", onClick: this.edit_department.bind(this)}, React.createElement("i", {className: "fa fa-edit"})), React.createElement("a", {href: "##", className: "text-success pull-right chart-action chart-action-idle", onClick: this.add_department.bind(this)}, React.createElement("i", {className: "fa fa-plus"}))))))), React.createElement(b.Col, {lg: 12}));
            return html;
        };
        ChartItem.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.init_node();
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        ChartItem.prototype.init_node = function () {
            var _this = this;
            this.root.hover(function () {
                _this.root.find('.chart-action').removeClass('chart-action-idle');
            }, function () {
                _this.root.find('.chart-action').addClass('chart-action-idle');
            });
        };
        ChartItem.prototype.add_department = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var parentid = $(e.currentTarget).closest('[data-id]').attr('data-id');
            var outline = $(e.currentTarget).closest('[data-outline]').attr('data-outline');
            this.broadcast({
                action: 'add-department',
                data: {
                    parentid: parentid,
                    outline: outline
                }
            });
        };
        ChartItem.prototype.edit_department = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var id = $(e.currentTarget).closest('[data-id]').attr('data-id');
            this.broadcast({
                action: 'edit-department',
                data: {
                    id: id
                }
            });
        };
        ChartItem.prototype.delete_department = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var id = $(e.currentTarget).closest('[data-id]').attr('data-id');
            this.broadcast({
                action: 'delete-department',
                data: {
                    id: id
                }
            });
        };
        return ChartItem;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/ins/views/comp/comp_overview.js.map