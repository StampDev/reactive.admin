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
    var SmartHomePage = (function (_super) {
        __extends(SmartHomePage, _super);
        function SmartHomePage() {
            _super.apply(this, arguments);
        }
        SmartHomePage.prototype.render = function () {
            var ui = {};
            var html = React.createElement("div", null, ui.header, ui.aside_left, ui.main, ui.footer, ui.shortcut);
            return html;
        };
        SmartHomePage.prototype.test = function () {
            alert('hello world');
        };
        return SmartHomePage;
    }(sm.SmartPage));
    exports.SmartHomePage = SmartHomePage;
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/qw.smrt/pages/home/homepage.js.map