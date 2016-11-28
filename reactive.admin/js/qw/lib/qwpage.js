/// <reference path="qwtypes.tsx" />
/// <reference path="qwview.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react-bootstrap', './qwview'], function (require, exports, rb, vi) {
    "use strict";
    var b = rb;
    var QwPage = (function (_super) {
        __extends(QwPage, _super);
        function QwPage() {
            _super.apply(this, arguments);
        }
        return QwPage;
    }(vi.QwView));
    exports.QwPage = QwPage;
    var QwAppMenus = (function (_super) {
        __extends(QwAppMenus, _super);
        function QwAppMenus() {
            _super.apply(this, arguments);
        }
        return QwAppMenus;
    }(vi.QwView));
    exports.QwAppMenus = QwAppMenus;
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/qw/lib/qwpage.js.map