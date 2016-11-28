// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib', 'react-bootstrap'], function (require, exports, React, jx, rb) {
    "use strict";
    var b = rb;
    var CompDeptBreadCrumView = (function (_super) {
        __extends(CompDeptBreadCrumView, _super);
        function CompDeptBreadCrumView() {
            _super.apply(this, arguments);
        }
        CompDeptBreadCrumView.prototype.render = function () {
            var _this = this;
            if (this.state.loading) {
                return null;
            }
            var data = this.state.items;
            var target = _.find(data, function (d) {
                return _this.props.id ?
                    (_.result(d, utils.key) === _this.props.id)
                    : (!_.result(d, 'deptparentid'));
            });
            return React.createElement(InternalBreadcrumb, {target: target, data: data});
        };
        CompDeptBreadCrumView.prototype.get_model = function () {
            return 'compdept';
        };
        CompDeptBreadCrumView.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        Backendless.Persistence.of('compdept').find({
                            condition: "compid='{0}'".format(this.app.CompId)
                        }, new Backendless.Async(function (rst) {
                            _this.newState({
                                loading: false,
                                items: rst['data']
                            });
                        }, function (err) {
                            toastr.error(JSON.stringify(err));
                        }));
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return CompDeptBreadCrumView;
    }(jx.views.ReactiveView));
    exports.CompDeptBreadCrumView = CompDeptBreadCrumView;
    var InternalBreadcrumb = (function (_super) {
        __extends(InternalBreadcrumb, _super);
        function InternalBreadcrumb() {
            _super.apply(this, arguments);
        }
        InternalBreadcrumb.prototype.render = function () {
            var parents = this.get_parents(this.props.target);
            parents.push(this.props.target);
            var html = React.createElement("ol", {className: "breadcrumb"}, this.buil_parents_path(parents));
            return html;
        };
        InternalBreadcrumb.prototype.buil_parents_path = function (parents) {
            var views = [
                React.createElement("li", null, React.createElement("a", {href: "/company/employees"}, React.createElement("i", {className: "fa fa-home"})))
            ];
            var index = 1;
            var list = _.map(parents, function (p) {
                var is_last = (index++) === parents.length;
                var content = _.result(p, 'deptname');
                if (is_last) {
                    content = React.createElement("strong", {className: "text-danger"}, _.result(p, 'deptname'), " ");
                }
                var li = React.createElement("li", null, React.createElement("a", {href: "/company/employees/depts/{0}".format(_.result(p, utils.key))}, content));
                return li;
            });
            views = views.concat(list);
            return views;
        };
        InternalBreadcrumb.prototype.get_parents = function (target) {
            var data = [];
            var parent = _.find(this.props.data, function (d) {
                return _.result(d, utils.key) === _.result(target, 'deptparentid');
            });
            if (parent) {
                data.push(parent);
                data = data.concat(this.get_parents(parent));
            }
            return data.reverse();
        };
        return InternalBreadcrumb;
    }(jx.views.ReactiveView));
    var DeptHierarchyView = (function (_super) {
        __extends(DeptHierarchyView, _super);
        function DeptHierarchyView(props) {
            _super.call(this, props);
            this.state.items = [];
        }
        DeptHierarchyView.prototype.render = function () {
            var _this = this;
            if (this.state.loading) {
                return React.createElement(jx.views.LoaderView, null);
            }
            var data = this.state.items;
            var dept = _.find(data, function (d) {
                return (_.result(d, utils.key) === _this.props.id);
            });
            var parent = _.find(data, function (d) {
                return (_.result(d, utils.key) === _.result(dept, 'deptparentid'));
            });
            jx.local.set('current-dept', this.props.id);
            var html = React.createElement("div", null, this.display_parent(parent), this.display_subdepts(dept));
            return html;
        };
        DeptHierarchyView.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        if (this.state.loading) {
                            var qry = new Backendless.DataQuery();
                            qry.condition = "compid='{0}'".format(this.app.CompId);
                            Backendless.Persistence.of('compdept').find(qry, new Backendless.Async(function (rst) {
                                _this.newState({
                                    loading: false,
                                    items: rst['data']
                                });
                            }, function (err) {
                                toastr.error(JSON.stringify(err));
                            }));
                        }
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        DeptHierarchyView.prototype.display_parent = function (dept) {
            var parent = dept;
            if (!parent) {
                return null;
            }
            var parent_title = parent ? _.result(parent, 'deptname') : '';
            var parent_href = parent ? "/company/employees/depts/{0}".format(_.result(parent, utils.key)) : '#';
            var html = React.createElement("div", null, React.createElement("h2", null, "Parent department"), React.createElement("h3", null, React.createElement("a", {href: parent_href}, parent_title)), React.createElement("br", null));
            return html;
        };
        DeptHierarchyView.prototype.display_subdepts = function (dept) {
            var subs = _.filter(this.state.items, function (d) {
                return _.result(d, 'deptparentid') === _.result(dept, utils.key);
            });
            if (subs.length === 0) {
                return null;
            }
            var children = _.map(subs, function (sub) {
                var item = React.createElement("h3", null, React.createElement("a", {href: "/company/employees/depts/{0}".format(_.result(sub, utils.key))}, _.result(sub, 'deptname')));
                return item;
            });
            var html = React.createElement("div", null, React.createElement("h2", null, "Sub-departments"), children);
            return html;
        };
        DeptHierarchyView.prototype.get_model = function () {
            return 'compdept';
        };
        return DeptHierarchyView;
    }(jx.views.ReactiveView));
    exports.DeptHierarchyView = DeptHierarchyView;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/comp/depts_utils.js.map