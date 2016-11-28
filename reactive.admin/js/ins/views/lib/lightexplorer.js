// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", 'react', 'react-dom', 'react-bootstrap', '../../../core/lib'], function (require, exports, React, ReactDOM, rb, jx) {
    "use strict";
    var b = rb;
    (function (ExplorerViewMode) {
        ExplorerViewMode[ExplorerViewMode["datalist"] = 0] = "datalist";
        ExplorerViewMode[ExplorerViewMode["form_new"] = 1] = "form_new";
        ExplorerViewMode[ExplorerViewMode["form_edit"] = 2] = "form_edit";
    })(exports.ExplorerViewMode || (exports.ExplorerViewMode = {}));
    var ExplorerViewMode = exports.ExplorerViewMode;
    var LightExplorer = (function (_super) {
        __extends(LightExplorer, _super);
        function LightExplorer(props) {
            _super.call(this, props);
            this.state.viewmode = ExplorerViewMode.datalist;
        }
        LightExplorer.prototype.get_datalist_settings = function () {
            return null;
        };
        LightExplorer.prototype.get_explorer_title = function () {
            return this.props.title;
        };
        LightExplorer.prototype.get_selector_add_new_title = function () {
            return null;
        };
        LightExplorer.prototype.get_explorer_add_new_label = function () {
            return null;
        };
        LightExplorer.prototype.render = function () {
            var datalist_props = this.get_datalist_settings();
            var can_add_new = this.state.viewmode === ExplorerViewMode.datalist ? 'btn-success btn-outline' : 'btn-default';
            var data_btn_visible = this.state.viewmode != ExplorerViewMode.datalist ? '' : 'hidden';
            var html = React.createElement(b.Row, null, React.createElement(b.Row, null, React.createElement(b.Col, {lg: 12}, React.createElement("h1", {className: "header header-title", style: { display: 'inline-block' }}, React.createElement("span", null, this.get_explorer_title())), React.createElement("button", {className: "pull-right btn btn-add-new {0} ".format(can_add_new), onClick: this.display_selector.bind(this)}, React.createElement("i", {className: "fa fa-plus"}), " ", React.createElement("span", null, this.get_explorer_add_new_label())), React.createElement("button", {className: "pull-right btn btn-outline btn-warning btn-cancel {0} ".format(data_btn_visible), onClick: this.display_datalist.bind(this), style: { marginRight: 10 }}, React.createElement("i", {className: "fa fa-reply"}), " ", React.createElement("span", null, "cancel")), React.createElement("button", {className: "pull-right btn btn-outline btn-primary btn-save {0} ".format(data_btn_visible), onClick: this.store_selection.bind(this), style: { marginRight: 10 }}, React.createElement("i", {className: "fa fa-check"}), " ", React.createElement("span", null, "save")))), React.createElement("hr", {className: "header header-sep"}), React.createElement(b.Row, null, React.createElement(b.Col, {lg: 12}, React.createElement("div", {className: "datalist-view"}, this.get_datalist_view(datalist_props)), React.createElement("div", {className: "sliding-view"}))));
            return html;
        };
        LightExplorer.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case 'occp-stored':
                    {
                        this.occpisco = this.current_event.data['occpisco'];
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        LightExplorer.prototype.display_selector = function (e) {
            var _this = this;
            e.preventDefault();
            if (this.root.find('.btn-add-new').hasClass('btn-default')) {
                return;
            }
            var props = this.get_dataselector_settings();
            props.occpisco = this.occpisco;
            if (this.datalist_view) {
                props.excluded_ids = this.datalist_view.data;
            }
            this.newState({
                viewmode: ExplorerViewMode.form_new
            }, function () {
                var view = React.createElement("div", null, React.createElement("h3", null, _this.get_selector_add_new_title()), React.createElement("br", null), _this.get_dataselector_view(props));
                var root = _this.root.find('.sliding-view');
                jx.slide.slide_fn(_this.root.find('.datalist-view'), jx.slide.SLIDE_DIR.right_out)
                    .then(function () {
                    ReactDOM.unmountComponentAtNode(_this.root.find('.sliding-view')[0]);
                    ReactDOM.render(view, root[0]);
                    jx.slide.slide_fn(root, jx.slide.SLIDE_DIR.left_in);
                });
            });
        };
        LightExplorer.prototype.display_datalist = function () {
            var _this = this;
            var d = Q.defer();
            this.newState({
                viewmode: ExplorerViewMode.datalist
            }, function () {
                jx.slide.slide_fn(_this.root.find('.sliding-view'), jx.slide.SLIDE_DIR.left_out)
                    .finally(function () {
                    jx.slide.slide_fn(_this.root.find('.datalist-view'), jx.slide.SLIDE_DIR.right_in);
                    d.resolve(true);
                });
            });
            return d.promise;
        };
        LightExplorer.prototype.store_selection = function () {
            var _this = this;
            if (this.dataselector_view.selected_ids.length === 0) {
                return;
            }
            this.datalist_view.notify({
                action: 'store_selection',
                data: this.dataselector_view.selected_ids,
                done: function () {
                    _this.display_datalist();
                }
            });
        };
        Object.defineProperty(LightExplorer.prototype, "datalist_view", {
            get: function () {
                return this['__datalist'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LightExplorer.prototype, "dataselector_view", {
            get: function () {
                return this['__dataselector'];
            },
            enumerable: true,
            configurable: true
        });
        LightExplorer.prototype.get_dataselector_settings = function () {
            return null;
        };
        LightExplorer.prototype.get_dataselector_view = function (props) {
            var view = React.createElement(LightExplorerDataSelector_View, __assign({owner: this}, props));
            return view;
        };
        LightExplorer.prototype.get_datalist_view = function (props) {
            var view = React.createElement(LightExplorerDatalist_View, __assign({owner: this}, props));
            return view;
        };
        LightExplorer.prototype.validate_page = function () {
            return true;
        };
        return LightExplorer;
    }(jx.views.ReactiveView));
    exports.LightExplorer = LightExplorer;
    var LightExplorerDataSelector_View = (function (_super) {
        __extends(LightExplorerDataSelector_View, _super);
        function LightExplorerDataSelector_View(props) {
            _super.call(this, props);
            this.state.loading = true;
            this.props.owner['__dataselector'] = this;
            this.selected_ids = [];
        }
        LightExplorerDataSelector_View.prototype.init_datatable = function () {
            _super.prototype.init_datatable.call(this);
            var that = this;
            this.root.find('table').on('page.dt', function () {
                that.root.find('ins').css('position', 'relative!important');
            });
        };
        LightExplorerDataSelector_View.prototype.init_datatable_settings = function () {
            var _this = this;
            var setts = _super.prototype.init_datatable_settings.call(this);
            setts.drawCallback = function (settings) {
                var ins_list = _this.root.find('ins');
                ins_list.css('position', 'relative!important');
            };
            return setts;
        };
        LightExplorerDataSelector_View.prototype.init_columns = function (_columns) {
            var columns = _super.prototype.init_columns.call(this, _columns);
            var col_index = this.props.row_count ? 1 : 0;
            columns.splice(col_index, 0, this.insert_checkbox_td());
            return columns;
        };
        LightExplorerDataSelector_View.prototype.insert_checkbox_td = function () {
            var that = this;
            var col = {
                title: 'Select',
                data: null,
                createdCell: function (cell, cellData, rowData) {
                    $(cell).empty();
                    var ctrl = React.createElement(jx.controls.CheckBox, {unposition: true, on_check: that.on_check.bind(that), on_uncheck: that.on_uncheck.bind(that)});
                    ReactDOM.render(ctrl, $(cell)[0]);
                }
            };
            return col;
        };
        LightExplorerDataSelector_View.prototype.createdCell = function (cell, cellData, rowData, row, col) {
            var col_text_index = this.props.row_count ? 2 : 1;
            if (col === col_text_index) {
                $(cell).empty();
                var a = $('<p class="tr-fontsize">{0}</p>'.format(cellData));
                $(cell).append(a);
            }
        };
        LightExplorerDataSelector_View.prototype.on_check = function (e) {
            var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');
            this.add_rowid(id);
        };
        LightExplorerDataSelector_View.prototype.on_uncheck = function (e) {
            var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');
            this.remove_rowid(id);
        };
        LightExplorerDataSelector_View.prototype.add_rowid = function (id) {
            var found = _.filter(this.selected_ids, function (__id) {
                return __id === id;
            }).length > 0;
            if (!found) {
                this.selected_ids.push(id);
            }
        };
        LightExplorerDataSelector_View.prototype.remove_rowid = function (id) {
            this.selected_ids = _.reject(this.selected_ids, function (__id) {
                return __id === id;
            });
        };
        return LightExplorerDataSelector_View;
    }(jx.forms.ui.DataList));
    exports.LightExplorerDataSelector_View = LightExplorerDataSelector_View;
    var LightExplorerDatalist_View = (function (_super) {
        __extends(LightExplorerDatalist_View, _super);
        function LightExplorerDatalist_View(props) {
            _super.call(this, props);
            this.props.owner['__datalist'] = this;
        }
        Object.defineProperty(LightExplorerDatalist_View.prototype, "data", {
            get: function () {
                if (!this.__internal_data) {
                    this.__internal_data = [];
                }
                return this.__internal_data;
            },
            enumerable: true,
            configurable: true
        });
        LightExplorerDatalist_View.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.newState({
                            loading: false
                        }, function () {
                            _this.init_datatable();
                        });
                    }
                    break;
                case 'store_selection':
                    {
                        var data = this.current_event.data;
                        _.each(data, function (id) {
                            if (_.filter(_this.data, function (__id) {
                                return __id === id;
                            }).length === 0) {
                                _this.data.push(id);
                            }
                        });
                        this.local_load_data();
                    }
                    break;
            }
            return Q.resolve(true);
        };
        LightExplorerDatalist_View.prototype.createdCell = function (cell, cellData, rowData, row, col) {
            var col_text_index = this.props.row_count ? 1 : 0;
            if (col === col_text_index) {
                $(cell).empty();
                var a = $('<p class="tr-fontsize">{0}</p>'.format(cellData));
                $(cell).append(a);
            }
        };
        LightExplorerDatalist_View.prototype.do_delete_row = function (e) {
            var _this = this;
            e.preventDefault();
            var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');
            var that = this;
            return utils.can_delete().then(function (ok) {
                if (ok) {
                    that.__internal_data = _.reject(that.__internal_data, function (__id) {
                        return __id === id;
                    });
                    _this.local_load_data();
                }
                return ok;
            });
        };
        return LightExplorerDatalist_View;
    }(jx.forms.ui.DataList));
    exports.LightExplorerDatalist_View = LightExplorerDatalist_View;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/lib/lightexplorer.js.map