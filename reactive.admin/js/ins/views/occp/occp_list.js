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
    var OccpList = (function (_super) {
        __extends(OccpList, _super);
        function OccpList(props) {
            _super.call(this, props);
            this.state.loading = true;
            this.state.path = [];
        }
        Object.defineProperty(OccpList.prototype, "ds", {
            get: function () {
                if (!this.__ds) {
                    this.__ds = new jx.data.DataSource('occp');
                }
                return this.__ds;
            },
            enumerable: true,
            configurable: true
        });
        OccpList.prototype.render = function () {
            if (this.state.loading) {
                return React.createElement("div", {className: "loading", style: { minHeight: 300 }});
            }
            var html = React.createElement(rb.ListGroup, {className: "animated fadeInUp"}, React.createElement("br", null), this.fill_with_data());
            return html;
        };
        OccpList.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case 'occp-loading':
                case jx.constants.events.view_initialized:
                    {
                        this.load_occp_data().then(function () {
                            _this.notify({
                                action: 'occp-loaded'
                            });
                        });
                    }
                    break;
                case 'occp-loaded':
                    {
                        this.newState({
                            loading: false
                        });
                    }
                    break;
                case 'occp-expand':
                    {
                        this.expand_node();
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        OccpList.prototype.fill_with_data = function () {
            var _this = this;
            if (this.state.loading) {
                return null;
            }
            var data = this.ds.dm.getEntities('occp');
            var views = _.map(data, function (d) {
                var has_children = _.filter(_this.ds.dm.getEntities('occp'), function (p) {
                    return _.result(p, 'OCCPPARENTID') === _.result(d, 'ID');
                }).length > 0;
                var view = React.createElement(ListItem, {owner: _this, occp: d, has_children: has_children, animate: _this.state.animate, action: Action.expand});
                return view;
            });
            return views;
        };
        OccpList.prototype.load_occp_data = function () {
            var _this = this;
            utils.spin(this.root.find('.loading'));
            var d = Q.defer();
            var parentID = this.state.parent_id;
            if (!parentID) {
                parentID = utils.DBNULL;
            }
            var __where = {
                "OCCPPARENTID": { eq: parentID }
            };
            if (this.state.path && this.state.path.length > 0) {
                var parent_ids = _.map(this.state.path, function (p) {
                    return p.id;
                });
                __where = [{
                        "or": [{ "ID": { in: parent_ids } }, { "OCCPPARENTID": { eq: parentID } }]
                    }];
            }
            this.ds.dm.clear();
            this.ds.fetch_data({
                where: __where,
                orderBy: ["OCCPISCO"]
            }).then(function () {
                d.resolve(true);
            }).finally(function () {
                utils.unspin(_this.root.find('.loading'));
            });
            return d.promise;
        };
        OccpList.prototype.expand_node = function () {
            var id = this.current_event.data;
            this.state.parent_id = id;
            this.add_to_path(id);
            this.state.animate = true;
            this.notify({
                action: 'occp-loading'
            });
        };
        OccpList.prototype.add_to_path = function (id) {
            var path_info = _.find(this.state.path, function (p) {
                return p.id === id;
            });
            if (!path_info) {
                var obj = _.find(this.ds.dm.getEntities('occp'), function (d) {
                    return _.result(d, 'ID') === id;
                });
                this.state.path.push({
                    id: id,
                    parentid: _.result(obj, 'OCCPPARENTID')
                });
            }
        };
        return OccpList;
    }(jx.views.ReactiveView));
    exports.OccpList = OccpList;
    var Action;
    (function (Action) {
        Action[Action["expand"] = 0] = "expand";
        Action[Action["collapse"] = 1] = "collapse";
    })(Action || (Action = {}));
    var ListItem = (function (_super) {
        __extends(ListItem, _super);
        function ListItem(props) {
            _super.call(this, props);
        }
        ListItem.prototype.render = function () {
            var classlist = null;
            if (this.props.animate) {
                classlist = 'animated fadeInUp ';
            }
            var text_style = 'text-success';
            if (this.props.has_children) {
                text_style = 'text-warning';
            }
            var html = React.createElement(rb.ListGroupItem, {key: utils.guid(), className: '{0}'.format(classlist), href: "#", onClick: this.on_click.bind(this)}, React.createElement("table", {width: '100%'}, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, React.createElement("span", {className: text_style, style: { fontSize: 20 }}, _.result(this.props.occp, 'OCCPCONCEPT_EN'))), React.createElement("td", null, React.createElement("i", {className: "pull-right fa fa-arrow-right"}))))));
            return html;
        };
        ListItem.prototype.on_click = function (e) {
            e.preventDefault();
            switch (this.props.action) {
                case Action.expand:
                    {
                        this.expand();
                    }
                    break;
                case Action.collapse:
                    {
                        this.collapse();
                    }
                    break;
            }
        };
        ListItem.prototype.expand = function () {
            this.broadcast({
                action: 'occp-expand',
                data: _.result(this.props.occp, 'ID')
            });
        };
        ListItem.prototype.collapse = function () {
            this.broadcast({
                action: 'occp-collapse',
                data: _.result(this.props.occp, 'ID')
            });
        };
        return ListItem;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/occp/occp_list.js.map