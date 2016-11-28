/// <reference path="depts_utils.tsx" />
/// <reference path="emp_list.tsx" />
/// <reference path="new_emp.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;
import { InsMasterPage, ins } from '../../lib/ins_master_page';
import dept = require('./depts_utils');
import list = require('./emp_list');

import { NewEmployeeView, NewEmployeeViewProps} from './new_emp';



export class EmpExplorer extends InsMasterPage {

    get_page_content() {
        return <Explorer />
    }
}



interface ExplorerState extends jx.views.ReactiveViewState {
    dept_filter: list.EmpListFilter,
    deptid: string
}
class Explorer extends jx.views.ReactiveView {

    constructor(props?: any) {
        super(props);
        this.state.loading = true;
        this.state.dept_filter = list.EmpListFilter.active;
    }


    state: ExplorerState;
    
    //deptid: string;

    render() {

        if (this.state.loading) {
            return <jx.views.LoaderView />
        }
        
        var html =
            <div className="animated fadeInRight" >

                <div className="ibox">

                    <div className="ibox-content col-lg-12" style={{ minHeight: 700 }}>
                        
                        <b.Col lg={12}>
                            <dept.CompDeptBreadCrumView owner={this} start_by_loading={true} id={this.state.deptid} />
                        </b.Col>

                        <hr className="hr-line-dashed" />

                        <b.Col lg={3}>

                            <dept.DeptHierarchyView owner={this} start_by_loading={true} id={this.state.deptid} />
                                                        
                        </b.Col>

                        <b.Col lg={9}>

                            <b.Row>

                                <b.Col lg={3}>
                                    <h1>
                                        <i className="fa fa-user m-r-md" ></i>
                                        <span>Employees</span>
                                    </h1>  
                                </b.Col>

                                <b.Col lg={9}>

                                    <EmplistActions owner={this} />

                                </b.Col>

                            </b.Row>
                            
                            <hr />

                            <list.EmpList owner={this} deptid={this.state.deptid} dept_filter={this.state.dept_filter} />

                        </b.Col>
                   
                    </div>
                    
                </div>

            </div>;

        return html;
        
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                this.broadcast({
                    action: 'update-page-title',
                    data: <h1>
                        <i className="fa fa-user m-r-md" ></i>
                        <span>Employees</span>
                          </h1>  
                });

                if (this.state.loading) {

                    this.load();
                }

            } break;


            case 'reload': {

                this.setState({
                    loading: true
                }, () => {

                    this.load();
                });

            } break;


            case 'Invite-user': {
                this.invite_user();
            } break;


            case 'on-emplist-filtered': {
                
                this.newState({
                    dept_filter: this.current_event.data
                });

            } break;
        }

        return super.on_notify();
    }


    load() {

        var url_ctx = jx.local.get(jx.constants.router.current_route);

        var id = url_ctx.params['deptid'];

        if (!id) {

            if (!this.state.deptid) {

                this.state.loading = true;

                Backendless.Persistence.of('compdept').find({
                    condition: 'deptparentid is null'
                }, new Backendless.Async(rst => {

                    if (rst['data'].length) {

                        this.state.deptid = _.result(rst['data'][0], utils.key);

                        this.setState({
                            loading: false
                        });
                    }

                }, err => {

                    toastr.error(JSON.stringify(err));

                }));
                
            } else {

                this.setState({
                    loading: false
                });
            }

        } else {

            this.state.deptid = id;

            this.setState({
                loading: false
            });
        }        
    }
    

    invite_user() {
        
        jx.modal.Show({
            inmodal: true,
            icon: <i className="fa fa-user-plus modal-icon" ></i>,
            title: 'Invite new user',
            content: (modal: jx.modal.Modal) => {
                return <NewEmployeeView owner={this} modal={modal} deptid={this.state.deptid} />
            }
        });

        $('.modal-body').addClass('col-lg-12');
    }
}




interface EmplistActionsState extends jx.views.ReactiveViewState {
    filter: list.EmpListFilter
}
interface EmplistActionsProps extends jx.views.ReactiveViewProps {
}
class EmplistActions extends jx.views.ReactiveView {

    props: EmplistActionsProps;
    state: EmplistActionsState;
    filters: Array<{ filter: list.EmpListFilter, descr: string }>;

    constructor(props: EmplistActionsProps) {
        super(props);
        this.state.filter = list.EmpListFilter.active;
        this.filters = [
            { filter: list.EmpListFilter.all, descr: 'All users' },
            { filter: list.EmpListFilter.active, descr: 'Active employees' },
            { filter: list.EmpListFilter.pending, descr: 'Pending invitations' }

        ]
    }

    render() {

        var filter = _.find(this.filters, f => {
            return f.filter === this.state.filter;
        });


        var html =
            <div>
                <button className="btn btn-success btn-lg pull-right">
                    <i className="fa fa-plus-square m-r-sm"></i> <span>Add new department</span>
                </button>

                <button className="btn btn-primary btn-lg pull-right m-r-lg"
                    onClick={this.invite_user.bind(this) } >
                    <i className="fa fa-user-plus m-r-sm"></i> <span>Invite new user</span>
                </button>
                
                <div className="pull-right m-r-lg">

                    <div className="btn-group xbtn">

                        <button type="button" className="btn btn-default btn-lg">
                            <span className="m-r-xs">Filter: </span>
                            <span>{filter.descr}</span>
                        </button>

                        <button type="button" className="btn btn-default  btn-lg dropdown-toggle" data-toggle="dropdown">
                            <span className="caret" />
                            <span className="sr-only">Toggle Dropdown</span>
                        </button>

                        <ul className="dropdown-menu" role="menu">
                            <li><a style={{ fontSize:14 }} href="#" data-filter={list.EmpListFilter.active}>Active employees</a></li>
                            <li><a style={{ fontSize:14 }} href="#" data-filter={list.EmpListFilter.pending}>Pending invitations</a></li>
                            <li><a style={{ fontSize:14 }} href="#" data-filter={list.EmpListFilter.all}>All users</a></li>
                        </ul>
                    </div>


                </div>
                
            </div>;

        return html;
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {
                
                this.root.find('.btn-group a').on('click', (e: Event) => {

                    e.preventDefault();

                    var __filter = parseInt( $(e.currentTarget).attr('data-filter') );

                    this.newState({
                        filter: __filter
                    }, () => {

                        this.props.owner.notify({
                            action: 'on-emplist-filtered',
                            data: __filter
                        });

                    });
                    
                });
                
            } break;

            

        }
        
        return super.on_notify();
    }
    

    invite_user() {

        this.props.owner.notify({
            action:'Invite-user'
        });
    }
}