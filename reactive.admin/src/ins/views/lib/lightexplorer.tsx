// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;

import { InsMasterPage, ins } from '../../lib/ins_master_page';
import jx = require('../../../core/lib');

 


export enum ExplorerViewMode { datalist, form_new, form_edit }
export interface LightExplorerState extends jx.views.ReactiveViewState {
    viewmode: ExplorerViewMode
}
export interface LightExplorerProps extends jx.views.ReactiveViewProps {
    title?: any
}
export class LightExplorer extends jx.views.ReactiveView {

    props: LightExplorerProps;
    state: LightExplorerState;
    occpisco: string;

    constructor(props: LightExplorerProps) {
        super(props);
        this.state.viewmode = ExplorerViewMode.datalist;
    }


    get_datalist_settings(): jx.forms.ui.DataListProps {
        return null;
    }
    

    get_explorer_title(): string {
        return this.props.title
    }


    get_selector_add_new_title(): string {
        return null;
    }


    get_explorer_add_new_label(): string {
        return null;
    }
    

    render() {

        var datalist_props: any = this.get_datalist_settings();
        
        var can_add_new = this.state.viewmode === ExplorerViewMode.datalist ? 'btn-success btn-outline' : 'btn-default';
        var data_btn_visible = this.state.viewmode != ExplorerViewMode.datalist ? '' : 'hidden';
        

        var html = 
            <b.Row>

                <b.Row>
                    <b.Col lg={12}>
                        <h1 className="header header-title" style={{ display: 'inline-block' }}>
                            <span>{this.get_explorer_title() }</span>
                        </h1>

                        <button className={"pull-right btn btn-add-new {0} ".format(can_add_new) }
                            onClick={this.display_selector.bind(this) }>
                            <i className="fa fa-plus" ></i> <span>{this.get_explorer_add_new_label()}</span>
                        </button>

                        <button className={"pull-right btn btn-outline btn-warning btn-cancel {0} ".format(data_btn_visible) }
                            onClick={this.display_datalist.bind(this) }
                            style={{ marginRight: 10 }}>
                            <i className="fa fa-reply" ></i> <span>cancel</span>
                        </button>

                        <button className={"pull-right btn btn-outline btn-primary btn-save {0} ".format(data_btn_visible) }
                            onClick={this.store_selection.bind(this) }
                            style={{ marginRight: 10 }}>
                            <i className="fa fa-check" ></i> <span>save</span>
                        </button>

                    </b.Col>

                </b.Row>

                <hr className="header header-sep" />

                <b.Row>

                    <b.Col lg={12}>

                        <div className="datalist-view">
                            {this.get_datalist_view(datalist_props) }
                        </div>


                        <div className="sliding-view">
                            
                        </div>

                    </b.Col>


                </b.Row>

            </b.Row>;

        
        return html;
    }


    on_notify() {

        switch (this.current_event.action) {

            case 'occp-stored': {
                this.occpisco = this.current_event.data['occpisco'];
            } break;

        }

        return super.on_notify();
    }


    display_selector(e: Event) {

        e.preventDefault();

        if (this.root.find('.btn-add-new').hasClass('btn-default')) {
            return;
        }

        var props: LightExplorerDataSelectorProps = this.get_dataselector_settings();

        props.occpisco = this.occpisco;

        if (this.datalist_view) {
            props.excluded_ids = this.datalist_view.data;
        }


        this.newState({
            viewmode: ExplorerViewMode.form_new
        }, () => {
            
            var view =
                <div>
                    <h3>{this.get_selector_add_new_title() }</h3>
                    <br />
                    {this.get_dataselector_view(props)}
                </div>;

            var root = this.root.find('.sliding-view');

            jx.slide.slide_fn(this.root.find('.datalist-view'), jx.slide.SLIDE_DIR.right_out)
                .then(() => {                    

                    ReactDOM.unmountComponentAtNode(this.root.find('.sliding-view')[0]);

                    ReactDOM.render(view, root[0]);

                    jx.slide.slide_fn(root, jx.slide.SLIDE_DIR.left_in);
                    
            });
        });
    }


    display_datalist() {

        var d = Q.defer();

        this.newState({
            viewmode: ExplorerViewMode.datalist
        }, () => {

            jx.slide.slide_fn(this.root.find('.sliding-view'), jx.slide.SLIDE_DIR.left_out)
                .finally(() => {

                    jx.slide.slide_fn(this.root.find('.datalist-view'), jx.slide.SLIDE_DIR.right_in);

                    d.resolve(true);
                });
        });

        return d.promise;
    }


    store_selection() {

        if (this.dataselector_view.selected_ids.length === 0) {
            return;
        }
        
        this.datalist_view.notify({
            action: 'store_selection',
            data: this.dataselector_view.selected_ids,    
            done: () => {

                this.display_datalist();
            }
        })
    }
    

    get datalist_view(): LightExplorerDatalist_View {
        return this['__datalist'] as any;
    }

    
    get dataselector_view(): LightExplorerDataSelector_View {
        return this['__dataselector']
    }

    
    get_dataselector_settings(): LightExplorerDataSelectorProps {
        return null;
    }


    get_dataselector_view(props: LightExplorerDataSelectorProps): LightExplorerDataSelector_View {
        var view:any = <LightExplorerDataSelector_View owner={this} {...props} />
        return view;
    }


    get_datalist_view(props: LightExplorerDatalistProps): LightExplorerDatalist_View {
        var view: any = <LightExplorerDatalist_View owner={this} {...props} />
        return view;
    }


    validate_page(): boolean {
        
        return true;
    }
}



export interface LightExplorerDataSelectorState extends jx.forms.ui.DataListState {
}
export interface LightExplorerDataSelectorProps extends jx.forms.ui.DataListProps {
    occpisco: string,
    excluded_ids: string[]
}
export class LightExplorerDataSelector_View extends jx.forms.ui.DataList {

    props: LightExplorerDataSelectorProps;
    state: LightExplorerDataSelectorState;
    selected_ids: any[];


    constructor(props: LightExplorerDataSelectorProps) {
        super(props);
        this.state.loading = true;
        this.props.owner['__dataselector'] = this;
        this.selected_ids = [];
    }


    init_datatable() {

        super.init_datatable();

        var that = this;

        this.root.find('table').on('page.dt', () => {

            that.root.find('ins').css('position', 'relative!important');
        });
    }


    init_datatable_settings() {

        var setts: DataTables.Settings = super.init_datatable_settings();

        setts.drawCallback = (settings: DataTables.SettingsLegacy) => {

            var ins_list = this.root.find('ins');

            ins_list.css('position', 'relative!important');

        }

        return setts;
    }


    init_columns(_columns: DataTables.ColumnSettings[]): DataTables.ColumnSettings[] {

        var columns: DataTables.ColumnSettings[] = super.init_columns(_columns);

        var col_index = this.props.row_count ? 1 : 0;

        columns.splice(col_index, 0, this.insert_checkbox_td())
        
        return columns;
    }


    insert_checkbox_td() {

        var that = this;

        var col: DataTables.ColumnSettings = {
            title: 'Select',
            data: null,
            createdCell: (cell: Node, cellData: any, rowData: any) => {
                $(cell).empty();
                var ctrl = <jx.controls.CheckBox unposition={true} on_check={that.on_check.bind(that) } on_uncheck={that.on_uncheck.bind(that) }  />;
                ReactDOM.render(ctrl, $(cell)[0]);
            }
        };

        return col;
    }


    createdCell(cell: Node, cellData: any, rowData: any, row: number, col: number) {

        var col_text_index = this.props.row_count ? 2 : 1;
        
        if (col === col_text_index) {

            $(cell).empty();

            var a = $('<p class="tr-fontsize">{0}</p>'.format(cellData))

            $(cell).append(a);
        }
    }


    on_check(e: Event) {

        var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');

        this.add_rowid(id);
    }


    on_uncheck(e: Event) {

        var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');

        this.remove_rowid(id);
    }


    add_rowid(id: string) {

        var found = _.filter(this.selected_ids, __id => {
            return __id === id;
        }).length > 0;

        if (!found) {

            this.selected_ids.push(id);
        }
    }


    private remove_rowid(id: string) {

        this.selected_ids = _.reject(this.selected_ids, __id => {
            return __id === id;
        });
    }
        

}



export interface LightExplorerDatalistState extends jx.forms.ui.DataListState {
}
export interface LightExplorerDatalistProps extends jx.forms.ui.DataListProps {
}
export class LightExplorerDatalist_View extends jx.forms.ui.DataList {

    props: LightExplorerDatalistProps;
    state: LightExplorerDatalistState;

    constructor(props: LightExplorerDatalistProps) {
        super(props);
        this.props.owner['__datalist'] = this;
    }

    private __internal_data: any;

    get data(): any[] {

        if (!this.__internal_data) {
            this.__internal_data = [];
        }
        return this.__internal_data;
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                this.newState({
                    loading: false
                }, () => {
                    this.init_datatable();
                });

            } break;

            case 'store_selection': {

                var data = this.current_event.data;

                _.each(data, id => {

                    if (_.filter(this.data, __id => {
                        return __id === id
                    }).length === 0) {

                        this.data.push(id);
                    }
                });

                this.local_load_data();

            } break;
        }

        return Q.resolve(true);
    }


    createdCell(cell: Node, cellData: any, rowData: any, row: number, col: number) {

        var col_text_index = this.props.row_count ? 1 : 0;

        if (col === col_text_index) {

            $(cell).empty();

            var a = $('<p class="tr-fontsize">{0}</p>'.format(cellData))

            $(cell).append(a);
        }
    }



    do_delete_row(e: Event): Q.Promise<any> {

        e.preventDefault();

        var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');

        var that = this;

        return utils.can_delete().then(ok => {

            if (ok) {

                that.__internal_data = _.reject(that.__internal_data, __id => {
                    return __id === id;
                });

                this.local_load_data();
            }

            return ok;

        });

    }


}