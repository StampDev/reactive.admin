// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../../../core/lib', 'react-bootstrap', '../profiles/profile_occptree'], function (require, exports, React, ReactDOM, jx, rb, profile_occptree_1) {
    "use strict";
    var b = rb;
    var EmpExplorer = (function (_super) {
        __extends(EmpExplorer, _super);
        function EmpExplorer() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(EmpExplorer.prototype, "usr", {
            get: function () {
                return this.refs['listing'].usr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EmpExplorer.prototype, "listing", {
            get: function () {
                return this.refs['listing'];
            },
            enumerable: true,
            configurable: true
        });
        EmpExplorer.prototype.render = function () {
            var html = React.createElement(b.Row, null, React.createElement(b.Col, {lg: 12}, React.createElement("h2", null, this.get_title(), React.createElement(b.Button, {bsStyle: "success", bsSize: "xs", className: "btn-outline m-l-md", onClick: this.add_new_item.bind(this)}, React.createElement("i", {className: "fa fa-plus"}), " add")), React.createElement("hr", null), React.createElement(DataListing, {ref: 'listing', owner: this, allow_delete_row: true, row_count: true, apply_scrollheight: false, detail_field: this.get_detail_field(), detail_table: this.get_detail_table(), lookup_table: this.get_lookup_table(), lookup_field: this.get_lookup_field(), emp: this.props.emp})));
            return html;
        };
        EmpExplorer.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.forms.actions.DELETE_ROW:
                    {
                        utils.can_delete().then(function () {
                            _this.delete_item(_this.current_event.data)
                                .then(function () {
                                _this.listing.reload();
                            });
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        EmpExplorer.prototype.delete_item = function (id) {
            var _this = this;
            var d = Q.defer();
            utils.spin(this.root);
            var obj = _.find(this.usr[this.get_detail_table()](), function (d) {
                return _.result(d, _this.get_detail_field()) === id;
            });
            if (obj) {
                obj.entityAspect.setDeleted();
            }
            var ds = new jx.data.DataSource('usr');
            ds.dm.importEntities(this.usr.entityAspect.entityManager.exportEntities());
            ds.saveChanges().then(function () {
                toastr.success('Data saved successfully');
                d.resolve(true);
            }).fail(function (err) {
                toastr.error(JSON.stringify(err));
                d.reject(false);
            }).finally(function () {
                utils.unspin(_this.root);
            });
            return d.promise;
        };
        EmpExplorer.prototype.add_new_item = function () {
            var _this = this;
            jx.modal.Show({
                bsSize: 'lg',
                title: this.get_select_title(),
                content: function (modal) {
                    var exclusion = _this.usr[_this.get_detail_table()]();
                    return React.createElement(Datalist_Find, {owner: _this, modal: modal, ref: 'dt_find', scroll_height: 680, usr: _this.usr, lookup_table: _this.get_lookup_table(), lookup_field: _this.get_lookup_field(), exec_paging: _this.get_exec_paging, row_count: true});
                }
            });
        };
        EmpExplorer.prototype.get_title = function () {
            return null;
        };
        EmpExplorer.prototype.get_select_title = function () {
            return null;
        };
        EmpExplorer.prototype.get_detail_field = function () {
            return null;
        };
        EmpExplorer.prototype.get_detail_table = function () {
            return null;
        };
        EmpExplorer.prototype.get_lookup_table = function () {
            return null;
        };
        EmpExplorer.prototype.get_lookup_field = function () {
            return null;
        };
        EmpExplorer.prototype.get_exec_paging = function (dt, req, draw, setts) {
            return null;
        };
        EmpExplorer.prototype.store_selection = function (ids) {
            var _this = this;
            var d = Q.defer();
            var ds = new jx.data.DataSource('usr');
            utils.spin(this.root);
            ds.exec_query({
                where: {
                    id: _.result(this.props.emp, 'usrid')
                },
                expand: [this.get_detail_table()]
            }).then(function () {
                _.each(ids, function (id) {
                    ds.dm.createEntity(_this.get_detail_table(), (_a = {
                            id: utils.guid(),
                            usrid: _.result(_this.props.emp, 'usrid')
                        },
                        _a[_this.get_detail_field()] = id,
                        _a
                    ));
                    var _a;
                });
                ds.saveChanges().then(function () {
                    toastr.success('Data successfully saved');
                    _this.refs['listing'].reload();
                    d.resolve(true);
                }).fail(function (err) {
                    toastr.error(JSON.stringify(err));
                    d.reject(err);
                }).finally(function () {
                    utils.unspin(_this.root);
                });
            }).finally(function () {
                utils.unspin(_this.root);
            });
            return d.promise;
        };
        return EmpExplorer;
    }(jx.views.ReactiveView));
    exports.EmpExplorer = EmpExplorer;
    var DataListing = (function (_super) {
        __extends(DataListing, _super);
        function DataListing() {
            _super.apply(this, arguments);
        }
        DataListing.prototype.get_model = function () {
            return 'usr';
        };
        Object.defineProperty(DataListing.prototype, "usr", {
            get: function () {
                return this.ds.findkey(_.result(this.props.emp, 'usrid'));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataListing.prototype, "tbl_settings", {
            get: function () {
                if (!this.__setts) {
                    this.__setts = {
                        lengthChange: false,
                        searching: false,
                        columns: [
                            { title: '', data: this.props.detail_field, width: '70%' }
                        ]
                    };
                }
                return this.__setts;
            },
            enumerable: true,
            configurable: true
        });
        DataListing.prototype.reload = function () {
            this.local_load_data();
        };
        DataListing.prototype.load_data = function () {
            var _this = this;
            var d = Q.defer();
            var __where = {
                id: _.result(this.props.emp, 'usrid')
            };
            this.ds.exec_query({
                where: __where,
                expand: [this.props.detail_table]
            }).then(function () {
                var list = _this.usr[_this.props.detail_table]();
                d.resolve(list);
            });
            return d.promise;
        };
        DataListing.prototype.createdCell = function (cell, cellData, rowData, row, col) {
            var _this = this;
            _super.prototype.createdCell.call(this, cell, cellData, rowData, row, col);
            if (col === 1) {
                $(cell).empty();
                $(cell).append($('<i class="fa fa-spin fa-spinner" ></i>'));
                var ds = new jx.data.DataSource(this.props.lookup_table);
                ds.exec_query({
                    where: {
                        ID: cellData
                    }
                }).then(function () {
                    var lookup = ds.findkey(cellData);
                    $(cell).empty();
                    $(cell).append($('<p class="tr-fontsize-15" >{0}</p>'.format(_.result(lookup, _this.props.lookup_field))));
                });
            }
        };
        DataListing.prototype.createdRow = function (row, data, rowindex) {
            $(row).attr('data-rowid', _.result(data, this.props.detail_field));
        };
        return DataListing;
    }(jx.forms.ui.DataList));
    exports.DataListing = DataListing;
    var Datalist_Find = (function (_super) {
        __extends(Datalist_Find, _super);
        function Datalist_Find(props) {
            var _this = this;
            _super.call(this, props);
            this.checks = [];
            this.props.modal.save = function () {
                if (!_this.checks.length) {
                    return;
                }
                utils.spin(_this.props.owner.listing.root);
                _this.props.owner.store_selection(_this.checks);
                _this.props.modal.close();
            };
        }
        Datalist_Find.prototype.render = function () {
            var html = React.createElement("div", {style: { minHeight: 600 }}, React.createElement(b.Row, {style: { paddingTop: 0 }}, React.createElement(b.Col, {xs: 3, style: { paddingTop: 0 }}, React.createElement("button", {className: "btn btn-success btn-outline m-b-lg m-r-sm btn-display", onClick: this.display_occp_tree.bind(this)}, React.createElement("i", {className: "fa fa-search m-r-xs"}), React.createElement("span", null, "Filter by isco occupation")), React.createElement("button", {className: "btn btn-warning btn-outline m-b-lg m-r-sm btn-hide select-mode hidden", onClick: this.hide_occp_tree.bind(this)}, React.createElement("i", {className: "fa fa-reply m-r-xs"}), React.createElement("span", null, "Cancel")), React.createElement("button", {className: "btn btn-primary btn-outline m-b-lg m-r-sm btn-select select-mode hidden", onClick: this.save_occp.bind(this)}, React.createElement("i", {className: "fa fa-check m-r-xs"}), React.createElement("span", null, "Select"))), React.createElement(b.Col, {xs: 9}, React.createElement("div", {className: "p-xs b-l-sm occp-selected"}))), React.createElement(b.Row, {style: { paddingTop: 0 }}, React.createElement(b.Col, {lg: 12, style: { paddingTop: 0 }}, React.createElement("div", {className: "datalist-view"}, _super.prototype.render.call(this)))), React.createElement("div", {className: "occptree-view hidden"}, React.createElement(profile_occptree_1.OccpTreeView, {noAnim: true, owner: this})));
            return html;
        };
        Object.defineProperty(Datalist_Find.prototype, "tbl_settings", {
            get: function () {
                var _this = this;
                if (!this.__setts) {
                    this.__setts = {
                        searchDelay: 1000,
                        columns: [
                            { title: '', data: null },
                            { title: '', data: this.props.lookup_field }
                        ],
                        drawCallback: function () {
                            var ins_list = _this.root.find('ins');
                            ins_list.css('position', 'relative!important');
                        },
                        serverSide: true,
                        ajax: this.pipeline()
                    };
                }
                return this.__setts;
            },
            enumerable: true,
            configurable: true
        });
        Datalist_Find.prototype.load_data = function () {
            return Q.resolve(true);
        };
        Datalist_Find.prototype.init_datatable = function () {
            _super.prototype.init_datatable.call(this);
        };
        Datalist_Find.prototype.pipeline = function () {
            var _this = this;
            $.fn.dataTable.pipeline = function () {
                return function (req, draw, setts) {
                    _this.props.exec_paging(_this, req, draw, setts);
                };
            };
            return $.fn.dataTable.pipeline();
        };
        Datalist_Find.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case 'occp-selected':
                    {
                        this.occpinfo = this.current_event.data;
                        this.reload = true;
                    }
                    break;
                case 'occp-unselected':
                    {
                        this.occpinfo = null;
                        this.root.find('.occp-selected').removeClass('bg-muted').empty();
                        this.reload = true;
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        Datalist_Find.prototype.createdCell = function (cell, cellData, rowData, row, col) {
            _super.prototype.createdCell.call(this, cell, cellData, rowData, row, col);
            if (col === 1) {
                $(cell).empty();
                var _obj = {
                    val: 0
                };
                var found = _.filter(this.checks, function (id) {
                    return id === _.result(rowData, 'ID');
                }).length > 0;
                if (found) {
                    _obj.val = 1;
                }
                var ctrl = React.createElement(jx.controls.CheckBox, {entity: _obj, property: "val", on_check: this.on_check.bind(this), on_uncheck: this.on_uncheck.bind(this), unposition: true});
                ReactDOM.render(ctrl, $(cell)[0]);
            }
            if (col === 2) {
                $(cell).empty();
                var content = $('<p class="tr-fontsize-15" style="margin-bottom:0px">{0}</p>'.format(cellData));
                $(cell).append(content);
            }
        };
        Datalist_Find.prototype.on_check = function (e) {
            var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');
            if (!_.find(this.checks, function (_id) {
                return _id === id;
            })) {
                this.checks.push(id);
            }
        };
        Datalist_Find.prototype.on_uncheck = function (e) {
            var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');
            this.checks = _.reject(this.checks, function (__id) {
                return id === __id;
            });
        };
        Datalist_Find.prototype.display_occp_tree = function () {
            var _this = this;
            jx.slide.slide_fn(this.root.find('.datalist-view'), jx.slide.SLIDE_DIR.right_out).then(function () {
                _this.root.find('.occptree-view').removeClass('hidden');
                _this.root.find('.occptree-view').addClass('no-hide');
                jx.slide.slide_fn(_this.root.find('.occptree-view'), jx.slide.SLIDE_DIR.left_in);
            });
            this.root.find('.btn-display').addClass('hidden');
            this.root.find('.select-mode').removeClass('hidden');
        };
        Datalist_Find.prototype.save_occp = function () {
            if (!this.occpinfo) {
                return;
            }
            this.hide_occp_tree();
        };
        Datalist_Find.prototype.hide_occp_tree = function () {
            var _this = this;
            this.root.find('.occptree-view').removeClass('no-hide');
            var that = this;
            jx.slide.slide_fn(this.root.find('.occptree-view'), jx.slide.SLIDE_DIR.left_out).then(function () {
                if (_this.reload) {
                    that.datatable['fnDraw'](true);
                    if (_this.occpinfo) {
                        _this.root.find('.occp-selected').addClass('bg-muted').append($('<strong>{0}</strong>'.format(_this.occpinfo.text)));
                    }
                    _this.reload = false;
                    _this.occpinfo = undefined;
                }
                else {
                    _this.root.find('.occp-selected').removeClass('bg-muted').empty();
                }
                jx.slide.slide_fn(_this.root.find('.datalist-view'), jx.slide.SLIDE_DIR.right_in);
            });
            this.root.find('.btn-display').removeClass('hidden');
            this.root.find('.select-mode').addClass('hidden');
        };
        return Datalist_Find;
    }(jx.forms.ui.DataList));
    exports.Datalist_Find = Datalist_Find;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/lib/emp_explorer.js.map