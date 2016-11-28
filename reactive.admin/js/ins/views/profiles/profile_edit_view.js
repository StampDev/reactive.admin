/// <reference path="profile_edit_basicinfo.tsx" />
/// <reference path="profile_edit_activs.tsx" />
/// <reference path="profile_edit_skills.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-bootstrap', '../../../core/lib', './profile_edit_basicinfo', './profile_edit_activs', './profile_edit_skills'], function (require, exports, React, rb, jx, profile_edit_basicinfo_1, profile_edit_activs_1, profile_edit_skills_1) {
    "use strict";
    var b = rb;
    var ProfileEditView = (function (_super) {
        __extends(ProfileEditView, _super);
        function ProfileEditView(props) {
            _super.call(this, props);
            this.state.loading = true;
        }
        Object.defineProperty(ProfileEditView.prototype, "ds", {
            get: function () {
                if (!this.__ds) {
                    this.__ds = new jx.data.DataSource('prof');
                }
                return this.__ds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileEditView.prototype, "prof", {
            get: function () {
                return this.ds.dm.getEntities('prof')[0];
            },
            enumerable: true,
            configurable: true
        });
        ProfileEditView.prototype.render = function () {
            var html = React.createElement("div", {className: "p-md profileEditView"}, React.createElement("h1", null, React.createElement("i", {className: "fa fa-pencil-square-o", style: { marginRight: 10 }}), " ", React.createElement("span", null, "View/Edit profile"), React.createElement(rb.Button, {bsStyle: "warning", bsSize: "small", className: "btn-outline pull-right"}, React.createElement("i", {className: "fa fa-trash text-warning"}))), React.createElement("hr", {className: ".hr-line-dashed"}), this.inner_content());
            return html;
        };
        ProfileEditView.prototype.inner_content = function () {
            var html = React.createElement(jx.views.LoaderView, {height: 450});
            if (!this.state.loading) {
                html =
                    React.createElement("div", null, this.state.profile_title, React.createElement("br", null), React.createElement(b.Tabs, {defaultActiveKey: 1, id: "tabs"}, React.createElement(b.Tab, {eventKey: 1, title: "Basic information"}, React.createElement("br", null), React.createElement("br", null), React.createElement("div", {className: "info"}, React.createElement(profile_edit_basicinfo_1.ProfileEditBasicInfo, {owner: this, profid: this.props.id}))), React.createElement(b.Tab, {eventKey: 2, title: "Profile activities"}, React.createElement("br", null), React.createElement("br", null), React.createElement("div", {className: "activs"}, React.createElement(profile_edit_activs_1.ProfileEditActivs, {owner: this}))), React.createElement(b.Tab, {eventKey: 3, title: "Profile skills"}, React.createElement("br", null), React.createElement("br", null), React.createElement("div", {className: "skills"}, React.createElement(profile_edit_skills_1.ProfileEditSkills, {owner: this})))));
            }
            return html;
        };
        ProfileEditView.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        var that = this;
                        this.load_profile()
                            .then(function () {
                            _this.load_occp().then(function () {
                                _this.updateState({
                                    profile_title: React.createElement(ProfileHeaderInfo, {title: React.createElement("h2", null, _.result(that.prof, 'PROFTITLE'))}),
                                    loading: false
                                }, function () {
                                    _this.fix_tabs_urls();
                                    _this.broadcast({
                                        action: 'profile-loaded',
                                        data: {
                                            prof: _this.prof,
                                            occp: _this.occp_obj
                                        }, done: function () {
                                            //this.root['slimScroll']({
                                            //    height: '820px'
                                            //});
                                        }
                                    });
                                });
                            });
                        });
                    }
                    break;
                case 'profile-saved':
                    {
                        var ent = this.current_event.data;
                        var __data = ent.entityAspect.entityManager.exportEntities();
                        this.ds.dm.importEntities(__data);
                        this.updateState({
                            profile_title: React.createElement(ProfileHeaderInfo, {title: React.createElement("h1", null, _.result(this.prof, 'PROFTITLE'))})
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        ProfileEditView.prototype.fix_tabs_urls = function () {
            _.each(this.root.find('li[role="presentation"]'), function (li) {
                var a = $(li).find('a');
                var url = a.attr('aria-controls');
                $(a).attr('href', '#{0}'.format(url));
                $(a).off('click');
                $(a).click(function (e) {
                    e.preventDefault();
                });
            });
        };
        ProfileEditView.prototype.load_profile = function () {
            var d = Q.defer();
            this.ds.fetch_data({
                where: {
                    ID: { 'eq': this.props.id }
                },
                expand: ['proa', 'pros']
            }).then(function () {
                d.resolve(true);
            });
            return d.promise;
        };
        ProfileEditView.prototype.load_occp = function () {
            var _this = this;
            var d = Q.defer();
            var prof = this.ds.dm.getEntities('prof')[0];
            var ds = new jx.data.DataSource('occp');
            ds.exec_query({
                where: {
                    'ID': { 'eq': this.prof.OCCPID() }
                }
            }).then(function (data) {
                _this.occp_obj = data[0];
                d.resolve(true);
            });
            return d.promise;
        };
        return ProfileEditView;
    }(jx.views.ReactiveView));
    exports.ProfileEditView = ProfileEditView;
    var ProfileHeaderInfo = (function (_super) {
        __extends(ProfileHeaderInfo, _super);
        function ProfileHeaderInfo(props) {
            _super.call(this, props);
            _.extend(this.state, props);
        }
        ProfileHeaderInfo.prototype.render = function () {
            var title = this.state.title;
            var html = React.createElement("div", null, React.createElement("table", {width: '100%'}, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, React.createElement("div", {style: { marginRight: 10 }}, React.createElement("h5", null, "Usage"), React.createElement("h2", null, "65%"), React.createElement("div", {className: "progress progress-mini"}, React.createElement("div", {style: { width: '68%' }, className: "progress-bar"})), React.createElement("div", {className: "m-t-sm small"}, "last update 4: 32 pm."))), React.createElement("td", null, React.createElement("div", {style: { marginRight: 25 }}, React.createElement("h5", null, "Search hits"), React.createElement("h2", null, "14%"), React.createElement("div", {className: "progress progress-mini"}, React.createElement("div", {style: { width: '38%' }, className: "progress-bar progress-bar-danger"})), React.createElement("div", {className: "m-t-sm small"}, "last update 4: 32 pm."))), React.createElement("td", null, title)))), React.createElement("hr", null));
            return html;
        };
        ProfileHeaderInfo.prototype.componentWillReceiveProps = function (nextProps) {
            _super.prototype.componentWillReceiveProps.call(this, nextProps);
            _.extend(this.state, nextProps);
        };
        return ProfileHeaderInfo;
    }(jx.views.ReactiveView));
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/profiles/profile_edit_view.js.map