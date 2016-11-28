// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../../../core/lib', 'react-bootstrap'], function (require, exports, React, ReactDOM, jx, rb) {
    "use strict";
    var b = rb;
    var ProfileWizFinishPage = (function (_super) {
        __extends(ProfileWizFinishPage, _super);
        function ProfileWizFinishPage(props) {
            _super.call(this, props);
        }
        ProfileWizFinishPage.prototype.render = function () {
            var html = React.createElement("div", {className: "row", style: { minHeight: 300 }}, React.createElement("div", {className: "col-lg-12", style: { paddingLeft: 0, paddingRight: 0 }}, React.createElement("h1", null, "Confirm and save"), React.createElement("hr", null), React.createElement("h3", null, "Review the following information and press ", React.createElement("span", {className: "text-primary"}, "finish"), " to create a new professional profile"), React.createElement("br", null), React.createElement(b.Panel, {header: React.createElement("h2", {style: { fontSize: 18 }}, "Basic information")}, React.createElement("p", {className: "proftitle tr-fontsize"}), React.createElement("p", {className: "occp text-info tr-fontsize"}), React.createElement("p", {className: "profdescription tr-fontsize"})), React.createElement("br", null), React.createElement(b.Panel, {header: React.createElement("h2", {style: { fontSize: 18 }}, "Activities")}, React.createElement("br", null), React.createElement("div", {className: "activs"})), React.createElement("br", null), React.createElement(b.Panel, {header: React.createElement("h2", {style: { fontSize: 18 }}, "Skills")}, React.createElement("br", null), React.createElement("div", {className: "skills"}))));
            return html;
        };
        ProfileWizFinishPage.prototype.save_data = function () {
            var _this = this;
            var d = Q.defer();
            utils.spin(this.root);
            var src_obj = this.prof;
            var src_em = src_obj.entityAspect.entityManager;
            var dst_em = src_em.createEmptyCopy();
            dst_em.importEntities(src_em.exportEntities());
            _.each(this.activs_ids, function (id) {
                var obj = dst_em.createEntity('proa', {
                    ID: utils.guid(),
                    PROFID: src_obj['ID'](),
                    OCCPID: src_obj['OCCPID'](),
                    ACTSID: id
                });
                dst_em.addEntity(obj);
            });
            _.each(this.skills_ids, function (id) {
                var obj = dst_em.createEntity('pros', {
                    ID: utils.guid(),
                    PROFID: src_obj['ID'](),
                    OCCPID: src_obj['OCCPID'](),
                    SKLSID: id
                });
                dst_em.addEntity(obj);
            });
            var ds = new jx.data.DataSource('prof');
            ds.saveChangesEx(dst_em.exportEntities())
                .then(function () {
                toastr.success('Data saved successfully');
                d.resolve(true);
            })
                .fail(function (err) {
                toastr.error(JSON.stringify(err));
                d.reject(err);
            })
                .finally(function () {
                utils.unspin(_this.root);
            });
            return d.promise;
        };
        ProfileWizFinishPage.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case 'add-prof-finished':
                    {
                        this.save_data().then(function () {
                            _this.broadcast({
                                action: 'new-profile-added',
                                data: _.result(_this.prof, 'ID')
                            });
                        });
                    }
                    break;
                case 'prof-stored':
                    {
                        this.root.find('.proftitle').html(_.result(this.current_event.data, 'PROFTITLE'));
                        this.root.find('.profdescription').html(_.result(this.current_event.data, 'PROFDESCRIPTION'));
                        var ds = new jx.data.DataSource('occp');
                        this.prof = this.current_event.data;
                        ds.exec_query({
                            where: {
                                ID: { eq: _.result(this.current_event.data, 'OCCPID') }
                            }
                        }).then(function (data) {
                            _this.root.find('.occp').html(_.result(data[0], 'OCCPCONCEPT_EN'));
                        });
                    }
                    break;
                case 'activs-stored':
                    {
                        var ds1 = new jx.data.DataSource('acts');
                        this.activs_ids = this.current_event.data;
                        ds1.exec_query({
                            where: {
                                ID: { in: this.current_event.data }
                            }
                        }).then(function (_data) {
                            _this.root.find('.activs').empty();
                            var html = React.createElement(ListGroup, {data: _data, descr: 'ACTSDESCR_EN'});
                            ReactDOM.render(html, _this.root.find('.activs')[0]);
                        });
                    }
                    break;
                case 'skills-stored':
                    {
                        var ds2 = new jx.data.DataSource('skls');
                        this.skills_ids = this.current_event.data;
                        ds2.exec_query({
                            where: {
                                ID: { in: this.current_event.data }
                            }
                        }).then(function (_data) {
                            _this.root.find('.skills').empty();
                            var html = React.createElement(ListGroup, {data: _data, descr: 'SKLSCONCEPT'});
                            ReactDOM.render(html, _this.root.find('.skills')[0]);
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return ProfileWizFinishPage;
    }(jx.views.ReactiveView));
    exports.ProfileWizFinishPage = ProfileWizFinishPage;
    var ListGroup = (function (_super) {
        __extends(ListGroup, _super);
        function ListGroup() {
            _super.apply(this, arguments);
        }
        ListGroup.prototype.render = function () {
            var _this = this;
            var html = React.createElement("div", null, React.createElement(rb.ListGroup, null, _.map(this.props.data, function (d) {
                var item = React.createElement(b.ListGroupItem, {href: "#", className: "tr-fontsize p-md"}, _.result(d, _this.props.descr));
                return item;
            })));
            return html;
        };
        return ListGroup;
    }(jx.views.ReactiveView));
});
/*
<ListGroup>
    <ListGroupItem href="#link1">Link 1</ListGroupItem>
    <ListGroupItem href="#link2">Link 2</ListGroupItem>
    <ListGroupItem onClick={alertClicked}>
      Trigger an alert
    </ListGroupItem>
  </ListGroup>
*/ 
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/profiles/wiz_page_finish.js.map