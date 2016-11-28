/// <reference path="../acts/activities_explorer.tsx" />
/// <reference path="../acts/activities_explorer.tsx" />
/// <reference path="../lib/lightexplorer.tsx" />
/// <reference path="../skills/skills_explorer.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;

import jx = require('../../../core/lib');

import skills = require('../skills/skills_explorer');
import light = require('../lib/lightexplorer');

declare var deepcopy;


interface ProfileEditSkillsState extends jx.views.ReactiveViewState {    
}
export interface ProfileEditSkillsProps extends jx.views.ReactiveViewProps {    
}
export class ProfileEditSkills extends jx.views.ReactiveView {

    props: ProfileEditSkillsProps;
    state: ProfileEditSkillsState;
    

    render() {

        var html =
            <div className="row">
                <b.Col lg={12} className="p-md">
                    <ProfileEditSkillsExplorer ref='datalist' owner={this} />
                </b.Col>
            </div>


        return html;
    }

}



interface ProfileEditSkillsExplorerProps extends skills.ProfSkillsExplorerProps {
}
export class ProfileEditSkillsExplorer extends skills.ProfSkillsExplorer {

    props: ProfileEditSkillsExplorerProps;


    get_datalist_view(props: ProfileEditSkillsDataListProps): ProfileEditSkillsDataList {

        var view: any = <ProfileEditSkillsDataList owner={this} {...props} />
        return view;
    }


    get_datalist_settings(): jx.forms.ui.DataListProps {

        var opts = super.get_datalist_settings();

        opts.settings.columns = [
            {
                title: 'Skill', data: 'ID'
            }
        ];
        
        return opts;
    }



    get_dataselector_settings(): light.LightExplorerDataSelectorProps {

        var opts: light.LightExplorerDataSelectorProps = super.get_datalist_settings() as any;

        opts.allow_delete_row = false;
        opts.allow_edit_row = false;

        opts.settings.searching = true;
        opts.settings.lengthChange = true;

        opts.settings.columns = [
            {
                title: 'Skill', data: 'SKLSCONCEPT'
            }
        ];

        return opts as any;
    }


    on_notify() {

        switch (this.current_event.action) {

            case 'occp-stored': {

                this.occpisco = this.current_event.data;

                return this.get_occp_obj();

            }

            case 'start-spinning': {
                utils.spin(this.root);
            } break;

            case 'stop-spinning': {
                utils.unspin(this.root);
            } break;

        }

        return super.on_notify();

    }
}



interface ProfileEditSkillsDataListState extends light.LightExplorerDatalistState {
}
interface ProfileEditSkillsDataListProps extends light.LightExplorerDatalistProps {
}
class ProfileEditSkillsDataList extends skills.ProfSkillsDatalist {

    props: ProfileEditSkillsDataListProps;
    state: ProfileEditSkillsDataListState;

    constructor(props: ProfileEditSkillsDataListProps) {
        super(props);        
    }

    prof: any;
    src_occp: any;
    

    on_notify() {

        switch (this.current_event.action) {

            case 'profile-loaded': {

                this.prof = this.current_event.data['prof'];

                this.data.length = 0;

                _.each(this.prof['pros'](), d => {
                    this.data.push(_.result(d, 'SKLSID'));
                });

                this.ds.dm.clear();

                this.ds.dm.importEntities(this.prof.entityAspect.entityManager.exportEntities());
                
                this.src_occp = this.current_event.data['occp'];


                this.props.owner.notify({
                    action: 'occp-stored',
                    data: _.result(this.src_occp, 'OCCPISCO')
                });


                this.local_load_data();


                return Q.resolve(true);

            }

            case 'store_selection': {
                
                return super.on_notify().then(() => {

                    return this.save_data() as any;

                });
            } 


            case jx.constants.events.view_initialized:
            default:
                return super.on_notify();
        }
    }


    do_delete_row(e: Event) {

        var d = Q.defer();
        
        super.do_delete_row(e).then(ok => {

            this.save_data().then(() => {

                d.resolve(true);

            });

        });

        return d.promise;
    }



    save_data() {

        var d = Q.defer();

        this.props.owner.notify({
            action: 'start-spinning'
        });

        this.fix_insertions();

        this.fix_deletions();
        
        this.ds.saveChanges().then(() => {

            toastr.success('data successfully saved');

            d.resolve(true);

        }).fail(err => {

            toastr.error(JSON.stringify(err));

            d.reject(err);

        }).finally(() => {

            this.props.owner.notify({
                action: 'stop-spinning'
            });

        });


        return d.promise;
    }


    fix_insertions() {

        var src_ids = _.map(this.ds.dm.getEntities('pros'), obj => {
            return _.result(obj, 'SKLSID');
        });

        _.each(this.data, id => {

            var to_insert = _.filter(src_ids, src_id => {
                return src_id === id;
            }).length === 0;


            if (to_insert) {

                this.ds.dm.createEntity('pros', {
                    ID: utils.guid(),
                    SKLSID: id,
                    PROFID: _.result(this.prof, 'ID'),
                    OCCPID: _.result(this.prof, 'OCCPID')
                });
            }
        });
    }


    fix_deletions() {

        _.each(this.ds.dm.getEntities('pros'), obj => {

            var sklid = _.result(obj, 'SKLSID');

            var to_delete = _.filter(this.data, id => {

                return sklid === id

            }).length === 0;


            if (to_delete) {

                obj.entityAspect.setDeleted();
            }

        });

    }




    load_data() {

        var ids = _.map(this.data, id => {
            return {
                ID: id
            }
        });
        
        return Q.resolve(ids);
    }


    createdCell(cell: Node, cellData: any, rowData: any, row: number, col: number) {

        if (col === 1) {

            $(cell).empty();

            $(cell).append($('<i class="fa fa-spin fa-spinner" ></i>'));

            var ds = new jx.data.DataSource('skls');

            ds.exec_query({
                where: {
                    ID: { 'eq': rowData['ID'] }
                }
            }).then(data => {

                $(cell).empty();

                var skill = data[0];

                $(cell).append($('<p class="tr-fontsize">{0}</p>'.format(_.result(skill, 'SKLSCONCEPT'))));

            });
        }

    }

}