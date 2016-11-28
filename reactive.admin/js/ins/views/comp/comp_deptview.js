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
    var CompDeptView = (function (_super) {
        __extends(CompDeptView, _super);
        function CompDeptView(props) {
            var _this = this;
            _super.call(this, props);
            this.state.loading = true;
            this.props.modal.save = function () {
                return _this.onSave().then(function () {
                    _this.props.modal.close();
                    _this.broadcast({
                        action: 'post-department-finished'
                    });
                });
            };
        }
        Object.defineProperty(CompDeptView.prototype, "is_new", {
            get: function () {
                return !this.props.id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompDeptView.prototype, "is_root", {
            get: function () {
                return _.result(this.item, 'deptparentid') == undefined
                    || _.result(this.item, 'deptparentid') == null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompDeptView.prototype, "ds", {
            get: function () {
                if (!this._ds) {
                    this._ds = new jx.data.DataSource('compdept');
                }
                return this._ds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompDeptView.prototype, "item", {
            get: function () {
                var _this = this;
                if (!this._item) {
                    if (this.is_new) {
                        var parentid = this.root.find('.depts-select').val();
                        if (!parentid) {
                            parentid = null;
                        }
                        this._item = this.ds.dm.createEntity('compdept', {
                            id: utils.guid(),
                            compid: this.app.CompId,
                            deptparentid: parentid
                        });
                    }
                    else {
                        this._item = _.find(this.ds.dm.getEntities('compdept'), function (f) { return f['id']() === _this.props.id; });
                    }
                }
                return this._item;
            },
            enumerable: true,
            configurable: true
        });
        CompDeptView.prototype.render = function () {
            if (this.state.loading) {
                return React.createElement(jx.views.LoaderView, {height: 200});
            }
            var display_select = (this.is_new || !this.is_root) ? '' : 'hidden';
            var html = React.createElement("div", null, React.createElement("form", null, React.createElement("h2", null, "Department name"), React.createElement(b.FormGroup, null, React.createElement(b.FormControl, {name: "deptname", type: "text", "data-bind": "textInput:deptname"})), React.createElement("h2", {className: display_select}, "Parent department"), React.createElement("div", {className: "form-group"}, React.createElement("select", {className: "form-control m-b depts-select {0}".format(display_select)}))));
            return html;
        };
        CompDeptView.prototype.on_change = function () {
            if (!this.skip) {
                var parentid = this.root.find('.depts-select').val();
                this.item['deptparentid'](parentid);
            }
        };
        CompDeptView.prototype.fill_options = function () {
            if (!this.state.data || !this.state.data.length) {
                return null;
            }
            var root = _.find(this.state.data, function (d) {
                return !_.result(d, 'deptparentid');
            });
            if (!root) {
                root = this.state.data[0];
            }
            var options = this.fill_dept(root, 1);
            return options;
        };
        CompDeptView.prototype.fill_dept = function (dept, intent) {
            var _this = this;
            if (this.count === undefined) {
                this.count = 0;
            }
            var _intent = '';
            for (var i = 0; i < intent; i++) {
                _intent = _intent + '. ';
            }
            var options = [];
            if (_.result(dept, 'id') != this.props.id) {
                if (!this.is_new) {
                    if (!this.is_descendant(dept)) {
                        options.push({
                            id: _.result(dept, 'id'),
                            text: _intent + _.result(dept, 'deptname')
                        });
                    }
                }
                else {
                    options.push({
                        id: _.result(dept, 'id'),
                        text: _intent + _.result(dept, 'deptname')
                    });
                }
            }
            var children = _.filter(this.state.data, function (d) {
                return _.result(d, 'deptparentid') === _.result(dept, 'id');
            });
            _.each(children, function (child) {
                options = options.concat(_this.fill_dept(child, intent + 1));
            });
            return options;
        };
        CompDeptView.prototype.is_descendant = function (ent) {
            if (!ent) {
                return false;
            }
            if (_.result(ent, 'deptparentid') === this.props.id) {
                return true;
            }
            var parent = _.find(this.ds.dm.getEntities('compdept'), function (d) {
                return _.result(d, 'id') === _.result(ent, 'deptparentid');
            });
            return this.is_descendant(parent);
        };
        CompDeptView.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        if (this.state.loading) {
                            var that = this;
                            this.load_departments().then(function (_data) {
                                _this.newState({
                                    loading: false,
                                    data: _data
                                }, function () {
                                    if (_this.is_new || !_this.is_root) {
                                        var options = _this.fill_options();
                                        _this.root.find('.depts-select').on('change', function (e) {
                                            _this.on_change();
                                        });
                                        _this.root.find('.depts-select')['select2']({
                                            minimumResultsForSearch: Infinity,
                                            data: options
                                        });
                                        if (!_this.is_new) {
                                            _this.skip = true;
                                            try {
                                                _this.root.find('.depts-select').val(_.result(_this.item, 'deptparentid')).trigger("change");
                                            }
                                            finally {
                                                _this.skip = false;
                                            }
                                        }
                                    }
                                    ko.applyBindings(that.item, that.root[0]);
                                });
                            });
                        }
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        CompDeptView.prototype.load_departments = function () {
            var _this = this;
            var d = Q.defer();
            var qry = null;
            if (this.props.parentid) {
                qry = {
                    where: {
                        'id': { eq: this.props.parentid }
                    }
                };
            }
            this.ds.exec_query(qry).then(function () {
                d.resolve(_this.ds.dm.getEntities('compdept'));
            });
            return d.promise;
        };
        CompDeptView.prototype.onSave = function () {
            var _this = this;
            var d = Q.defer();
            utils.spin(this.root);
            this.ds.saveChanges()
                .then(function () {
                toastr.success('Data saved successfully');
                d.resolve(true);
            })
                .fail(function (err) {
                toastr.error(JSON.stringify(err));
                d.reject(false);
            })
                .finally(function () {
                utils.unspin(_this.root);
            });
            return d.promise;
        };
        return CompDeptView;
    }(jx.views.ReactiveView));
    exports.CompDeptView = CompDeptView;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/comp/comp_deptview.js.map