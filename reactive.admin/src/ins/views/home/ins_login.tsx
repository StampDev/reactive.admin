/// <reference path="../../../core/jx__.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');

import rb = require('react-bootstrap');
var b: any = rb;


interface InsLoginPageState extends jx.views.ReactViewState {

    txt_login: {
        validationState?: string,
        controlLabel?: string
    },
    txt_password: {
        validationState?: string,
        controlLabel?: string
    }
}




export class InsLoginPage extends jx.views.ReactView {

    state: InsLoginPageState;

    datacontext: {
        email: string,
        password: string
    };

    constructor(props: any) {

        super(props);

        this.state = {
            txt_login: {
                
            },
            txt_password: {
            }
        }

        this.datacontext = {
            email: '',
            password:''
        }
    }



    render() {

        var html =
            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>

                    <div>
                        <h1 className="logo-name" style={{ marginLeft:-5 }}>HR+</h1>
                    </div>

                    <h3>Stamp HR</h3>

                    <p className="hidden">
                        Perfectly designed and precisely prepared admin theme with over 50 pages with extra new web app views.                        
                    </p>

                    <p>Login in and see Stamp HR in action.</p>

                    <form role="form" className="m-t">

                        <b.FormGroup controlId="login-email">                            
                            <b.FormControl type="email" name="email" required placeholder="Email" data-bind="textInput:email"/>                            
                        </b.FormGroup>

                        <b.FormGroup controlId="login-passw">
                            <b.FormControl type="password" name="password" required placeholder="Password" data-bind="textInput:password"/>                            
                        </b.FormGroup>

                        <button className="btn btn-primary block full-width m-b" type="button"
                            onClick={this.login.bind(this)}
                            >Login</button>
                        <a href="#"><small>Forgot password?</small></a>

                        <p className="text-muted text-center"><small>Do not have an account?</small></p>

                        <a href="/register" className="btn btn-sm btn-white btn-block">Create an account</a>

                    </form>
                    
                    <p className="m-t"> <small>stamp dev © 2017</small> </p>

                </div>
            </div>



        return html;

    }

    componentDidMount() {

        super.componentDidMount();

        this.root.find('.form-group').css('margin-bottom', '10px');

        this.root.find('form').validate();

        ko.applyBindings(this.datacontext, this.root.find('form')[0]);
    }


    login() {

        if (this.root.find('form').valid()) {

            utils.spin(this.root);

            this.app.login(this.datacontext.email, this.datacontext.password)
                .then(() => {
                    
                    this.app.router.navigate('/');

                }).fail(err => {

                    toastr.error(JSON.stringify(err));

                }).finally(() => {

                    utils.unspin(this.root);

                });


        }
        
    }
}