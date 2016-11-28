/// <reference path="../../qw.base/lib/qwtypes.tsx" />
/// <reference path="../../qw.base/lib/qwapp.tsx" />
/// <reference path="smrtpage.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../qw.cli/app', './smrtpage'], function (require, exports, React, cli, page) {
    "use strict";
    var SmartApp = (function (_super) {
        __extends(SmartApp, _super);
        function SmartApp() {
            _super.apply(this, arguments);
        }
        SmartApp.prototype.get_app_settings = function () {
            var setts = _.extend(_super.prototype.get_app_settings.call(this), {
                namespace: 'qw.smrt',
                pagedir: '../../qw.smrt',
                Menus: [
                    { name: 'home', title: 'home', icon: 'fa fa-home', url: '/', path: '/pages/home/smrt-homepage' },
                    { name: 'products', title: 'products', icon: 'fa fa-th-large', url: '/products/*', path: '/pages/products/productexplorer_page' },
                    { name: 'customers', title: 'customers', icon: 'fa fa-user', url: '/customers' }
                ]
            });
            return setts;
        };
        SmartApp.prototype.get_AppPageLayout = function (menu) {
            return React.createElement(page.SmartPage, null);
        };
        return SmartApp;
    }(cli.AppBase));
    exports.SmartApp = SmartApp;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/qw.smrt/app/smrtApp.js.map