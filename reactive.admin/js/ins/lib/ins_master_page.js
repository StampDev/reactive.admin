/// <reference path="../../core/jx__.tsx" />
/// <reference path="ins_page_menus.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../core/lib', './ins_page_menus', './ins_page_wrapper'], function (require, exports, React, jx, ins_page_menus_1, ins_page_wrapper_1) {
    "use strict";
    var ins;
    (function (ins) {
        var constants;
        (function (constants) {
            constants.on_tbl_record_opened = 'on_tbl_record_opened';
        })(constants = ins.constants || (ins.constants = {}));
    })(ins = exports.ins || (exports.ins = {}));
    var InsMasterPage = (function (_super) {
        __extends(InsMasterPage, _super);
        function InsMasterPage() {
            _super.apply(this, arguments);
        }
        InsMasterPage.prototype.render = function () {
            var html = React.createElement("div", {className: "master-page"}, React.createElement(ins_page_menus_1.InsPageNavBar, null), React.createElement(ins_page_wrapper_1.InsPageWrapper, null));
            return html;
        };
        InsMasterPage.prototype.componentWillMount = function () {
            var _this = this;
            $('body').addClass('gray-bg');
            // 2. received message from wrapper_content
            jx.pubsub.subscribe('onWrappercontentMounted', function () {
                _this.set_content();
            });
        };
        InsMasterPage.prototype.componentDidMount = function () {
            $('body').removeClass('gray-bg');
            $.getScript('/ins/js/inspinia.js');
        };
        InsMasterPage.prototype.set_content = function () {
            // 3. send content to wrapper_content
            jx.pubsub.publish('onSetcontent', {
                content: this.get_page_content()
            });
        };
        InsMasterPage.prototype.get_page_content = function () {
            return null;
        };
        return InsMasterPage;
    }(jx.views.BaseMasterPage));
    exports.InsMasterPage = InsMasterPage;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/lib/ins_master_page.js.map