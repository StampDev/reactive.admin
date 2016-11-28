/// <reference path="profile_edit_basicinfo.tsx" />
/// <reference path="profile_edit_activs.tsx" />
/// <reference path="profile_edit_skills.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX



import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;

import jx = require('../../../core/lib');
import { ProfileEditBasicInfo} from './profile_edit_basicinfo';
import { ProfileEditActivs} from './profile_edit_activs';
import { ProfileEditSkills} from './profile_edit_skills';



interface EditState extends jx.views.ReactiveViewState{
    profile_title?: any
}
export interface ProfileEditViewProps extends jx.views.ReactiveViewProps {
    id: string
}
export class ProfileEditView extends jx.views.ReactiveView {

    props: ProfileEditViewProps;
    state: EditState;

    constructor(props: ProfileEditViewProps) {
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


    get prof(): any {
        return this.ds.dm.getEntities('prof')[0];
    }


    occp_obj: any;


    render() {
        
        
        var html =
            <div className="p-md profileEditView">

                <h1>
                    <i className="fa fa-pencil-square-o" style={{ marginRight: 10 }} /> <span>View/Edit profile</span>

                    <rb.Button bsStyle="warning" bsSize="small"
                        className="btn-outline pull-right">
                        <i className="fa fa-trash text-warning"></i>
                    </rb.Button>                    
                </h1>

                <hr className=".hr-line-dashed" />


                {this.inner_content()}


            </div>


        return html;
    }


    inner_content() {

        var html = <jx.views.LoaderView height={450} />;

        if (!this.state.loading) {

            html =
                <div>

                    {this.state.profile_title}


                    <br/>


                    <b.Tabs defaultActiveKey={1} id="tabs">

                        <b.Tab eventKey={1} title="Basic information">

                            <br />

                            <br />
                            <div className="info">
                                <ProfileEditBasicInfo owner={this} profid={this.props.id} />
                            </div>

                        </b.Tab>

                        <b.Tab eventKey={2} title="Profile activities">

                            <br />

                            <br />

                            <div className="activs">
                                <ProfileEditActivs owner={this} />
                            </div>

                        </b.Tab>

                        <b.Tab eventKey={3} title="Profile skills">
                            <br />

                            <br />

                            <div className="skills">
                                <ProfileEditSkills owner={this} />
                            </div>
                        </b.Tab>

                    </b.Tabs>

                </div>
        }

        return html;
    }


    on_notify() {


        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                var that = this;
                
                this.load_profile()
                    .then(() => {

                        this.load_occp().then(() => {


                            this.updateState<EditState>({
                                profile_title: <ProfileHeaderInfo title={<h2>{_.result(that.prof, 'PROFTITLE') }</h2> } />,
                                loading: false
                            },()=>{

                                this.fix_tabs_urls();
                                
                                this.broadcast({
                                    action: 'profile-loaded',
                                    data: {
                                        prof: this.prof,
                                        occp: this.occp_obj
                                    }, done: () => {

                                        //this.root['slimScroll']({
                                        //    height: '820px'
                                        //});

                                    }
                                });
                       });                            
                    });
               });

            } break;


            case 'profile-saved': {


                var ent: breeze.Entity = this.current_event.data;


                var __data = ent.entityAspect.entityManager.exportEntities();


                this.ds.dm.importEntities(__data);


                this.updateState<EditState>({
                    profile_title: <ProfileHeaderInfo title={<h1>{_.result(this.prof, 'PROFTITLE') }</h1> } />
                });


            } break;
        
        }
        
        return super.on_notify();

    }
    

    fix_tabs_urls() {

        _.each(this.root.find('li[role="presentation"]'), li => {

            var a = $(li).find('a');

            var url = a.attr('aria-controls');

            $(a).attr('href', '#{0}'.format(url));

            $(a).off('click');

            $(a).click((e) => {
                e.preventDefault();
            });

        });
    }


    load_profile() {

        var d = Q.defer();

        this.ds.fetch_data({
            where: {
                ID: { 'eq': this.props.id }
            },
            expand: ['proa', 'pros']
        }).then(() => {

            d.resolve(true);
        });
        
        return d.promise;
    }


    load_occp() {

        var d = Q.defer();

        var prof:any = this.ds.dm.getEntities('prof')[0];

        var ds = new jx.data.DataSource('occp');

        ds.exec_query({
            where: {
                'ID': { 'eq': this.prof.OCCPID() }
            }
        }).then(data => {

            this.occp_obj = data[0];

            d.resolve(true);

        });


        return d.promise;
    }

}


interface ProfileHeaderInfoProps extends jx.views.ReactiveViewProps {
    title:any
}
class ProfileHeaderInfo extends jx.views.ReactiveView {

    props: ProfileHeaderInfoProps;

    constructor(props: ProfileHeaderInfoProps) {
        super(props);
        _.extend(this.state, props);
    }

    render() {

        const {title} = this.state as any;

        var html =
            <div>
                <table width='100%'>
                    <tbody>
                        <tr>                            
                            <td>
                                <div style={{ marginRight:10 }}>
                                    <h5>Usage</h5>
                                    <h2>65%</h2>
                                    <div className="progress progress-mini">
                                        <div style={{ width: '68%' }} className="progress-bar" />
                                    </div>
                                    <div className="m-t-sm small">last update 4: 32 pm.</div>
                                </div>
                            </td>
                            <td>
                                <div style={{ marginRight: 25 }}>
                                    <h5>Search hits</h5>
                                    <h2>14%</h2>
                                    <div className="progress progress-mini">
                                        <div style={{ width: '38%' }} className="progress-bar progress-bar-danger" />
                                    </div>
                                    <div className="m-t-sm small">last update 4: 32 pm.</div>
                                </div>
                            </td>
                            <td>{title}</td>
                        </tr>
                    </tbody>
                </table>
                <hr />
            </div>;
        return html;
    }


    componentWillReceiveProps(nextProps: jx.views.ReactiveViewProps) {

        super.componentWillReceiveProps(nextProps);

        _.extend(this.state, nextProps);
    }
}