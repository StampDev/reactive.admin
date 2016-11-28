/// <reference path="../../qw/lib/qwtypes.tsx" />
/// <reference path="../../qw/lib/qwapp.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../qw/lib/qwapp'], function (require, exports, app) {
    "use strict";
    var SmartApp = (function (_super) {
        __extends(SmartApp, _super);
        function SmartApp() {
            _super.apply(this, arguments);
        }
        SmartApp.prototype.get_app_settings = function () {
            return {
                BACKENDLESS_APPID: '5F76BFFF-B6EE-F6AB-FFE2-5051554CA500',
                BACKENDLESS_KEYID: '06A5D87B-83D9-0A58-FF6A-11ABA901C100',
                BACKENDLESS_VERID: 'V1',
                namespace: 'qw.smrt',
                pagedir: '../../qwsmrt',
                Files: {
                    css: [
                        { media: 'screen', href: '/qw.smrt/css/smartadmin-production.min.css' },
                        { media: 'screen', href: '/qw.smrt/css/smartadmin-skins.min.css' },
                        { rel: 'shortcut icon', href: '/qw.smrt/img/favicon/favicon.ico', type: 'image/x-icon' },
                        { rel: 'icon', href: '/qw.smrt/img/favicon/favicon.ico', type: 'image/x-icon' },
                        { rel: 'icon', href: "http://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700", type: '' },
                        { rel: "apple-touch-icon", href: "/qw.smrt/img/splash/sptouch-icon-iphone.png" },
                        { rel: "apple-touch-icon", sizes: "76x76", href: "/qw.smrt/img/splash/touch-icon-ipad.png" },
                        { rel: "apple-touch-icon", sizes: "120x120", href: "/qw.smrt/img/splash/touch-icon-iphone-retina.png" },
                        { rel: "apple-touch-icon", sizes: "152x152", href: "/qw.smrt/img/splash/touch-icon-ipad-retina.png" }
                    ],
                    js: [
                        "/qw.smrt/js/app.config.seed.js",
                        "/qw.smrt/js/app.seed.js"
                    ]
                },
                Menus: [
                    { name: 'home', title: 'home', icon: 'fa fa-home', url: '/', path: '/pages/home/homepage' }
                ]
            };
        };
        return SmartApp;
    }(app.QuickWaveApp));
    exports.SmartApp = SmartApp;
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/qwsmrt/app/smrtApp.js.map