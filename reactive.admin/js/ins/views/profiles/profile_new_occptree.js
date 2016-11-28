/// <reference path="profiles_new.tsx" />
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
    var ProfileNewOccpTreeContent = (function (_super) {
        __extends(ProfileNewOccpTreeContent, _super);
        function ProfileNewOccpTreeContent(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        Object.defineProperty(ProfileNewOccpTreeContent.prototype, "ds", {
            get: function () {
                if (!this.__ds) {
                    this.__ds = new jx.data.DataSource('occp');
                }
                return this.__ds;
            },
            enumerable: true,
            configurable: true
        });
        ProfileNewOccpTreeContent.prototype.render = function () {
            var loading = null;
            if (this.state.loading) {
                loading = React.createElement("div", {className: "loading", style: { minHeight: 300 }});
            }
            var html = React.createElement("div", null, loading, this.build_tree());
            return html;
        };
        ProfileNewOccpTreeContent.prototype.on_broadcast = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.load_occp_data().then(function () {
                            _this.broadcast({
                                action: 'tree-loaded'
                            });
                        });
                    }
                    break;
                case 'tree-loaded':
                    {
                        this.setState(_.extend(this.state, {
                            loading: false
                        }));
                    }
                    break;
            }
            return null; //super.on_broadcast();
        };
        ProfileNewOccpTreeContent.prototype.load_occp_data = function () {
            var _this = this;
            utils.spin(this.root.find('.loading'));
            var d = Q.defer();
            this.ds.fetch_data({
                where: {
                    'OCCPPARENTID': utils.DBNULL
                },
            }).then(function () {
                d.resolve(true);
            }).finally(function () {
                utils.unspin(_this.root.find('.loading'));
            });
            return d.promise;
        };
        ProfileNewOccpTreeContent.prototype.build_tree = function () {
            if (this.state.loading) {
                return null;
            }
            return React.createElement(TreeNodes, {owner: this, data: this.ds.dm.getEntities('occp'), keyfield: "ID", displayfield: "OCCPCONCEPT_EN", parentfield: "OCCPPARENTID"});
        };
        return ProfileNewOccpTreeContent;
    }(jx.views.ReactiveView));
    exports.ProfileNewOccpTreeContent = ProfileNewOccpTreeContent;
    var TreeNodes = (function (_super) {
        __extends(TreeNodes, _super);
        function TreeNodes() {
            _super.apply(this, arguments);
        }
        TreeNodes.prototype.render = function () {
            var html = React.createElement("div", null, React.createElement("div", {className: "dd dd-nodrag"}, React.createElement("ol", {className: "dd-list"}, this.fill_nodes(this.props.data))));
            return html;
        };
        TreeNodes.prototype.fill_nodes = function (nodes) {
            var _this = this;
            if (!this.count) {
                this.count = 1;
            }
            var that = this;
            var views = _.map(nodes, function (n) {
                var children = _.filter(_this.props.data, function (p) { return _.result(p, _this.props.parentfield) === _.result(n, _this.props.keyfield); });
                var _text = _.result(n, that.props.displayfield);
                var li = React.createElement("li", {className: "dd-item", "data-id": _this.count++}, React.createElement("div", {className: "dd-handle dd-nodrag"}, React.createElement("table", {style: { width: '100%' }}, React.createElement("tr", null, React.createElement("td", {style: { width: '5%' }}, React.createElement("input", {type: "checkbox", className: "form-control"})), React.createElement("td", {style: { width: '80%', paddingLeft: 20 }}, React.createElement("span", {style: { fontSize: '1.5em!important', color: 'gray', fontWeight: 300 }}, _text)), React.createElement("td", null, React.createElement("button", {className: "btn btn-primary btn-outline btn-sm pull-right"}, React.createElement("i", {className: "fa fa-angle-double-right"})))))), _this.fill_descendants(children));
                return li;
            });
            return views;
        };
        TreeNodes.prototype.fill_descendants = function (children) {
            if (!children || children.length === 0) {
                return null;
            }
            var view = React.createElement("ol", {className: "dd-list"}, this.fill_nodes(children));
            return view;
        };
        TreeNodes.prototype.on_broadcast = function () {
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root.find('.dd')['nestable']();
                    }
                    break;
            }
            return null; // super.on_broadcast();
        };
        return TreeNodes;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/ins/views/profiles/profile_new_occptree.js.map