/// <reference path="comp_deptview.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;
import { InsMasterPage, ins } from '../../lib/ins_master_page';
import { CompDeptView, CompDeptViewProps } from './comp_deptview';



export class CompChart extends InsMasterPage {

    get_page_content() {
        return <InternalChartView />
    }
}


interface ChartItem {
    title: any,
    children?: ChartItem[]
}

class InternalChartView extends jx.views.ReactiveView {

    constructor(props?: any) {
        super(props);
        this.data = [];
        this.count = 1;
        this.state.loading = true;
    }

    count: number;


    private __ds: jx.data.DataSource;
    get ds(): jx.data.DataSource {

        if (!this.__ds) {
            this.__ds = new jx.data.DataSource('compdept');
        }

        return this.__ds;
    }


    data: any[];


    render() {

        if (this.state.loading) {
            return <jx.views.LoaderView owner={this} />
        }


        var html =
            <div className="row animated fadeInRight">

                <div className="col-lg-12">

                    <div className="row" style={{ overflowX: 'scroll', minHeight: 750 }}>

                        <b.Button bsStyle="success" style={{ marginLeft: 30 }} >
                            <i className="fa fa-user-plus m-r-sm"></i> <span>Invite users</span>
                        </b.Button>


                        <b.Button bsStyle="primary" style={{ marginLeft: 30 }}
                            onClick={this.add_department.bind(this) }>
                            <i className="fa fa-plus-square m-r-sm"></i> <span>Add department</span>
                        </b.Button>


                        <div className="chart-view">
                        </div>

                    </div>

                </div>

                <div className="col-lg-2 pull-right hidden">

                    <div className="ibox-content b-r-md" >

                        <div className="list-group">

                            <a href="##" className="list-group-item list-group-item-action">
                                <i className="fa fa-plus m-r-sm"></i> <span>Invite users</span>
                            </a>
                            <a href="##" className="list-group-item list-group-item-action"
                                onClick={this.add_department.bind(this) }>
                                <i className="fa fa-plus-square m-r-sm"></i> <span>Add department</span>
                            </a>

                        </div>

                    </div>
                </div>

                <jx.modal.Modal ref='modal'
                    inmodal={true}
                    icon={<i className="fa fa-cube modal-icon"></i>}
                    title="Add department"/>

            </div>;


        return html;

    }


    init_chart() {

        var orgChart = this.root.find('.chart-view')['orgChart']({
            data: this.data
        });


        _.each(this.root.find('.chart-view .node'), (node: any) => {

            var _nodeid: any = $(node).attr('node-id');

            var obj = _.find(this.data, d => d.id === parseInt(_nodeid));

            var view = <ChartItem owner={this} item={obj} />;

            ReactDOM.render(view, $(node)[0]);

        });
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                this.load_depts().then(() => {

                    this.newState({
                        loading: false
                    }, () => {

                        this.init_chart();
                    });

                });

            } break;


            case 'add-department': {

                var parentid = null;
                var outline = null;

                if (this.current_event.data && this.current_event.data['parentid']) {
                    parentid = this.current_event.data['parentid'];
                    outline = this.current_event.data['outline'];
                }

                (this.refs['modal'] as jx.modal.Modal).show(<CompDeptView
                    modal={this.refs['modal'] as any}
                    parentid={parentid}
                    outline={outline}
                    owner={this as any} />);

            } break;


            case 'edit-department': {

                (this.refs['modal'] as jx.modal.Modal).show(<CompDeptView
                    modal={this.refs['modal'] as any}
                    id={this.current_event.data['id']}
                    owner={this as any} />, "Edit department");


            } break;


            case 'post-department-finished': {

                this.newState({
                    loading: true
                }, () => {

                    this.notify({
                        action: jx.constants.events.view_initialized
                    });
                })

            } break;


            case 'delete-department': {

                utils.ask_question('Are you sure you want to delete this department',
                    'This will move all the underlying subdeopartments and employees').then(ok => {

                        if (ok) {

                            var id = this.current_event.data['id'];

                            var obj = _.find(this.ds.dm.getEntities('compdept'), d => {
                                return _.result(d, 'id') === id;
                            });

                            obj.entityAspect.setDeleted();

                            utils.spin(this.root);

                            this.ds.saveChanges()
                                .then(() => {

                                    toastr.success('Data saved successfully');

                                    this.broadcast({
                                        action: 'post-department-finished'
                                    });

                                })
                                .fail(err => {

                                    toastr.error(JSON.stringify(err));
                                })
                                .finally(() => {

                                    utils.unspin(this.root);
                                });

                        }

                    });

            } break;

        }

        return super.on_notify();
    }


    load_depts() {

        var d = Q.defer();

        Backendless.Persistence.of('compdept').find({
            condition: "compid='{0}'".format(this.app.CompId)
        }, new Backendless.Async((list: any) => {

            var nodes = list.data;

            var root: any = _.find(nodes, d => !_.result(d, 'deptparentid'));

            if (nodes.length === 0) {

                this.data = [];

            } else {

                this.data = this.init_node(root, nodes, 0);
            }

            d.resolve(true);

        }, err => {

            d.reject(false);

        }));
        
        return d.promise;
    }


    init_node(obj, data: breeze.Entity[], parentid: number) {

        var nodes: any[] = [
            {
                id: this.count++,
                compdeptid: _.result(obj, utils.key),
                compdeptparentid: _.result(obj, 'deptparentid'),
                name: _.result(obj, 'deptname'),
                parent: parentid
            }
        ];

        var children = _.filter(data, d => {
            return _.result(d,'deptparentid') === _.result(obj, utils.key);
        });

        _.each(children, chd => {

            var children_nodes = this.init_node(chd, data, nodes[0].id);

            nodes = nodes.concat(children_nodes);

        });

        return nodes;

    }


    add_department(e: Event) {

        e.preventDefault();
        e.stopPropagation();

        this.notify({
            action: 'add-department'
        });
    }
}



interface ChartItemProps extends jx.views.ReactiveViewProps {
    item: any
}
class ChartItem extends jx.views.ReactiveView {

    props: ChartItemProps;


    render() {

        var hide_delete = !_.result(this.props.item, 'compdeptparentid') ? 'hidden' : '';

        var dept_href = '/company/employees/depts/{0}'.format(_.result(this.props.item, 'compdeptid'));

        // !sos: compdeptid to avoid conflict with reserved jquery.orgchart "id" property
        var html =
            <b.Row data-id={ _.result(this.props.item, 'compdeptid') } data-outline={_.result(this.props.item, 'deptoutline') }
                style = { { paddingLeft: 10, paddingRight: 10 } } >

                <b.Col lg={12} className="border-bottom" style={{ paddingBottom: 10 }} >

                    <table width='100%'>

                        <tbody>

                            <tr>

                                <td>

                                    <h2 className="text-info">
                                        <a href={dept_href}>
                                            {this.props.item.name}
                                        </a>
                                    </h2>

                                </td>

                                <td width='35%'>

                                    <a href="#" className={"text-danger m-l-sm pull-right chart-action chart-action-idle {0}".format(hide_delete) }
                                        onClick={this.delete_department.bind(this) }>
                                        <i className="fa fa-trash"></i>
                                    </a>

                                    <a href="#" className="text-info m-l-sm pull-right chart-action chart-action-idle"
                                        onClick={this.edit_department.bind(this) }>
                                        <i className="fa fa-edit"></i>
                                    </a>

                                    <a href="##" className="text-success pull-right chart-action chart-action-idle"
                                        onClick={this.add_department.bind(this) }>
                                        <i className="fa fa-plus"></i>
                                    </a>

                                </td>

                            </tr>

                        </tbody>

                    </table>


                </b.Col>

                <b.Col lg={12}>

                </b.Col>

            </b.Row>;


        return html;
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                this.init_node();

            } break;
        }

        return super.on_notify();
    }


    init_node() {

        this.root.hover(() => {

            this.root.find('.chart-action').removeClass('chart-action-idle');

        }, () => {

            this.root.find('.chart-action').addClass('chart-action-idle');

        });
    }


    add_department(e: Event) {

        e.preventDefault();
        e.stopPropagation();

        var parentid = $(e.currentTarget).closest('[data-id]').attr('data-id');
        var outline = $(e.currentTarget).closest('[data-outline]').attr('data-outline');

        this.broadcast({
            action: 'add-department',
            data: {
                parentid: parentid,
                outline: outline
            }
        });
    }


    edit_department(e: Event) {

        e.preventDefault();
        e.stopPropagation();

        var id = $(e.currentTarget).closest('[data-id]').attr('data-id');

        this.broadcast({
            action: 'edit-department',
            data: {
                id: id
            }
        });
    }


    delete_department(e: Event) {

        e.preventDefault();
        e.stopPropagation();

        var id = $(e.currentTarget).closest('[data-id]').attr('data-id');

        this.broadcast({
            action: 'delete-department',
            data: {
                id: id
            }
        });

    }

}


