/// <reference path="../../../core/ui.tsx" />
/// <reference path="../../../core/lib.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", 'react', 'react-bootstrap', '../../../core/ui'], function (require, exports, React, rb, ui) {
    "use strict";
    var b = rb;
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text() {
            _super.apply(this, arguments);
        }
        Text.prototype.render = function () {
            var html = React.createElement(b.FormGroup, null, React.createElement(b.InputGroup, null, React.createElement(b.FormControl, __assign({required: true, placeholder: this.props.placeholder}, this.props))));
            return html;
        };
        return Text;
    }(ui.TypeView));
    exports.Text = Text;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/lib/ins.js.map