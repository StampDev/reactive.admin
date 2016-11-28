/// <reference path="../../qw/lib/qwpage.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-bootstrap', '../../qw/lib/qwpage'], function (require, exports, React, rb, p) {
    "use strict";
    var b = rb;
    var SmartPage = (function (_super) {
        __extends(SmartPage, _super);
        function SmartPage() {
            _super.apply(this, arguments);
        }
        SmartPage.prototype.render = function () {
            var html = React.createElement("div", {className: "container", style: { paddingTop: 60 }}, React.createElement("div", {className: "jumbotron"}, React.createElement("h1", null, "Smart admin")));
            return html;
        };
        return SmartPage;
    }(p.QwPage));
    exports.SmartPage = SmartPage;
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/qwsmrt/app/smrtPage.js.map