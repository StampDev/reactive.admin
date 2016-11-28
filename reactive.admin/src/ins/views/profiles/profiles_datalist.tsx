// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;


import jx = require('../../../core/lib');



interface ProfileDatalistState extends jx.views.ReactiveViewState{
    emptyMess: any
}
export interface ProfileDatalistProps extends jx.views.ReactiveViewProps{
}
export class ProfileDatalist extends jx.views.ReactiveView {

    props: ProfileDatalistProps;
    state: ProfileDatalistState;

    constructor(props: ProfileDatalistProps) {

        super(props);

        this.state.loading = true;
    }


    private __ds: jx.data.DataSource;
    get ds(): jx.data.DataSource {

        if (!this.__ds) {
            this.__ds = new jx.data.DataSource('prof');
        }

        return this.__ds;
    }

    private datatable: DataTables.DataTable;


    render() {
        
        var html =
            <div className="row" style={{ minHeight: 500 }}>

                <div className="col-lg-12 scroll-table">
                   
                    <table className="table table-striped table-hover">
                    </table>
                    
                    {this.state.emptyMess}

                </div>

            </div>


        return html;
    }



    on_notify() {
        
        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                this.load_profiles();

            } break;

            case 'open-one-profile': {

                this.highlight_selection();

                this.broadcast({
                    action: 'edit-profile',
                    data: this.current_event.data                    
                });

            } break;

            case 'new-profile-added':{

                this.load_profiles()
                    .then(()=>{

                        this.notify({

                            action:'open-one-profile',

                            data : this.current_event.data

                       });

                });

            } break;
                
        }

        return super.on_notify();
        
    }


    highlight_selection() {

        $('.selected-row').removeClass('selected-row');
        
        var rows:any = this.datatable.rows().nodes();

        _.each(rows, row => {

            $(row).removeClass('selected-row');

            $(row).find('.selected-row').removeClass('selected-row');

        });

        var rowid = this.current_event.data;

        this.root.find('[data-rowid="{0}"]'.format(rowid)).addClass('selected-row');
        
    }


    load_profiles() {

        var d = Q.defer();

        utils.spin(this.root);

        this.ds.fetch_data({
            where: {
                'COMPID': { eq: this.app.currentUser['compid'] }
            },
        }).then(() => {

            if (this.ds.dm.getEntities('prof').length === 0) {

                this.updateState<ProfileDatalistState>({
                    emptyMess:<b.Well>No profile found. Add a new profile</b.Well>
                });
                
            } else {

                this.init_datatable();
            }

            d.resolve(true);

        }).fail(err =>{
            
            this.error(err);

        }).finally(() => {

            utils.unspin(this.root);

        });

        return d.promise;
    }
    

    init_datatable() {

        if (this.datatable) {
            this.datatable.destroy();
        }

        var count: number = 1;

        this.datatable = this.root.find('table').DataTable({

            data: this.ds.dm.getEntities('prof'),

            ordering : false,

            columns: [
                {
                    data: null, title: '', width : '5%', createdCell: (cell: Node) => {

                        $(cell).empty();

                        $(cell).append($('<p class="tr-fontsize">{0}.</p>'.format((count++) as any)));
                    }
                },

                {
                    data: 'PROFTITLE', title: 'Profile title', width:'30%', createdCell: (cell: Node, cellData: any) => {

                        $(cell).empty();

                        var a = $('<p class="tr-fontsize"> <a href="#"> {0} </a> </p>'.format(cellData))

                        $(cell).append(a);
                        
                    }
                },

                {
                    data: null, title: 'Occupational scope', createdCell: (cell: Node, cellData: any, rowData: any) => {

                        $(cell).empty();

                        this.load_related_occp($(cell), rowData);

                    }
                },

                {
                    data: null, title: '', width:'15%', createdCell: (cell: Node, cellData: any) => {

                        $(cell).empty();

                        var html =
                            <table>
                                <tbody>
                                    <tr>

                                        <td> <button className="btn-row-action btn btn-primary btn-outline pull-right btn-edit"
                                            onClick={() => { this.open_one_profile(cellData) } }
                                            style= { { marginRight: 10, opacity: 0.2 } } > <i className="fa fa-edit" ></i> </button>
                                        </td>

                                        <td> <button className="btn-row-action btn btn-warning btn-outline pull-right"
                                            style= { { opacity: 0.2 } }>
                                            <i className="fa fa-times"></i> </button>
                                        </td> 
                                    </tr>
                                </tbody>
                            </table>;

                        ReactDOM.render(html, $(cell)[0]);
                        
                }}
            ],

            createdRow: (row: Node, data: any[] | Object, dataIndex: number) => {

                $(row).attr('data-rowid', _.result(data, 'ID'));

                $(row).hover(() => {

                    $(row).find('.btn-row-action').css('opacity', '1');
                    
                }, () => {

                    $(row).find('.btn-row-action').css('opacity', '0.2');

                });
            }
            
        });    
        
        
        this.root.find('table').on('page.dt', () => {

            //$('.scroll-table').scrollTop(0);
            
        });

    }


    open_one_profile(obj: any) {

        this.notify({
            action: 'open-one-profile',
            data: _.result(obj, 'ID')
        });
    }


    load_related_occp(cell: JQuery, obj:any) {

        $(cell).append($('<i class="fa fa-spin fa-spinner"></i>'));
        
        var ds = new jx.data.DataSource('occp');

        ds.fetch_data({
            where: { ID: _.result(obj, 'OCCPID') }
        }).then(() => {

            var occp = _.result(ds.dm.getEntities('occp')[0], 'OCCPCONCEPT_EN');

            $(cell).empty();

            $(cell).append($('<div class="data" style="max-height:80px" ><p class="tr-fontsize"><a href="#"><span class="txt-ellipsis" >{0}</span></a></p></div>'.format(occp)));

            $(cell).find('.data')['dotdotdot']();
            
        }).finally(()=>{

            if ($(cell).find('i').length > 0) {

                $(cell).empty();
            }

        });
    }
}