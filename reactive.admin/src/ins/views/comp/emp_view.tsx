/// <reference path="emp_header_info_view.tsx" />
/// <reference path="../lib/emp_explorer.tsx" />
/// <reference path="emp_personal_info_view.tsx" />
/// <reference path="emp_professional_info_view.tsx" />
// <reference path="../profiles/profile_occptree.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;
import { InsMasterPage, ins } from '../../lib/ins_master_page';
import ui = require('../../../core/ui');
import { OccpTreeView } from '../profiles/profile_occptree';

import { EmpPersonalInfo, EmpPersonalInfoProps } from './emp_personal_info_view'; 
import { EmpsHeaderInfo, EmpsHeaderInfoProps } from './emp_header_info_view'; 
import { EmpProfessionalInfo, EmpProfessionalInfoProps } from './emp_professional_info_view'; 
import edu = require('../comp/emp_edu_view');


export class EmpView extends InsMasterPage {

    get_page_content() {
        return <EmpViewForm start_by_loading={true} />
    }
}

class EmpViewForm extends jx.views.ReactiveEditDataView {

    constructor(props: any) {
        super(props);        
    }


    get_model(): string {
        return 'emp';
    }


    load_data(qry?: jx.data.DataQuery) {
        
        var __id = jx.url.get_param('empid');
        
        var __qry: jx.data.DataQuery = {
            where: {
                id: __id
            },
            expand:['jbr']  
        }
        
        return this.ds.exec_query(__qry)
    }


    render() {

        var profInfo = null;

        if (this.state.loading) {
            return <i className="fa fa-spin fa-spinner fa-2x"></i>
        }

        var emp = this.ds.findkey(jx.url.get_param('empid'));
        

        var html =
            <b.Row >
                <b.Col lg={12} className="animated fadeInRight" style={{ paddingLeft: 20, paddingRight: 20 }} >

                    <jx.views.IBox>

                        <div style={{ minHeight:700 }}>
                            
                            <b.Row>

                                <b.Col lg={5}>

                                    <EmpsHeaderInfo owner={this} emp={emp} start_by_loading={true} />

                                    <hr />

                                    <EmpPersonalInfo owner={this} id={_.result(emp, 'usrid') } start_by_loading={true} />

                                    <hr />

                                    <edu.EmpEduView owner={this} emp={emp} />

                                </b.Col>

                                <b.Col lg={7}>

                                    <EmpProfessionalInfo emp={emp} />

                                </b.Col>
                                
                            </b.Row>

                        </div>
                        
                    </jx.views.IBox>
                    
                </b.Col>
                
            </b.Row>;


        return html;
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                this.root.find('.ibox-content').css('min-height', '700px');

                if (this.state.loading) {
                    
                    this.load_data().then(() => {

                        utils.unspin(this.root);

                        this.broadcast({
                            action: 'on-custom-content',
                            data: <FindEmployeeCombo owner={this} />
                        });

                        this.newState({
                            loading: false
                        });

                    }).fail((err) => {

                        toastr.error(JSON.stringify(err));
                    });

                }

            } break;
        }


        return super.on_notify();
    }
}


interface FindEmployeeComboProps extends jx.views.ReactiveViewProps {
}
class FindEmployeeCombo extends jx.views.ReactiveView {

    props: FindEmployeeComboProps;


    render() {

        var html =
            <div>

                <b.Col lg={3} style={{ paddingLeft: 0 }}>
                    <h2>
                        Find employee
                        <i className="fa fa-search m-l-xs" aria-hidden="true"></i>                        
                    </h2>
                </b.Col>

                <b.Col lg={8} className="m-t-md">
                    <select className="form-control emps-select">
                        <option></option>                   
                    </select>
                </b.Col>

            </div>

        return html;
    }

    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {


                this.root.find('.emps-select').on('change', e => {
                    var empid = this.root.find('.emps-select').val();
                    var url = '/company/employees/employee/{0}'.format(empid);
                    this.app.router.navigate(url);
                });


                var ds = new jx.data.DataSource('emp_usr_view');
                
                ds.exec_query({
                    where: {
                        compid: this.app.CompId
                    }
                }).then((list) => {
                    
                   var options = _.map(list, d => {

                        return {
                            id: _.result(d, 'empid'),
                            text: '{0} {1}'.format(_.result(d, 'usrname'), _.result(d, 'usrsurname'))
                        }
                    });

                   this.root.find('select')['select2']({
                       data: options,
                       placeholder: "Select an employee",                                             
                   });

                });
                
            } break;

        }

        return super.on_notify();
    }
}


