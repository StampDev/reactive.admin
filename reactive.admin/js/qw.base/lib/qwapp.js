/// <reference path="qwtypes.tsx" />
/// <reference path="qwlib.tsx" />
define(["require", "exports", 'react', 'react-dom', './qwlib'], function (require, exports, React, ReactDOM, lib) {
    "use strict";
    var QwWaveApp = (function () {
        function QwWaveApp() {
            window['quickwave-app'] = this;
        }
        QwWaveApp.prototype.Start = function () {
            //1. Init backendless
            this.init_backendLess();
            //2. Init namespace
            this.init_applayout();
            this.startRouter();
        };
        Object.defineProperty(QwWaveApp.prototype, "appSettings", {
            get: function () {
                if (!this.__settings) {
                    this.__settings = this.get_app_settings();
                }
                return this.__settings;
            },
            enumerable: true,
            configurable: true
        });
        QwWaveApp.prototype.get_app_settings = function () {
            return null;
        };
        QwWaveApp.prototype.init_backendLess = function () {
            Backendless.initApp(this.appSettings.BACKENDLESS_APPID, this.appSettings.BACKENDLESS_KEYID, this.appSettings.BACKENDLESS_VERID);
        };
        QwWaveApp.prototype.init_applayout = function () {
        };
        QwWaveApp.prototype.get_AppPageLayout = function (menu) {
            return null;
        };
        QwWaveApp.prototype.startRouter = function () {
            this._router = new QwRouter(this);
            this._router.startRouting();
        };
        return QwWaveApp;
    }());
    exports.QwWaveApp = QwWaveApp;
    var Constants;
    (function (Constants) {
        Constants.CURRENT_ROUTE = 'CURRENT_ROUTE';
    })(Constants = exports.Constants || (exports.Constants = {}));
    var QwRouter = (function () {
        function QwRouter(app) {
            this.app = app;
        }
        QwRouter.prototype.startRouting = function () {
            var _this = this;
            _.each(this.app.appSettings.Menus, function (r) {
                page(r.url, function (ctx) {
                    lib.local.set(Constants.CURRENT_ROUTE, {
                        params: ctx.params,
                        path: ctx.path
                    });
                    var path = '{0}{1}'.format(_this.app.appSettings.pagedir, r.path);
                    require([path], function (rst) {
                        var Page = rst[Object.keys(rst)[0]];
                        ReactDOM.unmountComponentAtNode($('#applayout')[0]);
                        ReactDOM.render(React.createElement(Page, null), $('#applayout')[0]);
                    });
                });
            });
            page.start();
        };
        return QwRouter;
    }());
    exports.QwRouter = QwRouter;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/qw.base/lib/qwapp.js.map