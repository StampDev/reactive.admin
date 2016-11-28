/// <reference path="emps_datalist.tsx" />
/// <reference path="emps_view.tsx" />
/// <reference path="emps_invit.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../../../core/lib', '../../lib/ins_master_page', 'react-bootstrap', './emps_invit', './emps_datalist', './emps_view'], function (require, exports, React, ReactDOM, jx, ins_master_page_1, rb, inv, emps_datalist_1, ep) {
    "use strict";
    var b = rb;
    var EmpsExplorer = (function (_super) {
        __extends(EmpsExplorer, _super);
        function EmpsExplorer() {
            _super.apply(this, arguments);
        }
        EmpsExplorer.prototype.get_page_content = function () {
            return React.createElement(Explorer, null);
        };
        return EmpsExplorer;
    }(ins_master_page_1.InsMasterPage));
    exports.EmpsExplorer = EmpsExplorer;
    var Explorer = (function (_super) {
        __extends(Explorer, _super);
        function Explorer() {
            _super.apply(this, arguments);
        }
        Explorer.prototype.render = function () {
            var html = React.createElement(b.Row, null, React.createElement(b.Col, {lg: 5, className: "animated fadeInRight", style: { paddingLeft: 20, paddingRight: 20 }}, React.createElement("div", {className: "ibox"}, React.createElement("div", {className: "ibox-content"}, React.createElement("h1", {style: { display: 'inline-block' }}, React.createElement("i", {className: "fa fa-user", style: { marginRight: 20 }}), " ", React.createElement("span", null, "Employees")), React.createElement(EmpsExploreActions, {owner: this}), React.createElement("hr", null), React.createElement(emps_datalist_1.EmpsDatalist, {owner: this, model: "usrr", row_count: true, allow_delete_row: true, allow_edit_row: true})))), React.createElement(b.Col, {lg: 7, className: "auxill-view"}));
            return html;
        };
        Explorer.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case "add-new-employee":
                    {
                        this.add_new_emp();
                    }
                    break;
                case jx.forms.actions.EDIT_ROW:
                    {
                        this.edit_emp();
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        Explorer.prototype.add_new_emp = function () {
            var view = React.createElement(inv.EmpsInvitExplorer, {owner: this});
            this.mount_auxil_view(view);
        };
        Explorer.prototype.edit_emp = function () {
            var view = React.createElement(ep.EmpsView, {owner: this, id: this.current_event.data});
            this.mount_auxil_view(view);
        };
        Explorer.prototype.mount_auxil_view = function (content) {
            var container = React.createElement("div", {className: "ibox"}, React.createElement("div", {className: "ibox-content animated fadeInRight", style: { minHeight: 400 }}, content));
            ReactDOM.unmountComponentAtNode(this.root.find('.auxill-view')[0]);
            ReactDOM.render(container, this.root.find('.auxill-view')[0]);
        };
        return Explorer;
    }(jx.views.ReactiveView));
    var EmpsExploreActions = (function (_super) {
        __extends(EmpsExploreActions, _super);
        function EmpsExploreActions() {
            _super.apply(this, arguments);
        }
        EmpsExploreActions.prototype.render = function () {
            var html = React.createElement("div", {className: "pull-right", style: { display: 'inline-block' }}, React.createElement("button", {className: "btn btn-lg btn-primary btn-outline", onClick: this.new_edit.bind(this)}, React.createElement("i", {className: "fa fa-plus-circle"}), " add employees"));
            return html;
        };
        EmpsExploreActions.prototype.new_edit = function () {
            this.props.owner.notify({
                action: 'add-new-employee'
            });
        };
        return EmpsExploreActions;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/emps/emps_explorer.js.map