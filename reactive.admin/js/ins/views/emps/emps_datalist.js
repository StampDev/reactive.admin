/// <reference path="../../../core/lib.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', 'react-bootstrap', "../../../core/lib"], function (require, exports, React, ReactDOM, rb, jx) {
    "use strict";
    var b = rb;
    var EmpsDatalist = (function (_super) {
        __extends(EmpsDatalist, _super);
        function EmpsDatalist(props) {
            _super.call(this, props);
            this.props.owner['__datalist'] = this;
        }
        EmpsDatalist.prototype.render = function () {
            if (this.state.loading) {
                return _super.prototype.render.call(this);
            }
            var content = null;
            if (this.state.data.length > 0) {
                content = _super.prototype.render.call(this);
            }
            else {
                content =
                    React.createElement("div", {className: "alert alert-info"}, React.createElement("h3", {className: "m-l-xs"}, "No employee has been added yet"), React.createElement("p", null, "Press \"add employees\" and invite your employees to join Stamp"));
            }
            var html = React.createElement("div", {style: { minHeight: 650 }}, content);
            return html;
        };
        Object.defineProperty(EmpsDatalist.prototype, "tbl_settings", {
            get: function () {
                return this.get_table_settings();
            },
            enumerable: true,
            configurable: true
        });
        EmpsDatalist.prototype.get_table_settings = function () {
            var setts = {
                columns: [
                    {
                        title: '', data: null
                    },
                    { title: '', data: 'USRRNAME' },
                    { title: '', data: 'USRRSURNAME' }
                ]
            };
            return setts;
        };
        EmpsDatalist.prototype.createdCell = function (cell, cellData, rowData, row, col) {
            if (col === 1) {
                var src = '/ins/img/a{0}.jpg'.format(chance.integer({ min: 1, max: 8 }));
                ReactDOM.render(React.createElement("img", {src: src, className: "img-md img-circle"}), $(cell)[0]);
            }
            if (col >= 2 && col <= 3) {
                $(cell).empty();
                $(cell).append($('<p>{0}</p>'.format(cellData)));
                $(cell).addClass('tr-fontsize');
            }
        };
        EmpsDatalist.prototype.load_data = function () {
            var _this = this;
            var d = Q.defer();
            this.ds.fetch_data({
                where: {
                    'COMPID': { eq: this.app.currentUser['compid'] }
                }
            }).then(function () {
                d.resolve(_this.ds.dm.getEntities(_this.props.model));
            });
            return d.promise;
        };
        return EmpsDatalist;
    }(jx.forms.ui.DataList));
    exports.EmpsDatalist = EmpsDatalist;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/emps/emps_datalist.js.map