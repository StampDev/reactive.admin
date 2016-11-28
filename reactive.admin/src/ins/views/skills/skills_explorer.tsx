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


export interface ProfSkillsExplorerProps extends li.LightExplorerProps {
    
}
export class ProfSkillsExplorer extends li.LightExplorer {

    private occp_obj: any;


    props: ProfSkillsExplorerProps;


    constructor(props: ProfSkillsExplorerProps) {

        super(props);


        if (this.props.owner['add_page']) {

            this.props.owner['add_page'](this);
        }
    }


    get_datalist_settings(): jx.forms.ui.DataListProps {
        return {
            allow_delete_row: true,
            allow_edit_row: false,
            model: 'skls',
            row_count: true,
            settings: {
                "ordering": false,
                "info": false,
                searching: false,
                lengthChange: false,
                columns: [
                    {
                        title: 'Skill', data: 'SKLSCONCEPT'
                    }
                ]
            }
        }
    }


    get_explorer_title(): string {
        return 'Profile skills'
    }


    get_selector_add_new_title(): string {
        return 'Select or insert one or more skills';
    }


    get_explorer_add_new_label(): string {
        return 'add new skill';
    }


    get_dataselector_settings(): li.LightExplorerDataSelectorProps {

        var opts: li.LightExplorerDataSelectorProps = this.get_datalist_settings() as any;

        opts.allow_delete_row = false;
        opts.allow_edit_row = false;

        opts.settings.lengthChange = true;
        opts.settings.searching = true;
        opts.settings.ordering = true;
        opts.settings.info = true;

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

                <ProfSkillsSelector_View owner={this} {...props} />
            </div>;

        return view;
    }


    get_datalist_view(props: li.LightExplorerDatalistProps): li.LightExplorerDatalist_View {
        var view: any = <ProfSkillsDatalist owner={this} {...props} />
        return view;
    }


    on_notify() {

        return super.on_notify().then(rst => {

            if (this.current_event.action === 'occp-stored') {

                this.occpisco = _.result(this.current_event.data, 'OCCPISCO')

                return this.get_occp_obj();
            }

            return rst;
        });
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

                toastr.error('You must select at least one skill');

                return false;
            }
        }

        this.broadcast({
            action: 'skills-stored',
            data: this.datalist_view.data
        });


        return ok;
    }

}



interface SelectActivsDataListProps extends jx.forms.ui.DataListProps {
    occpisco: string,
    excluded_activs: any[]
}
class ProfSkillsSelector_View extends li.LightExplorerDataSelector_View {

    load_data() {

        var d = Q.defer();

        var ds: jx.data.DataSource = new jx.data.DataSource('occp');

        var sql = `SELECT DISTINCT S.* 
        FROM OCCS OS 
        JOIN SKLS S ON S.ID = OS.SKLSID 
        JOIN OCCP_ISCO ISCO ON OS.OCCPID = ISCO.ID 
        WHERE EXISTS (SELECT 1 FROM OCCP P WHERE P.OCCPISCO = '{0}' 
        AND ISCO.OCCPPARENTISCO LIKE P.OCCPISCO + '%' )
        ORDER BY S.SKLSCONCEPT
        `.format(this.props.occpisco);

        ds.exec_raw(sql).then(data => {

            d.resolve(data);

        });


        return d.promise;

    }


    fetch_skills_from_occp(occp_data:any[]) {

        var d = Q.defer();

        var occs_ds = new jx.data.DataSource('occs');

        var occp_ids = _.map(occp_data, d => {
            return _.result(d, 'ID');
        });

        occs_ds.fetch_data({
            where: { 'OCCPID': { in: occp_ids } }
        }).then(data => {

            var skls_ids = _.map(data, d => {
                return _.result(d, 'SKLSID');
            });

            var skls_ds = new jx.data.DataSource('skls');

            skls_ds.fetch_data({
                where: { 'ID': { in: skls_ids } }
            }).then(_data => {

                d.resolve(_data);
            });

        });

        return d.promise;
    }

}



export class ProfSkillsDatalist extends li.LightExplorerDatalist_View {


    load_data() {
        
        var d = Q.defer();

        var list = deepcopy(this.data);

        if (list.length === 0) {
            list.push('-1');
        }
        
        var qry: any = {
            where: { 'ID': { in: list } },
            orderBy: ["SKLSCONCEPT"]
        }

        this.ds.dm.clear();

        this.ds.fetch_data(qry).then(() => {

            var data = this.ds.dm.getEntities('skls');

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


