// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../core/lib'], function (require, exports, React, jx) {
    "use strict";
    var InsWrapperContent = (function (_super) {
        __extends(InsWrapperContent, _super);
        function InsWrapperContent() {
            _super.apply(this, arguments);
        }
        InsWrapperContent.prototype.render = function () {
            var html = React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-lg-12"}, React.createElement("div", {className: "wrapper wrapper-content page-content"}, this.state.content)), React.createElement("div", {className: "footer"}, React.createElement("div", {className: "pull-right"}, "10GB of ", React.createElement("strong", null, "250GB"), " Free."), React.createElement("div", null, React.createElement("strong", null, "Copyright"), " Example Company © 2014-2015")));
            return html;
        };
        InsWrapperContent.prototype.componentWillMount = function () {
            var _this = this;
            $('body').addClass('gray-bg');
            jx.pubsub.subscribe('onSetcontent', function (msg, args) {
                _this.setState(_.extend(_this.state, args));
            });
        };
        InsWrapperContent.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            //1. send to master page that wrapper is ready 
            // --> see master_page for nect action
            jx.pubsub.publish('onWrappercontentMounted');
        };
        return InsWrapperContent;
    }(jx.views.ReactView));
    exports.InsWrapperContent = InsWrapperContent;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/market/lib/ins_wrapper_content.js.map