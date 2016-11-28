/// <reference path="../lib/dataform.tsx" />
/// <reference path="emps_view_card.tsx" />
/// <reference path="../../../core/ui.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');

import rb = require('react-bootstrap');
var b: any = rb;
import crd = require('./emps_view_card');
import ui = require('../../../core/ui');

import {DataForm, DataFormProps, DataMode, ActionMode} from '../lib/dataform';


export enum OpenMode { ADD, EDIT }

interface EmpsViewState extends jx.views.ReactiveViewState {
   
}
export interface EmpsViewProps extends jx.views.ReactiveViewProps {    
    id?:any
}
export class EmpsView extends ui.TypeView<EmpsViewProps, EmpsViewState> {
    

    get openmode(): OpenMode {
        return this.props.id ? OpenMode.EDIT : OpenMode.ADD;
    }

    
    render() {

        var ui = this.get_ui_template();

        var html =
            <div className="emp-view" style={{ minHeight: 650 }}>

                <h1 className={ui.title_color} style={{ marginBottom: 30 }}>                    
                    {ui.icon} {ui.title} {ui.buttons}                    
                </h1>
                
                <hr />

                {ui.header_info}
                
                {ui.content_per_mode}

            </div>

        return html;
    }


    get_ui_template() {

        var dataform = <EmployeeDetails Id={this.props.id}
            header={"Details"}
            model="usrr" owner={this}
            actionmode={ActionMode.btnDefault} />                


        var ui = {

            icon: this.openmode === OpenMode.ADD ? <i className="fa fa-user-o" style={{ marginRight: 10 }}></i>
                : <i className="fa fa-pencil-square" style={{ marginRight: 10 }}></i>,

            title_color: this.openmode != OpenMode.ADD? 'text-success':'text-info',

            title: this.openmode === OpenMode.ADD ? 'Add new employee' : 'Edit new employee',
            

            delete_button: <rb.Button bsStyle="warning" bsSize="small"
                className="btn-outline pull-right">
                <i className="fa fa-trash text-warning"></i>
            </rb.Button>,

            separator: <hr />,

            content_per_mode: dataform, 

            header_info: (this.state.loading || this.openmode === OpenMode.ADD) ? null
                : <crd.EmpsHeaderInfo owner={this} />
        }
        

        if (this.openmode === OpenMode.ADD) {            
            ui.delete_button = null;
        }
        
        if (this.openmode === OpenMode.EDIT) {            
        }
        
        return ui;
    }


}



class EmployeeDetails extends DataForm {


    insert_new() {

        var values = _.extend(super.insert_new(),
        {
            COMPID: this.app.currentUser['compid'],
            USRRPASSWORD: '123456789',
            USRRCREATEDATE: moment().toISOString(),
            USRRTYPE: 1,
            USRRSTATUS: 0
        });

        return values;
    }


    get_uiContent() {

        var __ui: any = this.get_schema_ui();
        
        var html =
            <b.Row style={{ marginBottom: 30 }}>
                <b.Col lg={12} >
                    
                    <b.Col lg={6}>
                        <h3>Name</h3>
                        {__ui.name}
                    </b.Col>

                    <b.Col lg={6}>
                        <h3>Surname</h3>
                        {__ui.surname}
                    </b.Col>

                </b.Col >

                <b.Col lg={12} >

                    <b.Col lg={6}>
                        <h3>Email</h3>
                        {__ui.email}
                    </b.Col>

                    <b.Col lg={6}>
                        <h3>Phone</h3>
                        {__ui.phone}
                    </b.Col>

                </b.Col >

                <b.Col lg={12} >
                    <b.Col lg={12} >
                        <h3>About</h3>
                        {__ui.aboutme}
                    </b.Col >
                </b.Col >

                <br />


            </b.Row>;


        return html;

    }


    private get_schema_ui() {

        var readonly = this.state.datamode === DataMode.ViewMode;

        var __ui: any = {

            name: <Text owner={this} bind="USRRNAME" icon="fa fa-user" />,

            surname: <Text owner={this} bind="USRRSURNAME" icon="fa fa-user" />,
            
            email: <Text owner={this} bind="USRREMAIL" icon="fa fa-email" />,

            phone: <Text owner={this}  placeholder="Phone" bind="USRRPHONE"/>,

            aboutme: <ui.TextArea placeholder="About" />,
            
        };
 
        return __ui;
    }

}


export interface TextState extends ui.BtProps {
    readonly: boolean
}
export interface TextProps extends ui.BtProps {
    owner: any,
    label?: any,
    item?: any,
    bind?: any,
    icon?: string,
    placeholder?: any,
    cls?: string,
    type?: string,
    readonly?: boolean,
    style?: React.CSSProperties,
    required?: boolean,
    err_mess?: string
}
export class Text extends ui.TypeView<TextProps, TextState>{

    constructor(props: TextProps) {
        super(props);
        this.state.readonly = this.props.readonly;
    }

    render() {

        var ui: any = this.get_ui_template();
        
        var html =
            <b.FormGroup>
                {ui.content}
                <span className="errors"></span>
            </b.FormGroup>

        return html;
    }


    componentWillReceiveProps(next: TextProps) {

        super.componentWillReceiveProps(next);

        this.state.readonly = next.readonly;
    }


    get_ui_template() {

        var ui: any = {};

        var _props = this.props;

        var bind = this.props.bind ? 'textInput:{0}'.format(this.props.bind) : null;

        if (this.state.readonly) {

            bind = 'text:{0}'.format(this.props.bind);
            
            ui.content = <h2 data-bind={bind}></h2>;

        } else {

            ui.input = <b.FormControl bsSize="large" data-bind={bind} {..._props}/>;

            if (this.props.icon) {
                ui.content = <b.InputGroup>
                    <b.InputGroup.Addon>
                        <i className={"{0}".format(this.props.icon) }></i>
                    </b.InputGroup.Addon>
                    {ui.input}
                </b.InputGroup>
            } else {

                ui.content = ui.input;
            }
        }
        
        return ui;

    }
}

