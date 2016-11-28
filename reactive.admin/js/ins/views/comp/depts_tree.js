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
    var CompDeptTreeView = (function (_super) {
        __extends(CompDeptTreeView, _super);
        function CompDeptTreeView() {
            _super.apply(this, arguments);
        }
        CompDeptTreeView.prototype.render = function () {
            var _this = this;
            if (this.state.loading) {
                return null;
            }
            var data = this.ds.dm.getEntities(this.get_model());
            var target = _.find(data, function (d) {
                return _this.props.id ?
                    (_.result(d, 'id') === _this.props.id)
                    : (!_.result(d, 'deptparentid'));
            });
            return React.createElement(CompDeptBreadcrumb, {target: target, data: data});
        };
        CompDeptTreeView.prototype.get_model = function () {
            return 'compdept';
        };
        return CompDeptTreeView;
    }(jx.views.ReactiveDataView));
    exports.CompDeptTreeView = CompDeptTreeView;
    var CompDeptBreadcrumb = (function (_super) {
        __extends(CompDeptBreadcrumb, _super);
        function CompDeptBreadcrumb() {
            _super.apply(this, arguments);
        }
        CompDeptBreadcrumb.prototype.render = function () {
            var parents = this.get_parents(this.props.target);
            parents.push(this.props.target);
            var html = React.createElement("ol", {className: "breadcrumb"}, this.buil_parents_path(parents));
            return html;
        };
        CompDeptBreadcrumb.prototype.buil_parents_path = function (parents) {
            var views = [
                React.createElement("li", null, React.createElement("a", {href: "/company/employees"}, React.createElement("i", {className: "fa fa-home"})))
            ];
            var index = 1;
            var list = _.map(parents, function (p) {
                var is_last = (index++) === parents.length;
                var content = _.result(p, 'deptname');
                if (is_last) {
                    content = React.createElement("strong", null, _.result(p, 'deptname'), " ");
                }
                var li = React.createElement("li", null, React.createElement("a", {href: "/company/employees/depts/{0}".format(_.result(p, 'id'))}, content));
                return li;
            });
            views = views.concat(list);
            return views;
        };
        CompDeptBreadcrumb.prototype.get_parents = function (target) {
            var data = [];
            var parent = _.find(this.props.data, function (d) {
                return _.result(d, 'id') === _.result(target, 'deptparentid');
            });
            if (parent) {
                data.push(parent);
                data = data.concat(this.get_parents(parent));
            }
            return data.reverse();
        };
        return CompDeptBreadcrumb;
    }(jx.views.ReactiveView));
    var TreeList = (function (_super) {
        __extends(TreeList, _super);
        function TreeList() {
            _super.apply(this, arguments);
        }
        TreeList.prototype.render = function () {
            var _this = this;
            var roots = _.filter(this.props.data, function (d) {
                return (_.result(d, _this.props.keyid) === _this.props.rootid)
                    || !_.result(d, _this.props.parentid);
            });
            var html = React.createElement("div", {className: "dd dd-nodrag"}, React.createElement("ol", {className: "dd-list"}, this.fill_nodes(roots)));
            return html;
        };
        TreeList.prototype.fill_nodes = function (nodes) {
            var _this = this;
            if (!this.count) {
                this.count = 1;
            }
            var views = _.map(nodes, function (node) {
                var children = _.filter(_this.props.data, function (p) { return _.result(p, _this.props.parentid) === _.result(node, _this.props.keyid); });
                var _text = _.result(node, _this.props.displayfield);
                var text_style = { fontSize: 15, color: 'gray' };
                if (children.length > 0) {
                    if (children.length > 0) {
                        text_style['font-weight'] = 'bold';
                    }
                }
                var li = React.createElement("li", {className: "dd-item", "data-id": _this.count++, "data-rowid": _.result(node, _this.props.keyid)}, React.createElement("div", {className: "dd-handle dd-nodrag"}, React.createElement("h3", null, React.createElement("a", {href: "#"}, _text))), _this.fill_descendants(children));
                return li;
            });
            return views;
        };
        TreeList.prototype.fill_descendants = function (children) {
            if (!children || children.length === 0) {
                return null;
            }
            var view = React.createElement("ol", {className: "dd-list"}, this.fill_nodes(children));
            return view;
        };
        TreeList.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root['nestable']({
                            expandBtnHTML: '<button data-action="expand"><i class="fa fa-plus-square" ></i></button>',
                            collapseBtnHTML: '<button data-action="collapse"><i class="fa fa-minus-square" ></i></button>'
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return TreeList;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/ins/views/comp/depts_tree.js.map