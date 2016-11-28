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
    var EmpJobExplorer = (function (_super) {
        __extends(EmpJobExplorer, _super);
        function EmpJobExplorer(props) {
            _super.call(this, props);
            this.state.data = this.props.emp['jbr'];
        }
        Object.defineProperty(EmpJobExplorer.prototype, "is_new", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        EmpJobExplorer.prototype.render = function () {
            var data = this.state.data;
            var html = React.createElement(b.Row, null, React.createElement(b.Col, {lg: 12}, React.createElement("h2", null, React.createElement("span", null, "My job positions"), React.createElement(b.Button, {bsStyle: "success", bsSize: "xs", onClick: this.add_new_job.bind(this), className: "btn-outline m-l-md"}, React.createElement("i", {className: "fa fa-plus"}), " add")), React.createElement("hr", null)), React.createElement(b.Col, {lg: 12}, this.fill_with_items()));
            return html;
        };
        EmpJobExplorer.prototype.fill_with_items = function () {
            var key = 1;
            var views = _.map(this.state.data, function (d) {
                var topborder = key === 1 ? 'no-top-border' : '';
                var date_from = _.result(d, 'jobstartdate') ? moment(_.result(d, 'jobstartdate')).format('MMM-YYYY') : '';
                var date_to = _.result(d, 'jobenddate') ? moment(_.result(d, 'jobenddate')).format('MMM-YYYY') : '';
                var duration = moment(_.result(d, 'jobstartdate')).fromNow();
                var dates = "{0}".format(date_from);
                if (date_to) {
                    dates = React.createElement("span", null, " ", React.createElement("span", {className: "m-r-sm"}, date_from), " ", React.createElement("span", {className: "m-r-sm"}, "-"), " ", React.createElement("span", null, date_to), " ");
                    var start = moment(_.result(d, 'jobstartdate'));
                    var end = moment(_.result(d, 'jobenddate'));
                    duration = moment.duration(end.diff(start)).humanize();
                }
                var location = _.result(d, 'jbrlocation');
                if (!location) {
                    location = 'location';
                }
                var company = _.result(d, 'jbrcomp');
                if (company != undefined && company != null) {
                    company = React.createElement("span", null, React.createElement("i", {className: "fa fa-home"}), " ", company);
                }
                var id = _.result(d, 'id');
                var html = React.createElement("div", {className: "timeline-item", key: key++, "data-keyid": id}, React.createElement(b.Row, null, React.createElement(b.Col, {className: "content jbr-content {0}".format(topborder), lg: 12, style: { borderLeft: 'none' }}, React.createElement(b.Row, null, React.createElement(b.Col, {lg: 12, style: { height: 42 }}, React.createElement("h3", null, React.createElement("span", {className: "text-success jbrdescr"}, _.result(d, 'jobdescr')), React.createElement("button", {className: "btn btn-primary btn-outline btn-xs btn-action op-1 m-l-lg m-r-xs"}, React.createElement("i", {className: "fa fa-edit"}), " edit"), React.createElement("button", {className: "btn btn-danger btn-outline btn-xs btn-action op-1 btn-delete"}, React.createElement("i", {className: "fa fa-trash"}), " delete"), React.createElement("p", {className: "m-l-lg", style: { fontWeight: 400, display: 'inline-block' }}, company)))), React.createElement(b.Row, null, React.createElement(b.Col, {className: "m-l-xs", lg: 12}, React.createElement("span", null, dates), React.createElement("span", {className: "m-l-sm"}, "( {0} )".format(duration)))), React.createElement("br", null), React.createElement(b.Row, null, React.createElement(b.Col, {className: "m-l-xs", lg: 12}, React.createElement("i", {className: "fa fa-map-marker m-r-xs"}), " ", location)), React.createElement("br", null), React.createElement("p", null, _.result(d, 'jobnotes')))));
                return html;
            });
            return views;
        };
        EmpJobExplorer.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root.find('.btn-delete').click(function (e) {
                            var id = $(e.currentTarget).closest('.timeline-item').attr('data-keyid');
                            _this.delete_jbr(id);
                        });
                        this.root.find('.jbr-content').hover(function () {
                            $(this).find('.btn-action').toggleClass('op-1');
                        }, function () {
                            $(this).find('.btn-action').toggleClass('op-1');
                        });
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        EmpJobExplorer.prototype.delete_jbr = function (id) {
            var _this = this;
            utils.ask_question('Are you sure you want to delete this item?')
                .then(function (ok) {
                var ds = new jx.data.DataSource('emp');
                ds.dm.importEntities(_this.props.emp.entityAspect.entityManager.exportEntities());
                var obj = _.find(ds.dm.getEntities('jbr'), function (d) {
                    return _.result(d, 'id') === id;
                });
                obj.entityAspect.setDeleted();
                utils.spin(_this.root);
                ds.saveChanges().then(function () {
                    toastr.success('Datat successfully deleted');
                    ds.dm.clear();
                    ds.exec_query({
                        where: {
                            'id': _.result(_this.props.emp, 'id')
                        },
                        expand: ['jbr']
                    }).then(function (list) {
                        var __list = ds.dm.getEntities('jbr');
                        _this.newState({
                            data: __list
                        });
                    });
                }).fail(function (err) {
                    toastr.error(JSON.stringify(err));
                }).finally(function () {
                    utils.unspin(_this.root);
                });
            });
        };
        EmpJobExplorer.prototype.add_new_job = function (e) {
            var _this = this;
            e.preventDefault();
            jx.modal.Show({
                inmodal: true,
                icon: React.createElement("i", {className: "fa fa-user-circle-o modal-icon"}),
                bsSize: 'lg',
                title: 'Add a new job position',
                content: function (modal) {
                    return React.createElement(EmpJobRoleView, {owner: _this, modal: modal, autoinsert: true, emp: _this.props.emp});
                }
            });
            $('.modal-body').addClass('col-lg-12');
        };
        return EmpJobExplorer;
    }(jx.views.ReactiveView));
    exports.EmpJobExplorer = EmpJobExplorer;
    var EmpJobRoleView = (function (_super) {
        __extends(EmpJobRoleView, _super);
        function EmpJobRoleView(props) {
            var _this = this;
            _super.call(this, props);
            this.state.emp = this.props.emp;
            this.props.modal.save = function () {
                _this.save();
            };
        }
        EmpJobRoleView.prototype.componentWillReceiveProps = function (props) {
            _super.prototype.componentWillReceiveProps.call(this, props);
            this.state.emp = props.emp;
        };
        EmpJobRoleView.prototype.get_model = function () {
            return 'jbr';
        };
        EmpJobRoleView.prototype.get_initial_values = function () {
            return {
                compid: this.app.CompId,
                deptid: _.result(this.props.emp, 'deptid'),
                empid: _.result(this.props.emp, 'id')
            };
        };
        EmpJobRoleView.prototype.save = function () {
            var _this = this;
            if (!this.ds.dm.hasChanges()) {
                return;
            }
            utils.spin(this.root);
            this.save_data().then(function () {
                toastr.success('Data saved successfully');
                _this.props.modal.close();
            }).fail(function (err) {
                toastr.error(JSON.stringify(err));
            }).finally(function () {
                utils.unspin(_this.root);
            });
        };
        EmpJobRoleView.prototype.load_data = function (qry) {
            //this.ds.dm.clear();
            //this.ds.dm.importEntities(this.props.emp.entityAspect.entityManager.exportEntities());
            return Q.resolve(this.ds.dm.getEntities('jbr'));
        };
        EmpJobRoleView.prototype.render = function () {
            var default_jobstart = this.item ? _.result(this.item, 'jobstartdate') : '';
            var default_jobend = this.item ? _.result(this.item, 'jobenddate') : '';
            var html = React.createElement(b.Row, null, React.createElement(b.Form, null, React.createElement(b.Col, {lg: 12}, React.createElement(jx.controls.TextIcon, {label: 'Job role description', icon: 'fa-pencil-square-o', placeholder: 'Job description', property: 'jobdescr'})), React.createElement("div", null, React.createElement(b.Col, {lg: 6}, React.createElement(jx.controls.TextIcon, {label: 'Company', icon: 'fa-bank', placeholder: 'Company', property: 'jbrcomp'})), React.createElement(b.Col, {lg: 6}, React.createElement(jx.controls.TextIcon, {label: 'Location', icon: 'fa-map-marker', placeholder: 'Location', property: 'jbrlocation'}))), React.createElement(b.Col, {lg: 6}, React.createElement("h2", null, "Job start"), React.createElement("div", {className: "form-group date-ctrl", "data-prop": "jobstartdate"}, React.createElement("div", {className: "input-group date"}, React.createElement("span", {className: "input-group-addon"}, React.createElement("i", {className: "fa fa-calendar"})), React.createElement("input", {type: "text", className: "form-control", defaultValue: default_jobstart})))), React.createElement(b.Col, {lg: 6}, React.createElement("h2", null, React.createElement("span", null, "Job end"), " ", React.createElement("span", {className: "text-success"}, "(optional) ")), React.createElement("div", {className: "form-group date-ctrl", "data-prop": "jobenddate"}, React.createElement("div", {className: "input-group date"}, React.createElement("span", {className: "input-group-addon"}, React.createElement("i", {className: "fa fa-calendar"})), React.createElement("input", {type: "text", className: "form-control", defaultValue: default_jobend})))), React.createElement(b.Col, {lg: 12}, React.createElement("h2", null, "Comments"), React.createElement(jx.controls.QuillEditor, null))));
            return html;
        };
        EmpJobRoleView.prototype.on_notify = function () {
            var _this = this;
            switch (this.current_event.action) {
                case jx.constants.events.view_initialized:
                    {
                        this.root.find('.date-ctrl .input-group.date')['datepicker']({
                            format: "mm-yyyy",
                            startView: "months",
                            minViewMode: "months",
                            autoclose: true
                        }).on('changeDate', function (ev) {
                            var property = $(ev.currentTarget).closest('[data-prop]').attr('data-prop');
                            _this.item[property](ev.date);
                        });
                    }
                    break;
                case jx.constants.events.view_data_loaded:
                    {
                        ko.applyBindings(this.item, this.root.find('form')[0]);
                    }
                    break;
            }
            return _super.prototype.on_notify.call(this);
        };
        return EmpJobRoleView;
    }(jx.views.ReactiveEditDataView));
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/views/comp/emp_job_roles.js.map