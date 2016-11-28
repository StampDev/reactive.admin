/// <reference path="qwtypes.tsx" />
/// <reference path="qwlib.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
define(["require", "exports", 'react', 'react-dom', './qwlib'], function (require, exports, React, ReactDOM, lib) {
    "use strict";
    var constants;
    (function (constants) {
        constants.current_route = 'current_route';
    })(constants = exports.constants || (exports.constants = {}));
    var QwickWaveRouter = (function () {
        function QwickWaveRouter(dir, routes) {
            this._dir = dir;
            this._routes = routes;
        }
        QwickWaveRouter.prototype.startRouting = function () {
            var that = this;
            _.each(this._routes, function (r) {
                page(r.url, function (ctx) {
                    lib.local.set(constants.current_route, {
                        params: ctx.params,
                        path: ctx.path
                    });
                    var path = '{0}{1}'.format(that._dir, r.path);
                    require([path], function (rst) {
                        var Page = rst[Object.keys(rst)[0]];
                        ReactDOM.unmountComponentAtNode($('#applayout')[0]);
                        ReactDOM.render(React.createElement(Page, null), $('#applayout')[0]);
                    });
                });
            });
            page.start();
        };
        return QwickWaveRouter;
    }());
    exports.QwickWaveRouter = QwickWaveRouter;
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/qw/lib/qwrouter.js.map