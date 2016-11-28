// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib', 'react-bootstrap'], function (require, exports, React, jx, rb) {
    "use strict";
    var b = rb;
    var EmpEduView = (function (_super) {
        __extends(EmpEduView, _super);
        function EmpEduView(props) {
            _super.call(this, props);
            this.state.emp = props.emp;
        }
        EmpEduView.prototype.render = function () {
            var html = React.createElement(b.Row, null, React.createElement(b.Col, {lg: 12}, React.createElement("h2", null, React.createElement("span", {className: "text-success"}, "Education"), React.createElement(b.Button, {bsStyle: "primary", bsSize: "xs", className: "btn-outline m-l-md"}, React.createElement("i", {className: "fa fa-plus"}), " add"))));
            return html;
        };
        return EmpEduView;
    }(jx.views.ReactiveView));
    exports.EmpEduView = EmpEduView;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/comp/emp_edu_view.js.map