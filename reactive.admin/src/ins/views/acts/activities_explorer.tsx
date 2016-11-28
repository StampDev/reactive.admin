/// <reference path="../lib/lightexplorer.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import { InsMasterPage, ins } from '../../lib/ins_master_page';
import jx = require('../../../core/lib');
import li = require('../lib/lightexplorer');

import rb = require('react-bootstrap');
var b: any = rb;

declare var deepcopy;


export interface ProfActivsExplorerProps extends li.LightExplorerProps {
    
}
export class ProfileActivsExplorer extends li.LightExplorer {

    private occp_obj: any;


    props: ProfActivsExplorerProps;


    constructor(props: ProfActivsExplorerProps) {

        super(props);

        if (this.props.owner['add_page']) {

            this.props.owner['add_page'](this);
        }
        
    }


    get_datalist_settings(): jx.forms.ui.DataListProps {
        return {
            allow_delete_row: true,
            allow_edit_row: false,
            model: 'acts',
            row_count: true,
            settings: {
                "ordering": false,
                "info": false,
                searching: false,
                lengthChange: false,
                columns: [
                    {
                        title: 'Activity', data: 'ACTSDESCR_EN'
                    }
                ]
            }
        }
    }


    get_explorer_title(): string {
        return 'Activities'
    }


    get_selector_add_new_title(): string {
        return 'Select one or more activities';
    }


    get_explorer_add_new_label(): string {
        return 'add new activity';
    }


    get_dataselector_settings(): li.LightExplorerDataSelectorProps {

        var opts: li.LightExplorerDataSelectorProps = this.get_datalist_settings() as any;

        opts.allow_delete_row = false;
        opts.allow_edit_row = false;

        opts.settings.lengthChange = true;
        opts.settings.searching = true;

        return opts as any;
    }


    get_dataselector_view(props: any) {

        var view: any =
            <div>

                <div className="bg-info p-xs">
                    <h4>ISCO occupation</h4>
                    <h3>{_.result(this.occp_obj, 'OCCPCONCEPT_EN') }</h3>
                </div>

                <hr className="hr-line-dashed"/>

                <ProfileActivsSelector owner={this} {...props} />
            </div>;

        return view;
    }


    on_notify() {

        return super.on_notify().then(rst => {

            if (this.current_event.action === 'occp-stored') {

                this.occpisco = _.result(this.current_event.data, 'OCCPISCO' )

                return this.get_occp_obj();
            }

            return rst;
        });
    }


    get_datalist_view(props: li.LightExplorerDatalistProps): li.LightExplorerDatalist_View {

        var view: any = <ProfileActivsDatalist owner={this} {...props} />
        return view;
    }


    get_occp_obj() {

        var d = Q.defer();

        var ds = new jx.data.DataSource('occp');

        ds.exec_query({
            where: {
                'OCCPISCO': { 'eq': this.occpisco }
            }
        }).then(data => {
            this.occp_obj = data[0];
        });

        return d.promise;

    }
    

    validate_page(): boolean {

        var ok = super.validate_page();

        if (ok) {

            if (!this.datalist_view.data || this.datalist_view.data.length == 0) {

                toastr.error('You must select at least one activity');

                return false;
            }
        }


        this.broadcast({
            action: 'activs-stored',
            data: this.datalist_view.data
        });


        return ok;
    }
}



interface ProfileActivsSelectorProps extends jx.forms.ui.DataListProps {
    occpisco: string,
    excluded_activs: any[]
}
class ProfileActivsSelector extends li.LightExplorerDataSelector_View {
    
    load_data() {

        var d = Q.defer();

        var __where: any = { 'ACTSISCO': { 'startsWith': this.props.occpisco } };


        if (this.props.excluded_ids && this.props.excluded_ids.length > 0) {

            __where = {
                not: {
                    'ID': {
                        in: _.map(this.props.excluded_ids, id => {
                            return "'{0}'".format(id)
                        })    }
                }
            }

            __where = {
                'and': [
                    { 'ACTSISCO': { 'startsWith': this.props.occpisco } },
                    {
                        'and': _.map(this.props.excluded_ids, id => {
                            return { 'ID': { 'ne' : id } }
                        })
                    }
                ]
            };

        }

        var qry: any = {
            where: __where,
            orderBy: ["ACTSDESCR_EN"]
        }

        this.ds.fetch_data(qry).then(() => {

            var data = this.ds.dm.getEntities('acts');

            d.resolve(data);

        }).fail(err => {

            toastr.error(JSON.stringify(err));
        });

        return d.promise;
    }

}



export class ProfileActivsDatalist extends li.LightExplorerDatalist_View {
    

    load_data() {
        
        var d = Q.defer();

        var list = deepcopy(this.data);

        if (list.length === 0) {
            list.push('-1');
        }

        var qry: any = {
            where: { 'ID': { in: list } },
            orderBy: ["ACTSDESCR_EN"]
        }

        this.ds.dm.clear();

        this.ds.fetch_data(qry).then(() => {

            var data = this.ds.dm.getEntities('acts');

            d.resolve(data);

        }).fail(err => {

            toastr.error(JSON.stringify(err));
        });

        return d.promise;

    }
    
    
    on_notify() {

        return super.on_notify().then(rst => {

            if (this.current_event.action === 'occp-stored') {

                this.data.length = 0;

                this.local_load_data();
            }

            return true;
        });
    }
    
}



