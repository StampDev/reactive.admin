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
        name: string,
        surname: string,
        email: string,
        compname: string,
        password: string
    };

    constructor(props: any) {

        super(props);
        
        this.datacontext = {
            name: '',
            surname: '',
            email: '',
            compname: '',
            password:''
        }
    }



    render() {

        var html =
            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>

                    <div>
                        <h1 className="logo-name">HR+</h1>
                    </div>

                    <h2>Stamp HR</h2>
                    
                    <p>Create a new account on Stamp HR and see it in action.</p>

                    <form role="form" className="m-t">

                        <b.FormGroup controlId="register-comp">
                            <b.FormControl type="text" name="comp" required placeholder="Company name" data-bind="textInput:compname"/>
                        </b.FormGroup>

                        <b.FormGroup controlId="register-name">
                            <b.FormControl type="text" name="name" required placeholder="First name" data-bind="textInput:name"/> 
                        </b.FormGroup>

                        <b.FormGroup controlId="register-surname">
                            <b.FormControl type="text" name="surname" required placeholder="Last name" data-bind="textInput:surname"/>
                        </b.FormGroup>

                        <b.FormGroup controlId="login-email">                            
                            <b.FormControl type="email" name="email" required placeholder="Email" data-bind="textInput:email"/>                            
                        </b.FormGroup>

                        <b.FormGroup controlId="login-passw">
                            <b.FormControl type="password" name="password" required placeholder="Password" data-bind="textInput:password"/>                            
                        </b.FormGroup>

                        <div className="form-group">
                            <jx.controls.CheckBox/><span className="m-l-xs">Agree the terms and policy</span> 
                        </div>
                        <button type="button" className="btn btn-primary block full-width m-b"
                            onClick={this.register.bind(this)}
                            >Register</button>
                        <p className="text-muted text-center"><small>Already have an account?</small></p>
                        <a className="btn btn-sm btn-white btn-block" href="/login">Login</a>

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


    register(){

        if (this.root.find('form').valid()) {

            utils.spin(this.root);

            var user = new Backendless.User();
            user['name'] = user.username = this.datacontext.name;
            user.username = this.datacontext.name;
            user.email = this.datacontext.email;
            user.password = this.datacontext.password;
            
            Backendless.UserService.register( user, new Backendless.Async( (rst) =>{
                
                this.create_new_comp().then(()=>{

                    this.app.login(this.datacontext.email, this.datacontext.password)
                        .then( ()=>{

                            this.app.router.navigate('/company/chart');

                         }).fail(err =>{

                             this.error(err);

                             utils.unspin(this.root);

                        });
                    
                }).fail(err =>{

                    toastr.error(JSON.stringify(err));
                    
                }).finally(()=>{

                    utils.unspin(this.root);
                });

            }, ( err)=>{
             
                toastr.error(JSON.stringify(err));

                utils.unspin(this.root);
                   
            }) );
            
        }
    }


    create_new_comp(){
        
        var d = Q.defer();

        var dx = new jx.bx.DataSource('comp');

        var ds = new jx.data.DataSource('comp');
        
        var id = utils.guid();

        ds.dm.createEntity('comp', {
            ID: id,
            COMPNAME: this.datacontext.compname,
            COMPEMAIL: this.datacontext.email,
            COMPCOUNTRY: 'GR',
            COMPADDRESS: ' '            
        });
        
        ds.saveChanges().then(rst =>{

            var usr:any = Backendless.UserService.getCurrentUser();
            usr.compid = id;
            
            Backendless.UserService.update( usr, new Backendless.Async(arg=>{

                this.add_dept(id).then(() => {

                    d.resolve(true);

                });
    
            }, err =>{
                    
                d.reject(err);
                    
            }) );
            
        }).fail( err =>{
            
            d.reject(err);

         });

        return d.promise;
    }    


    private add_dept(compid: string) {

        var d = Q.defer();

        var ds = new jx.data.DataSource('compdept');
        
        var dept = ds.dm.createEntity('compdept', {
            id: utils.guid(),
            compid: compid,
            deptname: 'Main department'
        });
        
        ds.saveChanges().then(() => {

            var usr_ds = new jx.data.DataSource('emp');

            usr_ds.call({
                method: 'invite_new_user',
                params: {
                    usremail: this.datacontext.email,
                    usrname: this.datacontext.name,
                    usrsurname: this.datacontext.surname,
                    usrstatus: 1,
                    compid: this.app.CompId,
                    deptid: _.result(dept, 'id')
                }
            }).then(() => {

                d.resolve(true);

            }).fail(err => {

                toastr.error(JSON.stringify(err));

                d.reject(false);
            });


        }).fail(err => {

            toastr.error(JSON.stringify(err));
        });
        

        return d.promise;

    }

}


