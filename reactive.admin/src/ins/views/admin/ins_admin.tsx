/// <reference path="../../../core/jx__.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import { InsMasterPage, ins } from '../../lib/ins_master_page';
import jx = require('../../../core/lib');


enum admin_content { list, edit }

interface InsAdminPageState extends jx.views.ReactiveViewState {    
    content: admin_content
}
export class InsAdminPage extends InsMasterPage {

    state: InsAdminPageState;
    
    constructor(props?: any) {
        super(props);
        this.state = {
            content: admin_content.list
        }
    }

    get_page_content() {

        var html =
            <div className="animated fadeInRight">

                <div>
                    <h1><i className="fa fa-th-large" ></i> Admin</h1>
                </div>

                <br />

                {this.resolve_content()}
                
            </div>

        return html;
    }


    componentWillMount() {

        super.componentWillMount();

        jx.pubsub.subscribe(ins.constants.on_tbl_record_opened, (msg, data) => {


        });
    }


    componentDidUpdate() {
        
    }


    resolve_content() {

        switch (this.state.content) {

            case admin_content.list: return <DataTable owner={this} />

            case admin_content.edit: return null
        }
    }
}



interface DataTableState extends jx.views.ReactiveViewState {
    data: any[],
    rowid?: string    
}
class DataTable extends jx.views.ReactView {

    constructor(props?: any) {
        super(props);
        this.state = {
            loading: true,
            data: []            
        }
    }

    state: DataTableState;

    render() {

        var html =
            <div className="row">

                <div className="col-lg-12">

                    <div className="ibox">

                        <div className="ibox-content">

                            <div className="table-responsive">

                                <table className="table table-hover issue-tracker">
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        return html;
    }


    componentDidMount() {

        super.componentDidMount();

        if (this.state.loading) {

            utils.spin(this.root);

            this.call_net_srv().then((data: any) => {

                this.state.data = data;
                this.state.loading = false;

                this.init_table();

            }).finally(() => {

                utils.unspin(this.root);
            });
        }

    }


    init_table() {

        if (this.state.data.length > 0) {

            var row0 = this.state.data[0];

            var _columns: any[] = [];

            _.each(Object.keys(row0), col => {

                _columns.push({
                    title: col,
                    data: col
                });
            });


            _columns.push({
                title: '',
                data: null,
                createdCell: (cell: Node, cellData: any, rowData: any, row: number, col: number) => {

                    $(cell).empty();

                    var btn =
                        <button className="btn btn-info btn-outline pull-right" onClick={this.open_record.bind(this) }>
                            <i className="fa fa-folder-open-o"></i> open
                        </button>;

                    ReactDOM.render(btn, $(cell)[0]);

                }
            } as DataTables.ColumnSettings);


            this.root.find('table').DataTable({
                data: this.state.data,
                columns: _columns,
                createdRow: (row: Node, data: any[] | Object, dataIndex: number) => {
                    $(row).attr('data-rowid', _.result(data, 'ID'));
                }
            });

        }
    }


    call_net_srv() {

        var d = Q.defer();

        var ds = new jx.data.DataSource('occp');

        ds.fetch_data({
            where: {
                "ID": { startsWith: "A" }
            }
        }).then(data => {


        }).fail(err => {



        });

        

        //var callinfo = {
        //    method: 'fetch_data',
        //    data: 'occp'
        //}

        //var that = this;

        //$.ajax({
        //    url: 'stamp_handler.ashx',
        //    type: 'POST',
        //    data: JSON.stringify(callinfo),
        //    success: function (data) {

        //        var list = JSON.parse(data);

        //        that.store_data(list);

        //        d.resolve(list);
        //    },
        //    error: function (errorText) {

        //        alert(errorText);

        //        d.reject(errorText);
        //    }
        //});

        return d.promise;
    }
    
    open_record(e: Event) {

        var id = $(e.currentTarget).closest('tr').attr('data-rowid');

        jx.pubsub.publish(ins.constants.on_tbl_record_opened, {
            rowid: id
        });
        
    }


    store_data(data:any[]) {

        function save_one_data(index: number, data: any[], d: Q.Deferred<any>) {
            
            var obj = data[index];

            Backendless.Persistence.of(OCCP).save(obj, new Backendless.Async(
                (rst) => {

                    if (index < data.length) {

                        save_one_data(index++, data, d);
                    }

                    d.resolve(true);
                },
                (err) => {

                    toastr.error(JSON.stringify(err));

                    d.reject(false);

                }));

            return d.promise;
        }
        
        var total = data.length;
        var index = 0;

        if (index >= total) {

            return;
        }

        save_one_data(index, data, Q.defer() ).then(() => {

            toastr.success('Data transfered successfully', 'success');

        }).fail(err => {

            toastr.error(JSON.stringify(err));
        })
        
        
    }

}



class OCCP {

    ID: string
    OCCPURI: string
    OCCPTYPE: string
    OCCPISCO: string
    OCCPCONCEPT_EN: string
    OCCPDEFINITION: string
    OCCPPARENTID: string
    OCCPCONCEPT_GR: string
}




