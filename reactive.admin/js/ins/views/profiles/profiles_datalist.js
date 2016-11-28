// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', 'react-bootstrap', '../../../core/lib'], function (require, exports, React, ReactDOM, rb, jx) {
    "use strict";
    var b = rb;
    var ProfileDatalist = (function (_super) {
        __extends(ProfileDatalist, _super);
        function ProfileDatalist(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        Object.defineProperty(ProfileDatalist.prototype, "ds", {
            get: function () {
                if (!this.__ds) {
                    this.__ds = new jx.data.DataSource('prof');
                }
                return this.__ds;
            },
            enumerable: true,
            configurable: true
        });
        ProfileDatalist.prototype.render = function () {
            var html = React.createElement("div", {className: "row", style: { minHeight: 500 }}, React.createElement("div", {className: "col-lg-12 scroll-table"}, React.createElement("table", {className: "table table-striped table-hover"}), this.state.emptyMess));
            return html;
        };
        ProfileDatalist.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.load_profiles();
                    }
                    break;
                case 'open-one-profile':
                    {
                        this.highlight_selection();
                        this.broadcast({
                            action: 'edit-profile',
                            data: this.current_event.data
                        });
                    }
                    break;
                case 'new-profile-added':
                    {
                        this.load_profiles()
                            .then(function () {
                            _this.notify({
                                action: 'open-one-profile',
                                data: _this.current_event.data
                            });
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        ProfileDatalist.prototype.highlight_selection = function () {
            $('.selected-row').removeClass('selected-row');
            var rows = this.datatable.rows().nodes();
            _.each(rows, function (row) {
                $(row).removeClass('selected-row');
                $(row).find('.selected-row').removeClass('selected-row');
            });
            var rowid = this.current_event.data;
            this.root.find('[data-rowid="{0}"]'.format(rowid)).addClass('selected-row');
        };
        ProfileDatalist.prototype.load_profiles = function () {
            var _this = this;
            var d = Q.defer();
            utils.spin(this.root);
            this.ds.fetch_data({
                where: {
                    'COMPID': { eq: this.app.currentUser['compid'] }
                },
            }).then(function () {
                if (_this.ds.dm.getEntities('prof').length === 0) {
                    _this.updateState({
                        emptyMess: React.createElement(b.Well, null, "No profile found. Add a new profile")
                    });
                }
                else {
                    _this.init_datatable();
                }
                d.resolve(true);
            }).fail(function (err) {
                _this.error(err);
            }).finally(function () {
                utils.unspin(_this.root);
            });
            return d.promise;
        };
        ProfileDatalist.prototype.init_datatable = function () {
            var _this = this;
            if (this.datatable) {
                this.datatable.destroy();
            }
            var count = 1;
            this.datatable = this.root.find('table').DataTable({
                data: this.ds.dm.getEntities('prof'),
                ordering: false,
                columns: [
                    {
                        data: null, title: '', width: '5%', createdCell: function (cell) {
                            $(cell).empty();
                            $(cell).append($('<p class="tr-fontsize">{0}.</p>'.format((count++))));
                        }
                    },
                    {
                        data: 'PROFTITLE', title: 'Profile title', width: '30%', createdCell: function (cell, cellData) {
                            $(cell).empty();
                            var a = $('<p class="tr-fontsize"> <a href="#"> {0} </a> </p>'.format(cellData));
                            $(cell).append(a);
                        }
                    },
                    {
                        data: null, title: 'Occupational scope', createdCell: function (cell, cellData, rowData) {
                            $(cell).empty();
                            _this.load_related_occp($(cell), rowData);
                        }
                    },
                    {
                        data: null, title: '', width: '15%', createdCell: function (cell, cellData) {
                            $(cell).empty();
                            var html = React.createElement("table", null, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, " ", React.createElement("button", {className: "btn-row-action btn btn-primary btn-outline pull-right btn-edit", onClick: function () { _this.open_one_profile(cellData); }, style: { marginRight: 10, opacity: 0.2 }}, " ", React.createElement("i", {className: "fa fa-edit"}), " ")), React.createElement("td", null, " ", React.createElement("button", {className: "btn-row-action btn btn-warning btn-outline pull-right", style: { opacity: 0.2 }}, React.createElement("i", {className: "fa fa-times"}), " ")))));
                            ReactDOM.render(html, $(cell)[0]);
                        } }
                ],
                createdRow: function (row, data, dataIndex) {
                    $(row).attr('data-rowid', _.result(data, 'ID'));
                    $(row).hover(function () {
                        $(row).find('.btn-row-action').css('opacity', '1');
                    }, function () {
                        $(row).find('.btn-row-action').css('opacity', '0.2');
                    });
                }
            });
            this.root.find('table').on('page.dt', function () {
                //$('.scroll-table').scrollTop(0);
            });
        };
        ProfileDatalist.prototype.open_one_profile = function (obj) {
            this.notify({
                action: 'open-one-profile',
                data: _.result(obj, 'ID')
            });
        };
        ProfileDatalist.prototype.load_related_occp = function (cell, obj) {
            $(cell).append($('<i class="fa fa-spin fa-spinner"></i>'));
            var ds = new jx.data.DataSource('occp');
            ds.fetch_data({
                where: { ID: _.result(obj, 'OCCPID') }
            }).then(function () {
                var occp = _.result(ds.dm.getEntities('occp')[0], 'OCCPCONCEPT_EN');
                $(cell).empty();
                $(cell).append($('<div class="data" style="max-height:80px" ><p class="tr-fontsize"><a href="#"><span class="txt-ellipsis" >{0}</span></a></p></div>'.format(occp)));
                $(cell).find('.data')['dotdotdot']();
            }).finally(function () {
                if ($(cell).find('i').length > 0) {
                    $(cell).empty();
                }
            });
        };
        return ProfileDatalist;
    }(jx.views.ReactiveView));
    exports.ProfileDatalist = ProfileDatalist;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/profiles/profiles_datalist.js.map