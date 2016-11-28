// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib', 'react-bootstrap', '../../../core/ui'], function (require, exports, React, jx, rb, ui) {
    "use strict";
    var b = rb;
    var EmpsHeaderInfo = (function (_super) {
        __extends(EmpsHeaderInfo, _super);
        function EmpsHeaderInfo() {
            _super.apply(this, arguments);
        }
        EmpsHeaderInfo.prototype.render = function () {
            if (this.state.loading) {
                return React.createElement("i", {className: "fa fa-spin fa-spinner"});
            }
            var usr_name = '{0} {1}'.format(_.result(this.usr, 'usrname'), _.result(this.usr, 'usrsurname'));
            var html = React.createElement("div", {className: "row", style: { marginBottom: 30 }}, React.createElement("div", {className: "col-md-12"}, React.createElement("div", {className: "profile-image"}, React.createElement("img", {src: "/ins/img/a4.jpg", className: "img-circle circle-border m-b-md", alt: "profile"})), React.createElement("div", {className: "profile-info"}, React.createElement("div", {className: ""}, React.createElement("div", null, React.createElement("h2", {className: "no-margins"}, React.createElement("span", {className: "text-danger"}, usr_name)), React.createElement("h4", null, "Current job position"), React.createElement("small", {className: ""}, "About {0}".format(usr_name)))))), React.createElement("br", null), React.createElement("div", {className: "col-md-8 m-b-sm"}, React.createElement("table", {className: "table small m-b-xs"}, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "142"), " Activities"), React.createElement("td", null, React.createElement("strong", null, "22"), " skills")), React.createElement("tr", null, React.createElement("td", null, React.createElement("strong", null, "Department"), " Comments"), React.createElement("td", null, React.createElement("strong", null, "Overall score"), " ", "36%"))))), React.createElement("br", null));
            return html;
        };
        Object.defineProperty(EmpsHeaderInfo.prototype, "usr", {
            get: function () {
                return this.ds.findkey(_.result(this.props.emp, 'usrid'));
            },
            enumerable: true,
            configurable: true
        });
        EmpsHeaderInfo.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        if (this.state.loading) {
                            this.ds = new jx.data.DataSource('usr');
                            this.ds.exec_query({
                                where: { id: _.result(this.props.emp, 'usrid') }
                            }).then(function () {
                                _this.newState({
                                    loading: false
                                });
                            });
                        }
                    }
                    break;
                case 'update-user':
                    {
                        this.newState({
                            reload: true
                        }, function () {
                            utils.spin(_this.root);
                            _this.ds.dm.clear();
                            _this.ds.exec_query({
                                where: { id: _.result(_this.current_event.data, 'id') }
                            }).then(function () {
                                _this.newState({
                                    reload: false
                                }, function () {
                                    utils.unspin(_this.root);
                                });
                            });
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return EmpsHeaderInfo;
    }(ui.TypeView));
    exports.EmpsHeaderInfo = EmpsHeaderInfo;
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/comp/emp_header_info_view.js.map