/// <reference path="../../../core/jx__.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../../lib/ins_master_page', '../../../core/lib'], function (require, exports, React, ReactDOM, ins_master_page_1, jx) {
    "use strict";
    var admin_content;
    (function (admin_content) {
        admin_content[admin_content["list"] = 0] = "list";
        admin_content[admin_content["edit"] = 1] = "edit";
    })(admin_content || (admin_content = {}));
    var InsAdminPage = (function (_super) {
        __extends(InsAdminPage, _super);
        function InsAdminPage(props) {
            _super.call(this, props);
            this.state = {
                content: admin_content.list
            };
        }
        InsAdminPage.prototype.get_page_content = function () {
            var html = React.createElement("div", {className: "animated fadeInRight"}, React.createElement("div", null, React.createElement("h1", null, React.createElement("i", {className: "fa fa-th-large"}), " Admin")), React.createElement("br", null), this.resolve_content());
            return html;
        };
        InsAdminPage.prototype.componentWillMount = function () {
            _super.prototype.componentWillMount.call(this);
            jx.pubsub.subscribe(ins_master_page_1.ins.constants.on_tbl_record_opened, function (msg, data) {
            });
        };
        InsAdminPage.prototype.componentDidUpdate = function () {
        };
        InsAdminPage.prototype.resolve_content = function () {
            switch (this.state.content) {
                case admin_content.list: return React.createElement(DataTable, {owner: this});
                case admin_content.edit: return null;
            }
        };
        return InsAdminPage;
    }(ins_master_page_1.InsMasterPage));
    exports.InsAdminPage = InsAdminPage;
    var DataTable = (function (_super) {
        __extends(DataTable, _super);
        function DataTable(props) {
            _super.call(this, props);
            this.state = {
                loading: true,
                data: []
            };
        }
        DataTable.prototype.render = function () {
            var html = React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-lg-12"}, React.createElement("div", {className: "ibox"}, React.createElement("div", {className: "ibox-content"}, React.createElement("div", {className: "table-responsive"}, React.createElement("table", {className: "table table-hover issue-tracker"}, React.createElement("tbody", null)))))));
            return html;
        };
        DataTable.prototype.componentDidMount = function () {
            var _this = this;
            _super.prototype.componentDidMount.call(this);
            if (this.state.loading) {
                utils.spin(this.root);
                this.call_net_srv().then(function (data) {
                    _this.state.data = data;
                    _this.state.loading = false;
                    _this.init_table();
                }).finally(function () {
                    utils.unspin(_this.root);
                });
            }
        };
        DataTable.prototype.init_table = function () {
            var _this = this;
            if (this.state.data.length > 0) {
                var row0 = this.state.data[0];
                var _columns = [];
                _.each(Object.keys(row0), function (col) {
                    _columns.push({
                        title: col,
                        data: col
                    });
                });
                _columns.push({
                    title: '',
                    data: null,
                    createdCell: function (cell, cellData, rowData, row, col) {
                        $(cell).empty();
                        var btn = React.createElement("button", {className: "btn btn-info btn-outline pull-right", onClick: _this.open_record.bind(_this)}, React.createElement("i", {className: "fa fa-folder-open-o"}), " open");
                        ReactDOM.render(btn, $(cell)[0]);
                    }
                });
                this.root.find('table').DataTable({
                    data: this.state.data,
                    columns: _columns,
                    createdRow: function (row, data, dataIndex) {
                        $(row).attr('data-rowid', _.result(data, 'ID'));
                    }
                });
            }
        };
        DataTable.prototype.call_net_srv = function () {
            var d = Q.defer();
            var ds = new jx.data.DataSource('occp');
            ds.fetch_data({
                where: {
                    "ID": { startsWith: "A" }
                }
            }).then(function (data) {
            }).fail(function (err) {
            });
            //var callinfo = {
            //    method: 'fetch_data',
            //    data: 'occp'
            //}
            //var that = this;
            //$.ajax({
            //    url: 'stamp_handler.ashx',
            //    type: 'POST',
            //    data: JSON.stringify(callinfo),
            //    success: function (data) {
            //        var list = JSON.parse(data);
            //        that.store_data(list);
            //        d.resolve(list);
            //    },
            //    error: function (errorText) {
            //        alert(errorText);
            //        d.reject(errorText);
            //    }
            //});
            return d.promise;
        };
        DataTable.prototype.open_record = function (e) {
            var id = $(e.currentTarget).closest('tr').attr('data-rowid');
            jx.pubsub.publish(ins_master_page_1.ins.constants.on_tbl_record_opened, {
                rowid: id
            });
        };
        DataTable.prototype.store_data = function (data) {
            function save_one_data(index, data, d) {
                var obj = data[index];
                Backendless.Persistence.of(OCCP).save(obj, new Backendless.Async(function (rst) {
                    if (index < data.length) {
                        save_one_data(index++, data, d);
                    }
                    d.resolve(true);
                }, function (err) {
                    toastr.error(JSON.stringify(err));
                    d.reject(false);
                }));
                return d.promise;
            }
            var total = data.length;
            var index = 0;
            if (index >= total) {
                return;
            }
            save_one_data(index, data, Q.defer()).then(function () {
                toastr.success('Data transfered successfully', 'success');
            }).fail(function (err) {
                toastr.error(JSON.stringify(err));
            });
        };
        return DataTable;
    }(jx.views.ReactView));
    var OCCP = (function () {
        function OCCP() {
        }
        return OCCP;
    }());
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/admin/ins_admin.js.map