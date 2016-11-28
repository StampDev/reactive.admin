/// <reference path="qwdata.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-bootstrap', './qwview', './qwdata'], function (require, exports, React, rb, qw, qd) {
    "use strict";
    var b = rb;
    var QwExplorer = (function (_super) {
        __extends(QwExplorer, _super);
        function QwExplorer() {
            _super.apply(this, arguments);
        }
        QwExplorer.prototype.get_model = function () {
            return null;
        };
        Object.defineProperty(QwExplorer.prototype, "ds", {
            get: function () {
                if (!this._ds) {
                    this._ds = new qd.DataSource(this.get_model());
                }
                return this._ds;
            },
            enumerable: true,
            configurable: true
        });
        QwExplorer.prototype.render = function () {
            var ui = this.get_uiSchema();
            var html = React.createElement("div", null, ui.title, "  ", ui.buttons, ui.datalist, ui.data_form);
            return html;
        };
        QwExplorer.prototype.on_notify = function () {
            switch (this.activeEvent.name) {
                case qw.Constants.HasMounted:
                    {
                        this.load_data();
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        QwExplorer.prototype.load_data = function () {
            return this.ds.fetch_data();
        };
        return QwExplorer;
    }(qw.QwView));
    exports.QwExplorer = QwExplorer;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/qw.base/lib/qwexplorer.js.map