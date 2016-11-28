/// <reference path="../../app/smrtpage.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../app/smrtpage'], function (require, exports, sm) {
    "use strict";
    var HomePage = (function (_super) {
        __extends(HomePage, _super);
        function HomePage() {
            _super.apply(this, arguments);
        }
        HomePage.prototype.test = function () {
            alert('hello world');
        };
        return HomePage;
    }(sm.SmartPage));
    exports.HomePage = HomePage;
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/qwsmrt/pages/home/homepage.js.map