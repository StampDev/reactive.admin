// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Application = (function () {
        function Application() {
        }
        Application.prototype.start = function () {
            var v = 1;
            return v + 1;
        };
        return Application;
    }());
    exports.Application = Application;
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/qw/app.js.map