/// <reference path="profiles_datalist.tsx" />
/// <reference path="profile_edit_view.tsx" />
/// <reference path="profiles_new.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../../lib/ins_master_page', '../../../core/lib', './profiles_datalist', './profile_edit_view', './profiles_new'], function (require, exports, React, ReactDOM, ins_master_page_1, jx, dl, ed, nw) {
    "use strict";
    var ProfilesMasterPage = (function (_super) {
        __extends(ProfilesMasterPage, _super);
        function ProfilesMasterPage() {
            _super.apply(this, arguments);
        }
        ProfilesMasterPage.prototype.get_page_content = function () {
            return React.createElement(ProfilesExplorer, null);
        };
        return ProfilesMasterPage;
    }(ins_master_page_1.InsMasterPage));
    exports.ProfilesMasterPage = ProfilesMasterPage;
    var ProfilesExplorer = (function (_super) {
        __extends(ProfilesExplorer, _super);
        function ProfilesExplorer() {
            _super.apply(this, arguments);
        }
        ProfilesExplorer.prototype.render = function () {
            var html = React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-lg-5 animated fadeInRight"}, React.createElement("div", {className: "ibox"}, React.createElement("div", {className: "ibox-content"}, React.createElement("h1", {style: { display: 'inline-block' }}, React.createElement("i", {className: "fa fa-file-text", style: { marginRight: 20 }}), " ", React.createElement("span", null, "Professional profiles")), React.createElement(ProfileExploreActions, {owner: this}), React.createElement("br", null), React.createElement("hr", null), React.createElement("br", null), React.createElement("div", null, React.createElement(dl.ProfileDatalist, {owner: this}))))), React.createElement("div", {className: "col-lg-7 auxill-view", style: { minHeight: 900 }}));
            return html;
        };
        ProfilesExplorer.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                    }
                    break;
                case 'edit-profile':
                    {
                        this.edit_profile();
                    }
                    break;
                case 'add-new-profile':
                    {
                        this.add_new_profile();
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        ProfilesExplorer.prototype.edit_profile = function () {
            this.mount_auxil_view(React.createElement(ed.ProfileEditView, {id: this.current_event.data, owner: this}));
        };
        ProfilesExplorer.prototype.add_new_profile = function () {
            this.mount_auxil_view(React.createElement(nw.ProfilesAddNew, {owner: this}));
        };
        ProfilesExplorer.prototype.mount_auxil_view = function (content) {
            var container = React.createElement("div", {className: "ibox"}, React.createElement("div", {className: "ibox-content animated fadeInRight", style: { minHeight: 800 }}, content));
            ReactDOM.unmountComponentAtNode(this.root.find('.auxill-view')[0]);
            ReactDOM.render(container, this.root.find('.auxill-view')[0]);
        };
        return ProfilesExplorer;
    }(jx.views.ReactiveView));
    var ProfileExploreActions = (function (_super) {
        __extends(ProfileExploreActions, _super);
        function ProfileExploreActions() {
            _super.apply(this, arguments);
        }
        ProfileExploreActions.prototype.render = function () {
            var html = React.createElement("div", {className: "pull-right", style: { display: 'inline-block' }}, React.createElement("button", {className: "btn btn-lg btn-primary btn-outline", onClick: this.new_edit.bind(this)}, React.createElement("i", {className: "fa fa-plus-circle"}), " new profile"));
            return html;
        };
        ProfileExploreActions.prototype.new_edit = function () {
            this.broadcast({
                action: 'add-new-profile'
            });
        };
        return ProfileExploreActions;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/profiles/profiles_explorer.js.map