// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;


export enum EmpListFilter { pending, active, all }



interface EmpListState extends jx.views.ReactiveViewState {
    filter: EmpListFilter
}
export interface EmpListProps extends jx.views.ReactiveViewProps {
    deptid: string,
    dept_filter?: EmpListFilter
}
export class EmpList extends jx.views.ReactiveView {

    props: EmpListProps;
    state: EmpListState;


    constructor(props: EmpListProps) {
        super(props);
        this.state.filter = this.props.dept_filter;
    }

    render() {

        var html =
            <div>
                <EmpDatalist owner={this}
                    allow_edit_row={true}
                    allow_delete_row={true}
                    row_count={true} dept_filter={this.state.filter}
                    deptid={this.props.deptid} />
            </div>


        return html;
    }


    componentWillReceiveProps(next: EmpListProps) {

        this.state.filter = next.dept_filter;

        super.componentWillReceiveProps(next);
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.forms.actions.EDIT_ROW: {

                var id = this.current_event.data;

                this.app.router.navigate('/company/employees/employee/{0}'.format(id));

            } break;
        }

        return super.on_notify();
    }
}



interface EmpDatalistState extends jx.forms.ui.DataListState {
    dept_filter: EmpListFilter,
    reload: boolean,
    users: any[]
}
interface EmpDatalistProps extends jx.forms.ui.DataListProps {
    deptid: string,
    dept_filter?: EmpListFilter,    
}
class EmpDatalist extends jx.forms.ui.DataList {

    props: EmpDatalistProps;
    state: EmpDatalistState;


    constructor(props: EmpDatalistProps) {
        super(props);
        this.props.owner['__datalist'] = this;
        this.state.dept_filter = this.props.dept_filter;
    }


    get_model(): string {
        return 'emp_usr_view';
    }


    render() {

        if (this.state.loading) {
            return super.render();
        }

        var content = null;

        if (this.state.data.length > 0) {

            content = super.render();

        } else {

            content =
                <div className="alert alert-info">
                    <h3 className="m-l-xs">No employee has been added to this department yet</h3>
                    <p>Invite your employees to join Stamp</p>
                </div>;
        }
        

        var html =
            <div className="m-b-lg">
                {content}
            </div>;

        return html;
    }


    get tbl_settings(): DataTables.Settings {

        var setts: DataTables.Settings = {
            columns: [
                {
                    title: '', data: 'objectId', width: '30%'
                },
                {
                    title: '', data: 'empemail', width: '20%'
                }
            ]
        }

        return setts;
    }


    createdCell(cell: Node, cellData: any, rowData: any, row: number, col: number) {

        if (col === 1) {

            var usr = _.find(this.state.users, u => _.result(u, utils.key) === _.result(rowData, 'usrid'));

            var html = <EmpRowView emp={rowData} usr={usr} owner={this} />;

            ReactDOM.render(html, $(cell)[0]);
        }

        if (col == 2) {

            var usr = _.find(this.state.users, u => _.result(u, utils.key) === _.result(rowData, 'usrid'));

            var html = <RowDeptInfo owner={this} emp={rowData} usr={usr} start_by_loading={true} />;

            ReactDOM.render(html, $(cell)[0]);

        }

    }


    createdRow(row: Node, data: any[] | Object, dataIndex: number) {

        super.createdRow(row, data, dataIndex);

        $(row).attr('data-rowid', _.result(data, utils.key));

        $(row).css('height', '80px');

    }


    load_data(): Q.Promise<any> {

        var d = Q.defer();

        bx.fetch('emp', {
            condition: "compid='{0}' and deptid='{1}'".format(this.app.CompId, this.props.deptid)
        }).then(data => {

            var usr_ids = _.map(data, d => {
                return "'{0}'".format(d['usrid']);
            }).join();

            bx.fetch(Backendless.User, {
                condition: "objectId in ({0})".format(usr_ids)
            }).then(usr_list => {

                this.state.users = usr_list

                d.resolve(data);

            });

        });
        
        return d.promise;
    }


    on_notify() {
        return super.on_notify();
    }


    componentWillReceiveProps(next: EmpListProps) {

        this.state.reload = this.state.dept_filter != next.dept_filter;

        this.state.dept_filter = next.dept_filter;

        super.componentWillReceiveProps(next);
    }


    componentDidUpdate() {

        super.componentDidUpdate();

        if (this.state.reload) {

            this.state.reload = false;

            this.local_load_data().then(() => {
                this.state.reload = false;
            });
        }
    }


    local_load_data() {

        return super.local_load_data().then(() => {

            this.root['slimScroll']({
                height: 'auto',
            });

            return true;

        });

    }

}



interface EmpRowViewProps extends jx.views.ReactiveViewProps {
    emp: breeze.Entity,
    usr: any;
}
interface EmpRowViewState extends jx.views.ReactiveViewState {
    usr: any;
}
class EmpRowView extends jx.views.ReactiveView {

    props: EmpRowViewProps;
    state: EmpRowViewState;

    constructor(props: EmpRowViewProps) {
        super(props);
        this.state.loading = true;
        this.state.usr = props.usr;
    }


    render() {
                
        var usr = this.state.usr;
        

        var usrstatus = 'Status: pending';


        switch (_.result(usr, 'usrstatus')) {

            case 0:
                break;

            case 1:
                usrstatus = 'Status: active';
                break;
        }

        var url = '/company/employees/employee/{0}'.format(_.result(this.props.emp, 'objectId'));

        var html =
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <span className="glyphicon glyphicon-user m-r-md" style={{ fontSize: '3em' }}></span>
                            </td>

                            <td>
                                <h3>
                                    <a href={url}>
                                        <span className="m-r-sm" >{_.result(usr, 'name') }</span>
                                        <span>{_.result(usr, 'surname') }</span>
                                    </a>
                                    <div>
                                        <small>{usrstatus}</small>
                                    </div>
                                </h3>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>

        return html;
    }


    on_notify() {

        //switch (this.current_event.action) {

        //    case jx.constants.events.view_initialized: {

        //        if (this.state.loading) {

        //            bx.fetch(Backendless.User, {
        //                condition: "objectId='{0}'".format(_.result(this.props.emp, 'usrid'))
        //            }).then(data => {

        //                this.setState({
        //                    loading: false,
        //                    usr: data[0]
        //                });
                        
        //            });
                    
        //        }

        //    } break;
        //}

        return super.on_notify();
    }
}


interface RowDeptInfoState extends jx.views.ReactiveViewState {
    dept: breeze.Entity,
    usr: any
}
interface RowDeptInfoProps extends jx.views.ReactiveViewProps {
    emp: breeze.Entity,
    usr: any
}
class RowDeptInfo extends jx.views.ReactiveView {

    props: RowDeptInfoProps;
    state: RowDeptInfoState;

    constructor(props: RowDeptInfoProps) {
        super(props);        
        this.state.usr = props.usr;
    }

    render() {

        if (this.state.loading) {
            return <i className="fa fa-spin fa-spinner"></i>
        }

        var html =
            <div>
                <div>
                    <span>email: </span>
                    <h4 className="inline text-success"><a href="#">{_.result(this.props.emp, 'empemail') }</a></h4>
                </div>
                <div>
                    <span>department: </span>
                    <span className="text-success" style={{ fontWeight: 400 }} >
                        {_.result(this.state.dept, 'deptname') }
                    </span>
                </div>
            </div>;


        return html;

    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                if (this.state.loading) {

                    bx.fetchKey('compdept', _.result(this.props.emp, 'deptid'))
                        .then(__dept => {

                            this.newState({
                                loading: false,
                                dept: __dept
                            }); 
                    })
                    
                }


            } break;

        }


        return super.on_notify();
    }

}