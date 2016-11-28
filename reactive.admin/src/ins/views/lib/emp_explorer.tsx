
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;
import { OccpTreeView } from '../profiles/profile_occptree';





export interface EmpExplorerProps extends jx.views.ReactiveViewProps {
    emp: breeze.Entity
}
export class EmpExplorer extends jx.views.ReactiveView {
    
    props: EmpExplorerProps;
    
    get usr(): breeze.Entity{
        return (this.refs['listing'] as DataListing).usr;
    }

    get listing(): DataListing {
        return (this.refs['listing'] as DataListing);
    }


    render() {

        var html =
            <b.Row>
                <b.Col lg={12}>
                    <h2>
                        {this.get_title()}
                        <b.Button bsStyle="success" bsSize="xs"
                            className="btn-outline m-l-md"
                            onClick={this.add_new_item.bind(this) }>
                            <i className="fa fa-plus"></i> add
                        </b.Button>
                    </h2>
                    
                    <hr />

                    <DataListing
                        ref='listing'
                        owner={this}
                        allow_delete_row={true}
                        row_count={true}
                        apply_scrollheight={false}                    
                        detail_field={this.get_detail_field() }
                        detail_table={this.get_detail_table() }
                        lookup_table={this.get_lookup_table() }
                        lookup_field={this.get_lookup_field() }
                        emp={this.props.emp} />

                </b.Col>
            </b.Row>        
        return html;
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.forms.actions.DELETE_ROW: {

                utils.can_delete().then(() => {

                    this.delete_item(this.current_event.data)
                        .then(() => {

                            this.listing.reload();

                        });

                });

            } break;
        }

        return super.on_notify();
    }


    delete_item(id: string) {

        var d = Q.defer();

        utils.spin(this.root);
        
        var obj: breeze.Entity = _.find(this.usr[this.get_detail_table()](), d => {
            return _.result(d, this.get_detail_field()) === id;
        }) as any;

        if (obj) {
            obj.entityAspect.setDeleted();
        }

        var ds = new jx.data.DataSource('usr');

        ds.dm.importEntities(this.usr.entityAspect.entityManager.exportEntities());

        ds.saveChanges().then(() => {

            toastr.success('Data saved successfully');

            d.resolve(true);

        }).fail(err => {

            toastr.error(JSON.stringify(err));

            d.reject(false);

        }).finally(() => {

            utils.unspin(this.root);

        });

        return d.promise;
    }


    add_new_item() {

        jx.modal.Show({
            bsSize: 'lg',
            title: this.get_select_title(),
            content: (modal: jx.modal.Modal) => {

                var exclusion = this.usr[this.get_detail_table()]();

                return <Datalist_Find owner={this}
                    modal={modal} ref='dt_find'
                    scroll_height={680}
                    usr={this.usr}                
                    lookup_table={this.get_lookup_table() }
                    lookup_field={this.get_lookup_field() }
                    exec_paging={this.get_exec_paging}
                    row_count={true} />
            }
        });
    }
        
    get_title(): string {
        return null;
    }

    get_select_title() {
        return null
    }

    get_detail_field(): string {
        return null;
    }

    get_detail_table() {
        return null;
    }

    get_lookup_table() {
        return null;
    }

    get_lookup_field() {
        return null;
    }

    get_exec_paging(dt: Datalist_Find, req, draw, setts) {
        return null;
    }

    store_selection(ids: any[]) {

        var d = Q.defer();

        var ds = new jx.data.DataSource('usr');

        utils.spin(this.root);

        ds.exec_query({
            where: {
                id: _.result(this.props.emp, 'usrid')
            },
            expand: [this.get_detail_table()]
        }).then(() => {

            _.each(ids, id => {

                ds.dm.createEntity(this.get_detail_table(), {
                    id: utils.guid(),
                    usrid: _.result(this.props.emp, 'usrid'),
                    [this.get_detail_field()]: id
                });

            });


            ds.saveChanges().then(() => {

                toastr.success('Data successfully saved');

                (this.refs['listing'] as DataListing).reload();

                d.resolve(true);

            }).fail(err => {

                toastr.error(JSON.stringify(err));

                d.reject(err);

            }).finally(() => {

                utils.unspin(this.root);
            });


        }).finally(() => {

            utils.unspin(this.root);
        });

        return d.promise;
    }
}



export interface DataListingProps extends jx.forms.ui.DataListProps {
    emp: breeze.Entity,
    detail_field: string,
    detail_table: string,
    lookup_table: string,
    lookup_field: string    
}
export class DataListing extends jx.forms.ui.DataList {


    props: DataListingProps;


    get_model(): string {
        return 'usr';
    }


    get usr(): breeze.Entity {
        return this.ds.findkey(_.result(this.props.emp, 'usrid'))
    }


    private __setts: DataTables.Settings;
    get tbl_settings(): DataTables.Settings {

        if (!this.__setts) {
            this.__setts = {
                lengthChange: false,
                searching: false,
                columns: [
                    { title: '', data: this.props.detail_field, width: '70%' }
                ]
            }
        }
        return this.__setts;
    }


    reload() {
        this.local_load_data();
    }


    load_data(): Q.Promise<any> {

        var d = Q.defer();

        var __where = {
            id: _.result(this.props.emp,'usrid')
        }

        this.ds.exec_query({
            where: __where,
            expand: [this.props.detail_table]
        }).then(() => {

            var list = this.usr[this.props.detail_table]();

            d.resolve(list);

        });

        return d.promise;

    }


    createdCell(cell: Node, cellData: any, rowData: any, row: number, col: number) {

        super.createdCell(cell, cellData, rowData, row, col);

        if (col === 1) {

            $(cell).empty();
            $(cell).append($('<i class="fa fa-spin fa-spinner" ></i>'));

            var ds = new jx.data.DataSource(this.props.lookup_table);

            ds.exec_query({
                where: {
                    ID: cellData
                }
            }).then(() => {

                var lookup = ds.findkey(cellData);

                $(cell).empty();
                $(cell).append($('<p class="tr-fontsize-15" >{0}</p>'.format(_.result(lookup, this.props.lookup_field))));

            });
        }
    }


    createdRow(row: Node, data: any[] | Object, rowindex: number) {

        $(row).attr('data-rowid', _.result(data, this.props.detail_field));

    }

}


interface OccpInfo {
    occpid: string,
    occpisco: string,
    text: string
}

export interface Datalist_FindProps extends jx.forms.ui.DataListProps {
    modal: jx.modal.Modal,
    owner: EmpExplorer,
    usr: breeze.Entity,
    lookup_table: string,
    lookup_field: string,    
    exec_paging: (dt: Datalist_Find, req, draw, setts)=> any
}
export class Datalist_Find extends jx.forms.ui.DataList {

    constructor(props: Datalist_FindProps) {

        super(props);


        this.checks = [];


        this.props.modal.save = () => {


            if (!this.checks.length) {
                return;
            }

            utils.spin(this.props.owner.listing.root);

            this.props.owner.store_selection(this.checks);

            this.props.modal.close();
            
        }
    }


    props: Datalist_FindProps;
    checks: any[];
    occpinfo: OccpInfo;
    reload: boolean;


    render() {

        var html =
            <div style={{ minHeight: 600 }}>
                <b.Row style={{ paddingTop: 0 }}>

                    <b.Col xs={3} style={{ paddingTop: 0 }} >

                        <button className="btn btn-success btn-outline m-b-lg m-r-sm btn-display"
                            onClick={this.display_occp_tree.bind(this) } >
                            <i className="fa fa-search m-r-xs"></i>
                            <span>Filter by isco occupation</span>
                        </button>

                        <button className="btn btn-warning btn-outline m-b-lg m-r-sm btn-hide select-mode hidden"
                            onClick={this.hide_occp_tree.bind(this) } >
                            <i className="fa fa-reply m-r-xs"></i>
                            <span>Cancel</span>
                        </button>

                        <button className="btn btn-primary btn-outline m-b-lg m-r-sm btn-select select-mode hidden"
                            onClick={this.save_occp.bind(this) } >
                            <i className="fa fa-check m-r-xs"></i>
                            <span>Select</span>
                        </button>


                    </b.Col>

                    <b.Col xs={9}>
                        <div className="p-xs b-l-sm occp-selected" >

                        </div>
                    </b.Col>

                </b.Row>

                <b.Row style={{ paddingTop: 0 }}>

                    <b.Col lg={12} style={{ paddingTop: 0 }}>

                        <div className="datalist-view" >
                            {super.render() }
                        </div>

                    </b.Col>

                </b.Row>


                <div className="occptree-view hidden" >
                    <OccpTreeView noAnim={true} owner={this} />
                </div>


            </div>


        return html;

    }


    private __setts: DataTables.Settings;
    get tbl_settings(): DataTables.Settings {

        if (!this.__setts) {
            this.__setts = {

                searchDelay: 1000,

                columns: [
                    { title: '', data: null },
                    { title: '', data: this.props.lookup_field }
                ],

                drawCallback: () => {

                    var ins_list = this.root.find('ins');

                    ins_list.css('position', 'relative!important');

                },

                serverSide: true,

                ajax: this.pipeline()
            }

        }

        return this.__setts;
    }


    load_data() {
        return Q.resolve(true);
    }


    init_datatable() {
        super.init_datatable();
    }


    pipeline() {

        $.fn.dataTable.pipeline = () => {
            
            return (req, draw, setts) => {
                this.props.exec_paging(this, req, draw, setts);                
            }
        };
        
        return $.fn.dataTable.pipeline();
    }


    on_notify() {

        switch (this.current_event.action) {

            case 'occp-selected': {
                this.occpinfo = this.current_event.data;
                this.reload = true;
            } break;

            case 'occp-unselected': {
                this.occpinfo = null;
                this.root.find('.occp-selected').removeClass('bg-muted').empty();
                this.reload = true;
            } break;
        }

        return super.on_notify();
    }



    createdCell(cell: Node, cellData: any, rowData: any, row: number, col: number) {

        super.createdCell(cell, cellData, rowData, row, col);


        if (col === 1) {

            $(cell).empty();

            var _obj = {
                val: 0
            }

            var found = _.filter(this.checks, id => {

                return id === _.result(rowData, 'ID');

            }).length > 0;


            if (found) {
                _obj.val = 1;
            }


            var ctrl = <jx.controls.CheckBox
                entity={_obj}
                property="val"
                on_check={this.on_check.bind(this) }
                on_uncheck={this.on_uncheck.bind(this) }
                unposition={true} />;

            ReactDOM.render(ctrl, $(cell)[0]);

        }


        if (col === 2) {

            $(cell).empty();

            var content = $('<p class="tr-fontsize-15" style="margin-bottom:0px">{0}</p>'.format(cellData));

            $(cell).append(content);
        }
    }
    


    on_check(e: Event) {

        var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');

        if (!_.find(this.checks, _id => {
            return _id === id;
        })) {

            this.checks.push(id);

        }
    }


    on_uncheck(e: Event) {

        var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');

        this.checks = _.reject(this.checks, __id => {
            return id === __id;
        });
    }
    


    display_occp_tree() {

        jx.slide.slide_fn(this.root.find('.datalist-view'), jx.slide.SLIDE_DIR.right_out).then(() => {

            this.root.find('.occptree-view').removeClass('hidden')

            this.root.find('.occptree-view').addClass('no-hide');

            jx.slide.slide_fn(this.root.find('.occptree-view'), jx.slide.SLIDE_DIR.left_in);

        });


        this.root.find('.btn-display').addClass('hidden');
        this.root.find('.select-mode').removeClass('hidden');

    }
    

    save_occp() {

        if (!this.occpinfo) {
            return;
        }

        this.hide_occp_tree();
    }


    hide_occp_tree() {

        this.root.find('.occptree-view').removeClass('no-hide');

        var that = this;


        jx.slide.slide_fn(this.root.find('.occptree-view'), jx.slide.SLIDE_DIR.left_out).then(() => {

            if (this.reload) {
                that.datatable['fnDraw'](true);

                if (this.occpinfo) {
                    this.root.find('.occp-selected').addClass('bg-muted').append($('<strong>{0}</strong>'.format(this.occpinfo.text)))
                }

                this.reload = false;
                this.occpinfo = undefined;
            } else {
                this.root.find('.occp-selected').removeClass('bg-muted').empty();
            }

            jx.slide.slide_fn(this.root.find('.datalist-view'), jx.slide.SLIDE_DIR.right_in);

        });


        this.root.find('.btn-display').removeClass('hidden');


        this.root.find('.select-mode').addClass('hidden');

    }


}