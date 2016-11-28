/// <reference path="../../../../typings/react/react-bootstrap.d.ts" />
/// <reference path="profile_occptree.tsx" />
/// <reference path="../acts/activities_explorer.tsx" />
/// <reference path="../occp/occp_list.tsx" />
/// <reference path="../skills/skills_explorer.tsx" />
/// <reference path="wiz_page_finish.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../../../core/lib', 'react-bootstrap', './profile_occptree', '../acts/activities_explorer', '../skills/skills_explorer', './wiz_page_finish'], function (require, exports, React, jx, rb, profile_occptree_1, activities_explorer_1, skills_explorer_1, wiz_page_finish_1) {
    "use strict";
    var b = rb;
    var ProfilesAddNew = (function (_super) {
        __extends(ProfilesAddNew, _super);
        function ProfilesAddNew() {
            _super.apply(this, arguments);
        }
        ProfilesAddNew.prototype.render = function () {
            var html = React.createElement("div", {className: "", style: { minHeight: 400 }}, React.createElement("h1", {className: "text-info", style: { display: 'inline-block' }}, React.createElement("i", {className: "fa fa-plus-square", style: { marginRight: 20 }}), " ", React.createElement("span", null, "Add a new professional profile")), React.createElement("button", {className: "btn btn-warning btn-outline pull-right", onClick: this.cancel_wizard.bind(this)}, React.createElement("i", {className: "fa fa-reply"}), " cancel"), React.createElement("hr", null), React.createElement(ProfileWizard, {owner: this}));
            return html;
        };
        ProfilesAddNew.prototype.cancel_wizard = function () {
            this.app.router.navigate('/profiles');
        };
        return ProfilesAddNew;
    }(jx.views.ReactiveView));
    exports.ProfilesAddNew = ProfilesAddNew;
    var ProfileWizard = (function (_super) {
        __extends(ProfileWizard, _super);
        function ProfileWizard(props) {
            _super.call(this, props);
            this.pages = [];
        }
        ProfileWizard.prototype.render = function () {
            var mess = 'Les articles selectionnes ont ete transferes avec success';
            if (this.state.affected_items === 0) {
                mess = "Aucun article selectionne n'a ete transfere. Raison possible: ces articles existent deja dans nos invenatires ";
            }
            var html = React.createElement("div", {className: "animated fadeInRight", style: { minHeight: 350 }}, React.createElement(b.Row, {className: "wizard-content", style: { paddingLeft: 20, paddingRight: 20 }}, React.createElement("div", {className: 'wizard-place-holder'}, this.build_wizard())));
            return html;
        };
        ProfileWizard.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.init_wizard();
        };
        ProfileWizard.prototype.componentDidUpdate = function () {
            _super.prototype.componentDidUpdate.call(this);
            if (this.state.completed) {
            }
        };
        ProfileWizard.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case 'prof-stored':
                    {
                        this.prof = this.current_event.data;
                    }
                    break;
                case 'activs-stored':
                    {
                    }
                    break;
                case 'skills-stored':
                    {
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        ProfileWizard.prototype.close_wizard = function () {
            this.props.owner['close_wizard']();
        };
        ProfileWizard.prototype.build_wizard = function () {
            var html = React.createElement("div", {id: "new-art-wiz"}, React.createElement("h1", null, "Profile"), React.createElement("section", null, React.createElement(ProfileWizardPage, {owner: this, page_index: 0}, React.createElement("div", {className: "row", style: { minHeight: 300 }}, React.createElement("div", {className: "col-lg-12", style: { paddingLeft: 0, paddingRight: 0 }}, React.createElement("h2", null, "Basic info"), React.createElement("p", {style: { fontSize: '1.2em', fontWeight: 600 }}, "Enter information related to this profile occupation"), React.createElement("hr", null), React.createElement(ProfileBasicInfo, {owner: this}))))), React.createElement("h1", null, "Activities"), React.createElement("section", null, React.createElement(ProfileWizardPage, {owner: this, page_index: 1}, React.createElement(activities_explorer_1.ProfileActivsExplorer, {owner: this}))), React.createElement("h1", null, "Skills"), React.createElement("section", null, React.createElement(ProfileWizardPage, {owner: this, page_index: 2}, React.createElement(skills_explorer_1.ProfSkillsExplorer, {owner: this}))), React.createElement("h1", null, "Save"), React.createElement("section", null, React.createElement(ProfileWizardPage, {owner: this, page_index: 3}, React.createElement(wiz_page_finish_1.ProfileWizFinishPage, {owner: this}))));
            return html;
        };
        ProfileWizard.prototype.init_wizard = function () {
            var _this = this;
            var that = this;
            this.root.find('#new-art-wiz')['steps']({
                headerTag: "h1",
                bodyTag: "section",
                transitionEffect: "fade",
                autoFocus: true,
                onInit: function (event, currentIndex) {
                    _this.active_page = 0;
                },
                onStepChanged: function (event, current, prior) {
                    that.active_page = current;
                },
                onStepChanging: function (event, current, next) {
                    var forward = next > current;
                    if (!forward) {
                        return true;
                    }
                    var ok = _this.get_active_page().validate_page();
                    return ok;
                },
                onFinished: function (event, currentIndex) {
                    _this.broadcast({
                        action: 'add-prof-finished'
                    });
                }
            });
            that.root.find('.steps ul li[role="tab"] a').css({
                'font-size': '2em',
                'font-weight': '500',
                'line-height': '1.1'
            });
            that.root.find('.wizard-content .content').css('background-color', 'white');
        };
        ProfileWizard.prototype.get_active_page = function () {
            var _this = this;
            var page = _.find(this.pages, function (p) {
                return p.props.page_index === _this.active_page;
            });
            return page;
        };
        ProfileWizard.prototype.add_page = function (page) {
            this.pages.push(page);
        };
        return ProfileWizard;
    }(jx.views.ReactiveView));
    exports.ProfileWizard = ProfileWizard;
    var ProfileWizardPage = (function (_super) {
        __extends(ProfileWizardPage, _super);
        function ProfileWizardPage(props) {
            _super.call(this, props);
            this.props.owner.add_page(this);
        }
        Object.defineProperty(ProfileWizardPage.prototype, "is_active_page", {
            get: function () {
                return this.props.page_index === this.props.owner.active_page;
            },
            enumerable: true,
            configurable: true
        });
        ProfileWizardPage.prototype.activate_page = function () {
            this.forceUpdate();
        };
        ProfileWizardPage.prototype.render = function () {
            var html = React.createElement("div", null, this.props.children);
            return html;
        };
        ProfileWizardPage.prototype.validate_page = function () {
            var ok = true;
            var viewid = this.root.find('[data-reactive-view]').attr('data-reactive-view');
            this.get_view(viewid, function (view) {
                if (view['validate_page']) {
                    ok = view['validate_page']();
                }
            });
            return ok;
        };
        return ProfileWizardPage;
    }(jx.views.ReactiveView));
    exports.ProfileWizardPage = ProfileWizardPage;
    var ProfileBasicInfo = (function (_super) {
        __extends(ProfileBasicInfo, _super);
        function ProfileBasicInfo() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(ProfileBasicInfo.prototype, "ds", {
            get: function () {
                if (!this.__ds) {
                    this.__ds = new jx.data.DataSource('prof');
                }
                return this.__ds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileBasicInfo.prototype, "prof", {
            get: function () {
                if (!this.__prof) {
                    this.__prof = this.ds.dm.createEntity('prof', {
                        ID: utils.guid(),
                        COMPID: this.app.currentUser['compid'],
                        PROFCREATEDATE: moment().toISOString(),
                        PROFISPUBLIC: 1,
                        PROFACTIVE: 1,
                        PROFCOUNTRY: 'GR'
                    });
                }
                return this.__prof;
            },
            enumerable: true,
            configurable: true
        });
        ProfileBasicInfo.prototype.render = function () {
            var _this = this;
            var html = React.createElement("div", null, React.createElement("br", null), React.createElement("h3", null, "Profile title"), React.createElement("form", null, React.createElement(b.FormGroup, null, React.createElement(b.FormControl, {name: "proftitle", type: "text", "data-bind": "textInput:PROFTITLE"}))), React.createElement("br", null), React.createElement("hr", {className: "hr-line-dashed"}), React.createElement("h3", null, React.createElement("span", {className: "isco-title"}, "Isco occupation"), React.createElement(rb.Button, {bsStyle: "primary", onClick: this.select_occp.bind(this), className: "btn-outline pull-right btn-occp"}, "select the profile isco occupation")), React.createElement("div", {className: "m-t-sm"}, React.createElement("h3", null, React.createElement("strong", {className: "occp"}))), React.createElement("br", null), React.createElement("hr", {className: "hr-line-dashed"}), React.createElement("br", null), React.createElement("br", null), React.createElement("h3", null, "Profile description"), React.createElement(jx.controls.QuillEditor, {entity: this.prof, property: "PROFDESCRIPTION"}), React.createElement(jx.modal.Modal, {ref: 'modal', title: "Select an isco occupation", bsSize: "lg", onFinish: function () { return _this.store_occp_select(); }}));
            return html;
        };
        ProfileBasicInfo.prototype.select_occp = function (e) {
            e.preventDefault();
            this.refs['modal'].show(React.createElement(profile_occptree_1.OccpTreeView, {owner: this}));
        };
        ProfileBasicInfo.prototype.store_occp_select = function () {
            return this.update_occp();
        };
        ProfileBasicInfo.prototype.on_notify = function () {
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root.find('form').validate({
                            rules: {
                                proftitle: {
                                    required: true
                                }
                            }
                        });
                        ko.applyBindings(this.prof, this.root.find('form')[0]);
                    }
                    break;
                case 'occp-selected':
                    {
                        this.occpinfo = this.current_event.data;
                    }
                    break;
                case 'occp-unselected':
                    {
                        this.occpinfo = null;
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        ProfileBasicInfo.prototype.update_occp = function () {
            var _this = this;
            if (!this.occpinfo) {
                return Q.reject(false);
            }
            var ds = new jx.data.DataSource('occp');
            this.root.find('.occp').empty();
            this.root.find('.occp').append($('<i class="fa fa-spin fa-spinner" ></i>'));
            var that = this;
            return ds.fetch_data({
                where: {
                    'ID': this.occpinfo['occpid']
                }
            }).then(function (data) {
                _this.root.find('.occp').html(_.result(data[0], 'OCCPCONCEPT_EN'));
                that.prof['OCCPID'](that.occpinfo['occpid']);
                _this.broadcast({
                    action: 'occp-stored',
                    data: data[0]
                });
                return Q.resolve(true);
            }).fail(function (err) {
                toastr.error(JSON.stringify(err));
                return Q.reject(false);
            });
        };
        ProfileBasicInfo.prototype.validate_page = function () {
            if (!this.occpinfo) {
                toastr.error('You must select a valid isco occupation');
                return false;
            }
            var ok = this.root.find('form').valid();
            if (ok) {
                this.broadcast({
                    action: 'prof-stored',
                    data: this.prof
                });
            }
            return ok;
        };
        return ProfileBasicInfo;
    }(jx.views.ReactiveView));
    exports.ProfileBasicInfo = ProfileBasicInfo;
    var ProfileActivitiesPage = (function (_super) {
        __extends(ProfileActivitiesPage, _super);
        function ProfileActivitiesPage() {
            _super.apply(this, arguments);
        }
        ProfileActivitiesPage.prototype.build_content = function () {
            return React.createElement(activities_explorer_1.ProfileActivsExplorer, null);
        };
        return ProfileActivitiesPage;
    }(ProfileWizardPage));
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/ins/views/profiles/profiles_new.js.map