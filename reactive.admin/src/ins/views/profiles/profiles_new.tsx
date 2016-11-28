/// <reference path="../../../../typings/react/react-bootstrap.d.ts" />
/// <reference path="profile_occptree.tsx" />
/// <reference path="../acts/activities_explorer.tsx" />
/// <reference path="../occp/occp_list.tsx" />
/// <reference path="../skills/skills_explorer.tsx" />
/// <reference path="wiz_page_finish.tsx" />

// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import { InsMasterPage, ins } from '../../lib/ins_master_page';
import jx = require('../../../core/lib');

import rb = require('react-bootstrap');
var b: any = rb;

import { OccpTreeView } from './profile_occptree';
import { ProfileActivsExplorer } from '../acts/activities_explorer';
import { ProfSkillsExplorer } from '../skills/skills_explorer';
import { OccpList } from '../occp/occp_list';
import { ProfileWizFinishPage } from './wiz_page_finish';




export class ProfilesAddNew extends jx.views.ReactiveView {

    render() {
        var html =
            <div className="" style={{ minHeight:400 }}>

                <h1 className="text-info" style={{ display: 'inline-block' }}><i className="fa fa-plus-square" style={{ marginRight: 20 }} /> <span>Add a new professional profile</span></h1>

                <button className="btn btn-warning btn-outline pull-right" onClick={this.cancel_wizard.bind(this) }><i className="fa fa-reply" ></i> cancel</button>

                <hr />

                <ProfileWizard owner={this as any} />

            </div>

        return html;
    }


    cancel_wizard() {

        this.app.router.navigate('/profiles');
    }
}


interface ProfileWizardState extends jx.views.ReactViewState {
    completed: boolean,
    affected_items: number
}
export interface ProfileWizardProps extends jx.views.ReactiveViewProps {    
}
export class ProfileWizard extends jx.views.ReactiveView{
    
    props: ProfileWizardProps;
    state: ProfileWizardState;
    active_page: number;
    pages: ProfileWizardPage[];

    prof: any;

    constructor(props:ProfileWizardProps){
        super(props);        
        this.pages = [];
    }


    render() {

        var mess = 'Les articles selectionnes ont ete transferes avec success';

        if (this.state.affected_items === 0) {
            mess = "Aucun article selectionne n'a ete transfere. Raison possible: ces articles existent deja dans nos invenatires ";
        }

        var html =

            <div className="animated fadeInRight" style={{ minHeight: 350 }}>
                
                <b.Row className="wizard-content" style={{ paddingLeft: 20, paddingRight: 20 }}>

                    <div className='wizard-place-holder'>

                        {this.build_wizard() }

                    </div>
                    
                </b.Row>

            </div>


        return html;

    }


    componentDidMount() {

        super.componentDidMount();

        this.init_wizard();
    }


    componentDidUpdate() {

        super.componentDidUpdate();
                
        if (this.state.completed) {
            
        }
    }


    on_notify() {

        switch (this.current_event.action) {
            
            case 'prof-stored': {

                this.prof = this.current_event.data;

            } break;


            case 'activs-stored': {


            } break;


            case 'skills-stored': {


            } break;
            
        }


        return super.on_notify();
    }


    close_wizard() {

        this.props.owner['close_wizard']();
    }


    build_wizard() {

        var html =

            <div id="new-art-wiz">
                
                <h1>Profile</h1>

                <section>

                    <ProfileWizardPage owner={this} page_index={0}>

                    <div className="row" style={{ minHeight: 300 }}>

                        <div className="col-lg-12" style={{ paddingLeft: 0, paddingRight: 0 }}>

                            <h2>Basic info</h2>

                            <p style={{ fontSize: '1.2em', fontWeight: 600 }}>
                                Enter information related to this profile occupation
                            </p>

                            <hr />

                            <ProfileBasicInfo owner={this}/>

                        </div>

                    </div>

                    </ProfileWizardPage>
                    
                </section>
                
                <h1>Activities</h1>

                <section>

                    <ProfileWizardPage owner={this} page_index={1}>
                        <ProfileActivsExplorer owner={this} />
                    </ProfileWizardPage>

                </section>


                <h1>Skills</h1>
                <section>

                    <ProfileWizardPage owner={this} page_index={2}>
                        <ProfSkillsExplorer owner={this} />
                    </ProfileWizardPage>
                    
                </section>


                <h1>Save</h1>
                <section>

                    <ProfileWizardPage owner={this} page_index={3}>
                        <ProfileWizFinishPage owner={this} />
                    </ProfileWizardPage>
                   
                </section>

            </div>
            
        return html;
    }


    init_wizard() {


        var that = this;


        this.root.find('#new-art-wiz')['steps']({
            
            headerTag: "h1",
            
            bodyTag: "section",
            
            transitionEffect: "fade",
            
            autoFocus: true,
            
            onInit: (event, currentIndex) => {
                this.active_page = 0;                
            },

            onStepChanged: (event, current, prior) => {            
                that.active_page = current;                
            },

            onStepChanging: (event, current, next) => {

                var forward = next > current;

                if (!forward) {
                    return true;
                }

                var ok = this.get_active_page().validate_page();
                
                return ok;
            },

            onFinished: (event, currentIndex) => {

                this.broadcast({
                    action:'add-prof-finished'
                });

            }
        });


        that.root.find('.steps ul li[role="tab"] a').css({
                    'font-size':'2em',
                    'font-weight':'500',
                    'line-height':'1.1'
        });

        that.root.find('.wizard-content .content').css('background-color','white');
    }


    get_active_page():ProfileWizardPage{

        var page = _.find(this.pages, p =>{
            return p.props.page_index === this.active_page;
        });

        return page;
    }


    add_page(page: ProfileWizardPage){

        this.pages.push(page);

    }
  
}



export interface ProfileWizardPageProps extends jx.views.ReactViewProps{
    owner: ProfileWizard,
    page_index: number    
}
interface ProfileWizardPageState extends jx.views.ReactViewState {    
}
export class ProfileWizardPage extends jx.views.ReactiveView {

    props: ProfileWizardPageProps;
    state:ProfileWizardPageState;

    constructor(props: ProfileWizardPageProps) {
        
        super(props);  
        
        this.props.owner.add_page(this);      
    }


    get is_active_page(): boolean {        
        return this.props.page_index === this.props.owner.active_page;
    }


    activate_page()
    {
        this.forceUpdate();
    }


    render() {

        var html =
            <div>
                {this.props.children}
            </div>;

        return html;
    }


    validate_page(): boolean {

        var ok = true;

        var viewid = this.root.find('[data-reactive-view]').attr('data-reactive-view');

        this.get_view(viewid, (view) => {

            if (view['validate_page']) {

                ok = view['validate_page']();

            }
            
        });

        return ok;
    }
    
    
}


export class ProfileBasicInfo extends jx.views.ReactiveView {

    private occpinfo: {
        occpid: string,
        occpisco: string
    }


    private __ds: jx.data.DataSource;
    get ds() {

        if (!this.__ds) {
            this.__ds = new jx.data.DataSource('prof');
        }

        return this.__ds;
    }


    private __prof: any;
    get prof(): any {

        if (!this.__prof) {

            this.__prof = this.ds.dm.createEntity('prof', {
                ID: utils.guid(),
                COMPID: this.app.currentUser['compid'],
                PROFCREATEDATE: moment().toISOString(),
                PROFISPUBLIC: 1,
                PROFACTIVE: 1,
                PROFCOUNTRY: 'GR'    
            });
        }

        return this.__prof;
    }


    render(){
        
        var html = 
            <div>

                <br />

                <h3>Profile title</h3>
                
                <form>

                    <b.FormGroup>                    
                        <b.FormControl name="proftitle" type="text" data-bind="textInput:PROFTITLE" /> 
                    </b.FormGroup>

                </form>
                
                <br />

                <hr className="hr-line-dashed" />

                <h3>
                    <span className="isco-title">Isco occupation</span>
                    
                    <rb.Button bsStyle="primary"
                        onClick={this.select_occp.bind(this) }   
                        className="btn-outline pull-right btn-occp">
                        select the profile isco occupation
                    </rb.Button>

                </h3>        
                
                <div className="m-t-sm">
                    <h3>
                        <strong className="occp"></strong>
                    </h3>
                </div>

                <br />

                <hr className="hr-line-dashed" />

                <br/>
                <br />

                <h3>Profile description</h3>
                <jx.controls.QuillEditor entity={this.prof} property="PROFDESCRIPTION"/>

                <jx.modal.Modal ref='modal'
                    title="Select an isco occupation"
                    bsSize="lg"
                    onFinish={() => { return this.store_occp_select(); } } />

            </div>;
        
        return html;
    }


    select_occp(e: Event) {

        e.preventDefault();

        (this.refs['modal'] as jx.modal.Modal).show(<OccpTreeView owner={this as any} />);
    }


    private store_occp_select() {
        return this.update_occp();
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {
                
                this.root.find('form').validate({
                    rules: {
                        proftitle: {
                            required: true
                        }
                    }  
                });

                ko.applyBindings(this.prof, this.root.find('form')[0]);

            } break;


            case 'occp-selected': {
                this.occpinfo = this.current_event.data;                
            } break;

            case 'occp-unselected': {
                this.occpinfo = null;
            } break;
        }

        return super.on_notify();
    }


    private update_occp(): any {

        if (!this.occpinfo) {
            return Q.reject(false);
        }

        var ds: jx.data.DataSource = new jx.data.DataSource('occp');

        this.root.find('.occp').empty();

        this.root.find('.occp').append($('<i class="fa fa-spin fa-spinner" ></i>'));

        var that = this;

        return ds.fetch_data({
            where: {
                'ID': this.occpinfo['occpid']
            }
        }).then(data => {
            
            this.root.find('.occp').html(_.result(data[0], 'OCCPCONCEPT_EN'));

            that.prof['OCCPID'](that.occpinfo['occpid']);

            this.broadcast({
                action: 'occp-stored',
                data: data[0]
            });
            
            return Q.resolve(true);

        }).fail((err) => {

                toastr.error(JSON.stringify(err));

                return Q.reject(false);
        });

    }


    validate_page(): boolean {

        if (!this.occpinfo) {

            toastr.error('You must select a valid isco occupation')

            return false;
        }

        var ok = this.root.find('form').valid();


        if (ok) {

            this.broadcast({
                action: 'prof-stored',
                data: this.prof
            });

        }


        return ok;
    }

}


class ProfileActivitiesPage extends ProfileWizardPage {

    build_content() {
        return <ProfileActivsExplorer />
    }

}
