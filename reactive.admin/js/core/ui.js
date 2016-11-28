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
define(["require", "exports", 'react', 'react-bootstrap', './lib'], function (require, exports, React, rb, jx) {
    "use strict";
    var b = rb;
    var TypeView = (function (_super) {
        __extends(TypeView, _super);
        function TypeView() {
            _super.apply(this, arguments);
        }
        TypeView.prototype.initState = function (state, callback) {
            _super.prototype.setState.call(this, state, callback);
        };
        return TypeView;
    }(jx.views.ReactiveView));
    exports.TypeView = TypeView;
    var BtCtrl = (function (_super) {
        __extends(BtCtrl, _super);
        function BtCtrl() {
            _super.apply(this, arguments);
        }
        return BtCtrl;
    }(TypeView));
    exports.BtCtrl = BtCtrl;
    var Icon = (function (_super) {
        __extends(Icon, _super);
        function Icon() {
            _super.apply(this, arguments);
        }
        Icon.prototype.render = function () {
            return React.createElement("i", __assign({className: "fa {0}".format(this.props.icon)}, this.props));
        };
        return Icon;
    }(BtCtrl));
    exports.Icon = Icon;
    var TextIcon = (function (_super) {
        __extends(TextIcon, _super);
        function TextIcon() {
            _super.apply(this, arguments);
        }
        TextIcon.prototype.render = function () {
            var html = React.createElement(b.FormGroup, null, React.createElement(b.InputGroup, null, React.createElement(b.InputGroup.Addon, null, React.createElement(Icon, {icon: this.props.icon})), React.createElement(b.FormControl, __assign({required: this.props.required, placeholder: this.props.placeholder}, this.props))));
            return html;
        };
        return TextIcon;
    }(BtCtrl));
    exports.TextIcon = TextIcon;
    var TextArea = (function (_super) {
        __extends(TextArea, _super);
        function TextArea() {
            _super.apply(this, arguments);
        }
        TextArea.prototype.render = function () {
            var label = React.createElement(b.ControlLabel, null, this.props.label);
            if (!this.props.label) {
                label = null;
            }
            var html = React.createElement(b.FormGroup, null, label, React.createElement(b.FormControl, {componentClass: "textarea", placeholder: this.props.placeholder}));
            return html;
        };
        return TextArea;
    }(BtCtrl));
    exports.TextArea = TextArea;
    function get(ctrl, props) {
        var View = ctrl;
        return React.createElement(View, __assign({}, props));
    }
    exports.get = get;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/core/ui.js.map