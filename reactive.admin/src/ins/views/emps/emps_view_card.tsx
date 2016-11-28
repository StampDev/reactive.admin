// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import ui = require('../../../core/ui');

import rb = require('react-bootstrap');
var b: any = rb;


interface EmpsViewCardState extends ui.ViewState {    
}
export interface EmployeeCardProps extends ui.ViewProps {
    usrr: breeze.Entity
}
export class EmployeeCard extends ui.TypeView<EmployeeCardProps, EmpsViewCardState> {
    

    constructor(props: EmployeeCardProps) {
        super(props);
        _.extend(this.state, props);
    }

    componentWillReceiveProps(next: EmployeeCardProps) {
        super.componentWillReceiveProps(next);
        _.extend(this.state, next);
    }


    render() {

        var __ui: any = this.get_ui_template();
        
        var html =
            <b.Row style={{ marginBottom: 30 }}>

                <form>

                    <b.Col lg={12} >

                        <h1>Profile</h1>

                        <hr />

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
                    
                </form>

                

            </b.Row>;

        return html;
    }


    get_ui_template() {
                
        var __ui = {

            name: <Text owner={this} field="USRRNAME" item={this.props.usrr} icon="fa fa-user" />,

            surname: <Text owner={this} field="USRRSURNAME" item={this.props.usrr} icon="fa fa-user" />,

            email: <Text owner={this} field="USRREMAIL" item={this.props.usrr} icon="fa fa-envelope-o" />,

            surname1: <b.FormGroup>
                <b.InputGroup>
                    <b.InputGroup.Addon>
                        <i className="fa fa-user"></i>
                    </b.InputGroup.Addon>
                    <b.FormControl name="surname" placeholder="Surname" data-bind="textInput:USRRSURNAME"/>
                </b.InputGroup>
            </b.FormGroup>, 

            email1: <b.FormGroup>
                        <b.InputGroup>
                            <b.InputGroup.Addon>
                                <i className="fa fa-envelope-o"></i>
                            </b.InputGroup.Addon>
                            <b.FormControl type="email" required placeholder="Email" data-bind="textInput:USRREMAIL" />
                    </b.InputGroup>
                </b.FormGroup>,

            phone: <ui.TextIcon icon="fa-phone" placeholder="Phone" data-bind="textInput:USRRPHONE"/>,

            aboutme: <ui.TextArea placeholder="About" />,
            
        }

        return __ui;
    }


    on_notify() {


        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {
                
            } break;

        }


        return super.on_notify();
    }


    bind_controls() {

        ko.applyBindings(this.props.usrr, this.root.find('form')[0]);

        this.root.find('form').validate();
    }

}


export interface EmpsHeaderInfoProps extends ui.BtProps {
}
export class EmpsHeaderInfo extends ui.TypeView<EmpsHeaderInfoProps, ui.BtState>{

    render() {

        var html =
            <div className="row" style={{ marginBottom: 30 }} >
                <div className="col-md-6">
                    <div className="profile-image">
                        <img src="/ins/img/a4.jpg" className="img-circle circle-border m-b-md" alt="profile" />
                    </div>
                    <div className="profile-info">
                        <div className="">
                            <div>
                                <h2 className="no-margins">
                                    Alex Smith
                                </h2>
                                <h4>Founder of Groupeq</h4>
                                <small>
                                    There are many variations of passages of Lorem Ipsum available, but the majority
                                    have suffered alteration in some form Ipsum available.
                                </small>
                            </div>
                        </div>
                    </div>
                    
                </div>

                <div className="col-md-3">
                    <table className="table small m-b-xs">
                        <tbody>
                            <tr>
                                <td>
                                    <strong>142</strong> Projects
                                </td>
                                <td>
                                    <strong>22</strong> Followers
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>61</strong> Comments
                                </td>
                                <td>
                                    <strong>54</strong> Articles
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>154</strong> Tags
                                </td>
                                <td>
                                    <strong>32</strong> Friends
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <br />

            </div>;


        return html;

    }

}



export interface TextState extends ui.BtProps {
    
}
export interface TextProps extends ui.BtProps {
    owner: any,
    label?: any,
    item?: any,
    field?: any,
    icon?: string,    
    placeholder?: any,
    cls?: string,
    style?: React.CSSProperties,
    required?: boolean,
    err_mess?: string
}
export class Text extends ui.TypeView<TextProps, TextState>{

    render() {

        var ui: any = this.get_ui_template();

        ui.input = <b.FormControl required={this.props.required}  placeholder={this.props.placeholder} {...this.props}/>;
        
        var html =
            <b.FormGroup>                               
                {ui.content}
                <span className="errors"></span>             
            </b.FormGroup>
        
        return html;
    }

    get_ui_template() {

        var ui: any = {};
        
        ui.input = <b.FormControl required={this.props.required}  placeholder={this.props.placeholder} {...this.props}/>;

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
        
        return ui;

    }
}

