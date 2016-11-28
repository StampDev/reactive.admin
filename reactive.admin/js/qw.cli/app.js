/// <reference path="../qw.base/lib/qwapp.tsx" />
/// <reference path="../qw.base/lib/qwtypes.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../qw.base/lib/qwapp'], function (require, exports, app) {
    "use strict";
    var AppBase = (function (_super) {
        __extends(AppBase, _super);
        function AppBase() {
            _super.apply(this, arguments);
        }
        AppBase.prototype.get_app_settings = function () {
            return {
                BACKENDLESS_APPID: '5F76BFFF-B6EE-F6AB-FFE2-5051554CA500',
                BACKENDLESS_KEYID: '06A5D87B-83D9-0A58-FF6A-11ABA901C100',
                BACKENDLESS_VERID: 'V1',
                namespace: 'qw.ins',
                pagedir: '../../qw.ins',
                Menus: [
                    { name: 'home', title: 'home', icon: 'fa fa-home', url: '/' },
                    { name: 'products', title: 'products', icon: 'fa fa-th-large', url: '/products/*' },
                    { name: 'customers', title: 'customers', icon: 'fa fa-user', url: '/customers' }
                ]
            };
        };
        return AppBase;
    }(app.QwWaveApp));
    exports.AppBase = AppBase;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/qw.cli/app.js.map