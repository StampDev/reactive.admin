/// <reference path="profiles_datalist.tsx" />
/// <reference path="profile_edit_view.tsx" />
/// <reference path="profiles_new.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import { InsMasterPage, ins } from '../../lib/ins_master_page';
import jx = require('../../../core/lib');
import dl = require('./profiles_datalist');
import ed = require('./profile_edit_view');
import nw = require('./profiles_new');



export class ProfilesMasterPage extends InsMasterPage {
        
    get_page_content() {
        return <ProfilesExplorer />
    }
}



class ProfilesExplorer extends jx.views.ReactiveView {


    render() {
        
        var html =

            <div className="row">

                <div className="col-lg-5 animated fadeInRight">

                    <div className="ibox">

                        <div className="ibox-content">

                            <h1 style={{ display:'inline-block' }}>
                                <i className="fa fa-file-text" style={{ marginRight: 20 }} /> <span>Professional profiles</span>                                
                            </h1>

                            <ProfileExploreActions owner={this} />

                            <br />
                            
                            <hr />

                            <br />

                            <div>
                                <dl.ProfileDatalist owner={this} />
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div className="col-lg-7 auxill-view" style={{ minHeight:900 }}>
                    
                </div>


            </div>            
        return html;
    } 


    on_notify() {


        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {
                
            } break;

            
            case 'edit-profile': {

                this.edit_profile();

            } break;

            
            case 'add-new-profile': {

                this.add_new_profile();

            } break;
        }

        return super.on_notify();

    }


    edit_profile() {

        this.mount_auxil_view(<ed.ProfileEditView id={this.current_event.data} owner={this} />)
        
    }


    add_new_profile() {

        this.mount_auxil_view(<nw.ProfilesAddNew owner={this} />)        
    }


    mount_auxil_view(content:any) {

        var container =
            <div className="ibox">
                <div className="ibox-content animated fadeInRight" style={{ minHeight: 800 }}>  
                    {content}
                </div>
            </div>;
        
        ReactDOM.unmountComponentAtNode(this.root.find('.auxill-view')[0]);


        ReactDOM.render(container, this.root.find('.auxill-view')[0]);
        
        
    }

}


interface ProfileExploreActionsProps extends jx.views.ReactiveViewProps {
}
class ProfileExploreActions extends jx.views.ReactiveView {

    props: ProfileExploreActionsProps;


    render() {

        var html =
            <div className="pull-right" style={{ display:'inline-block' }}>

                <button className="btn btn-lg btn-primary btn-outline" onClick={this.new_edit.bind(this)}><i className="fa fa-plus-circle"></i> new profile</button>

            </div>


        return html;
    }


    new_edit() {

        this.broadcast({
            action: 'add-new-profile'
        })
    }

}


