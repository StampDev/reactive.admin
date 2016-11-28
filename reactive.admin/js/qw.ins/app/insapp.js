/// <reference path="../../qw.cli/app.tsx" />
/// <reference path="inspage.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../qw.cli/app', './inspage'], function (require, exports, React, cli, page) {
    "use strict";
    var InsApp = (function (_super) {
        __extends(InsApp, _super);
        function InsApp() {
            _super.apply(this, arguments);
        }
        InsApp.prototype.get_app_settings = function () {
            var setts = _.extend(_super.prototype.get_app_settings.call(this), {
                namespace: 'qw.ins',
                pagedir: '../../qw.ins',
                Menus: [
                    { name: 'home', title: 'home', icon: 'fa fa-home', url: '/', path: '/pages/home/ins-homepage' },
                    { name: 'products', title: 'products', icon: 'fa fa-th-large', url: '/products/*' },
                    { name: 'customers', title: 'customers', icon: 'fa fa-user', url: '/customers' }
                ]
            });
            return setts;
        };
        InsApp.prototype.get_AppPageLayout = function (menu) {
            return React.createElement(page.InsPage, null);
        };
        return InsApp;
    }(cli.AppBase));
    exports.InsApp = InsApp;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/qw.ins/app/insApp.js.map