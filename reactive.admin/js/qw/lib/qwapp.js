/// <reference path="qwtypes.tsx" />
/// <reference path="qwrouter.tsx" />
/// <reference path="qwrouter.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
define(["require", "exports", './qwrouter'], function (require, exports, rt) {
    "use strict";
    var QuickWaveApp = (function () {
        function QuickWaveApp() {
            window['quickwave-app'] = this;
        }
        QuickWaveApp.prototype.Start = function () {
            //1. Init backendless
            this.init_backendLess();
            //2. Init namespace
            this.init_applayout();
            this.startRouter();
        };
        Object.defineProperty(QuickWaveApp.prototype, "appSettings", {
            get: function () {
                if (!this.__settings) {
                    this.__settings = this.get_app_settings();
                }
                return this.__settings;
            },
            enumerable: true,
            configurable: true
        });
        QuickWaveApp.prototype.get_app_settings = function () {
            return null;
        };
        QuickWaveApp.prototype.init_backendLess = function () {
            Backendless.initApp(this.appSettings.BACKENDLESS_APPID, this.appSettings.BACKENDLESS_KEYID, this.appSettings.BACKENDLESS_VERID);
        };
        QuickWaveApp.prototype.init_applayout = function () {
            //1. append css files
            if (this.appSettings.Files && this.appSettings.Files.css) {
            }
            //2. load js files
            if (this.appSettings.Files && this.appSettings.Files.js) {
                _.each(this.appSettings.Files.js, function (js) {
                    $.getScript(js);
                });
            }
        };
        QuickWaveApp.prototype.startRouter = function () {
            this._router = new rt.QwickWaveRouter(this.appSettings.pagedir, this.appSettings.Menus);
            this._router.startRouting();
        };
        return QuickWaveApp;
    }());
    exports.QuickWaveApp = QuickWaveApp;
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/qw/lib/qwapp.js.map