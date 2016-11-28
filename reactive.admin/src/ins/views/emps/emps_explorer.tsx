/// <reference path="emps_datalist.tsx" />
/// <reference path="emps_view.tsx" />
/// <reference path="emps_invit.tsx" />

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import { InsMasterPage, ins } from '../../lib/ins_master_page';
import rb = require('react-bootstrap');
var b: any = rb;

import inv = require('./emps_invit');


import { EmpsDatalist } from './emps_datalist';
import ep = require('./emps_view');


export class EmpsExplorer extends InsMasterPage {
    
    get_page_content() {
        return <Explorer />
    }
    
}


class Explorer extends jx.views.ReactiveView {
        
    render() {
                
        
        var html =
            <b.Row>
                <b.Col lg={5} className="animated fadeInRight"
                    style={{ paddingLeft: 20, paddingRight: 20 }}>

                    <div className="ibox">
                        <div className="ibox-content">

                            <h1 style={{ display: 'inline-block' }}>
                                <i className="fa fa-user" style={{ marginRight: 20 }} /> <span>Employees</span>
                            </h1>

                            <EmpsExploreActions owner={this} />

                            <hr />

                            <EmpsDatalist owner={this} model="usrr"
                                row_count={true}
                                allow_delete_row={true}
                                allow_edit_row={true}                                
                            />
                            
                        </div>
                    </div>                    
                </b.Col>

                <b.Col lg={7} className="auxill-view" >

                </b.Col>
                
            </b.Row>;

        return html;
    }


    on_notify() {
        
        switch (this.current_event.action) {

            case "add-new-employee":{
                    this.add_new_emp();
            } break;    

            case jx.forms.actions.EDIT_ROW: {

                this.edit_emp();

            } break;
        }        

        return super.on_notify();
    }


    add_new_emp() {

        var view = <inv.EmpsInvitExplorer owner={this} />;

        this.mount_auxil_view(view);
    }


    edit_emp() {

        var view = <ep.EmpsView owner={this} id={this.current_event.data} />;

        this.mount_auxil_view(view);
    }



    mount_auxil_view(content: any) {

        var container =
            <div className="ibox">
                <div className="ibox-content animated fadeInRight" style={{ minHeight: 400 }}>
                    {content}
                </div>
            </div>;

        ReactDOM.unmountComponentAtNode(this.root.find('.auxill-view')[0]);


        ReactDOM.render(container, this.root.find('.auxill-view')[0]);


    }
}


interface EmpsExploreActionsProps extends jx.views.ReactiveViewProps {
}
class EmpsExploreActions extends jx.views.ReactiveView {

    props: EmpsExploreActionsProps;


    render() {

        var html =
            <div className="pull-right" style={{ display: 'inline-block' }}>
                <button className="btn btn-lg btn-primary btn-outline" onClick={this.new_edit.bind(this) }><i className="fa fa-plus-circle"></i> add employees</button>
            </div>


        return html;
    }


    new_edit() {

        this.props.owner.notify({
            action: 'add-new-employee'
        })
    }

}


