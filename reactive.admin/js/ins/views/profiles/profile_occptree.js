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
    var OccpTreeView = (function (_super) {
        __extends(OccpTreeView, _super);
        function OccpTreeView(props) {
            _super.call(this, props);
            this.state.loading = true;
            this.state.is_left = true;
            this.state.level = 1;
            this.state.path = [];
        }
        Object.defineProperty(OccpTreeView.prototype, "ds", {
            get: function () {
                if (!this.__ds) {
                    this.__ds = new jx.data.DataSource('occp');
                }
                return this.__ds;
            },
            enumerable: true,
            configurable: true
        });
        OccpTreeView.prototype.render = function () {
            var content = null;
            if (this.state.loading) {
                content = null; //<div className="loading" style={{ minHeight: 400 }} ></div>;
            }
            else {
                content =
                    React.createElement("div", null, React.createElement(SearchTerm, null), React.createElement("div", {className: "row", style: { maxHeight: 590, 'overflow-y': 'scroll' }}, React.createElement(rb.Col, {lg: 7}, this.build_tree())));
            }
            var html = React.createElement("div", null, React.createElement("div", {className: "bg-warning p-xs b-r-sm m-b-sm"}, React.createElement("strong", null, "Find an isco occupation"), " ", React.createElement("span", null, " Select a specific occupation or click the right arrow "), " ", React.createElement("span", {className: "fa fa-arrow-right text-primary"}), "  ", React.createElement("span", null, " to expand and access further options")), content);
            return html;
        };
        OccpTreeView.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case 'tree-loading':
                case jx.constants.events.view_initialized:
                    {
                        utils.spin(this.root);
                        this.load_occp_data().then(function () {
                            _this.notify({
                                action: 'tree-loaded'
                            });
                        });
                    }
                    break;
                case 'tree-loaded':
                    {
                        var that = this;
                        this.setState(_.extend(this.state, {
                            loading: false
                        }), function () {
                            utils.unspin(_this.root);
                            _this.root['slimScroll']({
                                'height': '600px'
                            });
                        });
                    }
                    break;
                case 'expand-node':
                    {
                        var _args = this.current_event.data;
                        this.state.is_left = true;
                        if (_args['from_collapse']) {
                            _args = _args['parent_id'];
                            this.state.is_left = false;
                        }
                        this.expand_node(_args);
                    }
                    break;
                case 'collapse-node':
                    {
                        this.collapse_node(this.current_event.data);
                    }
                    break;
                case 'checkbox-enable':
                    {
                        this.root.find('.selection').slideUp(200, function () {
                            _this.root.find('.selected-occp').empty();
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        OccpTreeView.prototype.expand_node = function (nodeid) {
            var _this = this;
            this.newState({
                loading: true,
                parentId: nodeid
            }, function () {
                _this.notify({
                    action: 'tree-loading'
                });
            });
        };
        OccpTreeView.prototype.collapse_node = function (src_id) {
            var occp = _.find(this.ds.dm.getEntities('occp'), function (obj) {
                return _.result(obj, 'ID') === src_id;
            });
            var parent_id = _.result(occp, 'OCCPPARENTID');
            this.update_path(parent_id);
            this.notify({
                action: 'expand-node',
                data: {
                    parent_id: parent_id,
                    from_collapse: true
                },
            });
        };
        OccpTreeView.prototype.update_path = function (from_id) {
            var path_info = _.find(this.state.path, function (p) {
                return p.id === from_id;
            });
            if (path_info) {
                this.state.path = _.filter(this.state.path, function (p) {
                    return p.level < path_info.level;
                });
            }
            else {
                this.state.path = [];
            }
        };
        OccpTreeView.prototype.load_occp_data = function () {
            var _this = this;
            utils.spin(this.root.find('.loading'));
            var d = Q.defer();
            var parentID = this.state.parentId;
            if (!parentID) {
                parentID = utils.DBNULL;
            }
            var __where = {
                "OCCPPARENTID": { eq: parentID }
            };
            if (this.state.parentId) {
                var parent_obj = _.find(this.ds.dm.getEntities('occp'), function (p) {
                    return _.result(p, 'ID') === _this.state.parentId;
                });
                this.state.path.push({
                    id: this.state.parentId,
                    parentid: _.result(parent_obj, 'ID'),
                    level: _.result(parent_obj, 'OCCPISCO') ? _.result(parent_obj, 'OCCPISCO').length : 5
                });
            }
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
        OccpTreeView.prototype.build_tree = function () {
            if (this.state.loading) {
                return null;
            }
            var anim = this.state.is_left ? introAnimation.fromLeft : introAnimation.fromRight;
            if (this.props.noAnim) {
                anim = introAnimation.noAnim;
            }
            return React.createElement(TreeNodes, {owner: this, key: utils.guid(), anim: anim, data: this.ds.dm.getEntities('occp'), level: this.state.level, keyfield: "ID", displayfield: "OCCPCONCEPT_EN", parentfield: "OCCPPARENTID"});
        };
        return OccpTreeView;
    }(jx.views.ReactiveView));
    exports.OccpTreeView = OccpTreeView;
    var introAnimation;
    (function (introAnimation) {
        introAnimation[introAnimation["fromLeft"] = 0] = "fromLeft";
        introAnimation[introAnimation["fromRight"] = 1] = "fromRight";
        introAnimation[introAnimation["noAnim"] = 2] = "noAnim";
    })(introAnimation || (introAnimation = {}));
    var TreeNodes = (function (_super) {
        __extends(TreeNodes, _super);
        function TreeNodes() {
            _super.apply(this, arguments);
        }
        TreeNodes.prototype.render = function () {
            var roots = _.filter(this.props.data, function (d) {
                return !_.result(d, 'OCCPPARENTID');
            });
            var animation = '{0}'.format(this.props.anim === introAnimation.fromLeft ? 'fadeInLeft' : 'fadeInRight');
            if (this.props.anim === introAnimation.noAnim) {
                animation = '';
            }
            var html = React.createElement("div", {className: "root-tree animated {0}".format(animation)}, React.createElement("div", {className: "dd dd-nodrag"}, React.createElement("ol", {className: "dd-list"}, this.fill_nodes(roots))));
            return html;
        };
        TreeNodes.prototype.fill_nodes = function (nodes) {
            var _this = this;
            if (!this.count) {
                this.count = 1;
            }
            var that = this;
            var views = _.map(nodes, function (node) {
                var children = _.filter(that.props.data, function (p) { return _.result(p, _this.props.parentfield) === _.result(node, _this.props.keyfield); });
                var _text = _.result(node, that.props.displayfield);
                var isco = _.result(node, 'OCCPISCO');
                var length = isco ? isco.length : 5;
                var return_icon = null;
                var strong = '';
                if (children.length > 0) {
                    strong = 'text-bold';
                    return_icon =
                        React.createElement("button", {className: "btn btn-warning btn-sm btn-outline btn-collapse", style: { marginRight: 15 }, onClick: _this.collapse_node.bind(_this)}, React.createElement("i", {className: "fa fa-reply"}));
                }
                var btn_expand = React.createElement("a", {href: "#", className: "btn btn-primary btn-outline btn-sm pull-right btn-expand", onClick: _this.expand_node.bind(_this)}, React.createElement("i", {className: "fa fa-arrow-right"}));
                if (children.length > 0 || length > 4) {
                    btn_expand = null;
                }
                var text_style = { fontSize: 15, color: 'gray' };
                if (children.length > 0) {
                    text_style['font-weight'] = 'bold';
                }
                var checkbox = React.createElement(CheckBox, null);
                if (length > 4) {
                    checkbox = null;
                }
                var tr = [
                    React.createElement("td", {key: 1, width: "6%"}, return_icon),
                    React.createElement("td", {key: 2, width: "5%"}, checkbox),
                    React.createElement("td", {key: 3}, React.createElement("div", {style: { marginLeft: 15, display: 'inline-block', maxHeight: 60, width: '80%' }}, React.createElement("span", {className: 'node-txt {0}'.format(strong), style: text_style}, _text))),
                    React.createElement("td", {key: 4}, btn_expand)
                ];
                if (!return_icon) {
                    tr.shift();
                }
                var content = React.createElement("table", {width: "100%"}, React.createElement("tbody", null, tr));
                var li = React.createElement("li", {className: "dd-item", "data-id": _this.count++, "data-occpisco": _.result(node, 'OCCPISCO'), "data-rowid": _.result(node, _this.props.keyfield)}, React.createElement("div", {className: "dd-handle dd-nodrag"}, React.createElement("div", {style: { paddingTop: 5, paddingBottom: 5 }}, content)), _this.fill_descendants(children));
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
        TreeNodes.prototype.collapse_node = function (e) {
            e.preventDefault();
            if ($(e.currentTarget).hasClass('btn-disabled')) {
                return;
            }
            var rowid = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');
            this.props.owner.notify({
                action: 'collapse-node',
                data: rowid
            });
        };
        TreeNodes.prototype.expand_node = function (e) {
            e.preventDefault();
            if ($(e.currentTarget).hasClass('btn-disabled')) {
                return;
            }
            var rowid = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');
            this.props.owner.notify({
                action: 'expand-node',
                data: rowid
            });
        };
        TreeNodes.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root.find('.dd')['nestable']();
                        this.root.find('[data-action="collapse"]').hide();
                        this.root.find('.node-txt')['dotdotdot']();
                    }
                    break;
                case 'checkbox-enable':
                    {
                        this.root.find('.btn-collapse').addClass('btn-warning').removeClass('btn-default btn-disabled op-2');
                        this.root.find('.btn-expand').removeClass('btn-default btn-disabled op-2').addClass('btn-primary');
                        this.broadcast({
                            action: 'occp-unselected'
                        });
                    }
                    break;
                case 'checkbox-disable':
                    {
                        this.root.find('.btn-expand').removeClass('btn-primary').addClass('btn-default btn-disabled op-2');
                        this.root.find('.btn-collapse').removeClass('btn-warning').addClass('btn-default btn-disabled op-2');
                        var occpid = this.root.find('.checkbox-selected').closest('[data-rowid]').attr('data-rowid');
                        var isco = this.root.find('.checkbox-selected').closest('[data-rowid]').attr('data-occpisco');
                        var text = this.root.find('.checkbox-selected').closest('[data-rowid]').find('.node-txt').html();
                        this.broadcast({
                            action: 'occp-selected',
                            data: {
                                occpid: occpid,
                                occpisco: isco,
                                text: text
                            }
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return TreeNodes;
    }(jx.views.ReactiveView));
    var SearchTerm = (function (_super) {
        __extends(SearchTerm, _super);
        function SearchTerm() {
            _super.apply(this, arguments);
        }
        SearchTerm.prototype.render = function () {
            var html = React.createElement("form", null, React.createElement(b.FormGroup, null, React.createElement(b.FormControl, {type: "text", placeholder: "Enter a search term"})));
            return html;
        };
        return SearchTerm;
    }(jx.views.ReactiveView));
    var CheckBox = (function (_super) {
        __extends(CheckBox, _super);
        function CheckBox(props) {
            _super.call(this, props);
            this.enabled = true;
        }
        Object.defineProperty(CheckBox.prototype, "checkbox", {
            get: function () {
                return this.refs['checkbox'];
            },
            enumerable: true,
            configurable: true
        });
        CheckBox.prototype.render = function () {
            var html = React.createElement("div", {style: { display: 'inline' }}, React.createElement(jx.controls.IconCheckBox, {is_checked: this.state.is_checked, is_enabled: this.state.is_enabled, ref: 'checkbox', onChecked: this.onchecked.bind(this)}));
            return html;
        };
        CheckBox.prototype.onchecked = function (e) {
            if (!this.enabled) {
                return;
            }
            this.skip = true;
            if (this.checkbox.is_checked) {
                this.broadcast({
                    action: 'checkbox-disable'
                });
            }
            else {
                this.broadcast({
                    action: 'checkbox-enable',
                });
            }
        };
        CheckBox.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case 'checkbox-enable':
                    {
                        if (this.skip) {
                            this.skip = false;
                        }
                        else {
                            this.newState({
                                is_enabled: true
                            });
                        }
                    }
                    break;
                case 'checkbox-disable':
                    {
                        if (this.skip) {
                            this.skip = false;
                        }
                        else {
                            this.newState({
                                is_checked: false,
                                is_enabled: false
                            });
                        }
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return CheckBox;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/profiles/profile_occptree.js.map