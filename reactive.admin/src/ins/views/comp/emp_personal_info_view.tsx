// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;

export interface EmpPersonalInfoProps extends jx.views.ReactiveViewProps {
    usr: any
}
interface EmpPersonalInfoState extends jx.views.ReactiveViewState {
    usr: any,
    datamode?: DataMode
}
export class EmpPersonalInfo extends jx.views.ReactiveView {

    bound: any;
    state: EmpPersonalInfoState;
    props: EmpPersonalInfoProps;

    constructor(props: EmpPersonalInfoProps) {
        super(props);
        this.state.datamode = DataMode.view;
        this.state.usr = props.usr;
    }

    
    render() {
        
        var viewform = <EmpViewForm owner={this} usr={this.state.usr} />;

        if (this.state.datamode === DataMode.edit) {
            viewform = <EmpViewFormEdit owner={this} usr={this.state.usr} />;
        }


        var view_visible = this.state.datamode === DataMode.view ? '' : 'hidden';
        var edit_visible = this.state.datamode === DataMode.edit ? '' : 'hidden';


        var html =
            <div className="row">
                <div className="col-lg-12">

                    <div className="m-b-md">
                        <h2>

                            <span className="text-success">Personal information</span>

                            <a  href="#" className={"btn btn-primary btn-xs view-mode m-l-sm btn-outline {0} ".format(view_visible) }
                                onClick={this.toggle_edit.bind(this) } >
                                <span><i className="fa fa-edit"></i> edit</span>
                            </a>

                            <a  href="#" className={"btn btn-success btn-xs edit-mode m-l-sm m-r-sm  btn-outline {0}".format(edit_visible) }
                                onClick={this.save.bind(this) } >
                                <span><i className="fa fa-check"></i> save</span>
                            </a>

                            <a  href="#" className={"btn btn-warning btn-xs edit-mode btn-outline {0}".format(edit_visible) }
                                onClick={this.cancel.bind(this) } >
                                <span><i className="fa fa-times"></i> cancel</span>
                            </a>

                        </h2>
                    </div>

                    <b.Col lg={12}>
                        {viewform}
                    </b.Col>


                </div>
            </div>
        
        return html;

    }


    save(e: Event) {   

        if (!this.root.find('form').valid()) {
            return;
        }

        utils.spin(this.root);
        
        bx.fetchKey(Backendless.User, _.result(this.state.usr, utils.key))
            .then(usr => {

                var unbound = ko['mapping'].toJS(this.bound);

                var __usr = _.extend(usr, unbound);

                Backendless.UserService.update(__usr, new Backendless.Async(rst => {

                    this.state.usr = __usr;

                    this.broadcast({
                        action: 'update-user',
                        data: __usr
                    });

                    this.toggle_edit();

                }, err => {

                    toastr.error(JSON.stringify(err));

                }))

            })        
        .finally(() => {

            utils.unspin(this.root);
        });
    }


    cancel(e?: Event) {

        //this.cancel_data();

        this.toggle_edit(e);
    }
    

    toggle_edit(e?: Event) {

        if (e) {
            e.preventDefault();
        }

        var __datamode = this.state.datamode === DataMode.edit ? DataMode.view : DataMode.edit;

        this.newState({
            datamode: __datamode
        }, () => {

            if (this.state.datamode === DataMode.edit) {

                this.bind_controls();
            }

        })
        
        return false;
    }


    bind_controls() {

        this.bound = ko['mapping'].fromJS(this.state.usr);

        ko.applyBindings(this.bound, this.root.find('.edit-form')[0]);

        var options = {
            rules: {
                email: {                    
                    email: true
                }
            },
            errorPlacement: (err, el) => {
                $(el).closest('.txt-root').find('.error-place').empty();
                $(el).closest('.txt-root').find('.error-place').append(err);
            }
        };

        this.root.find('form').validate(options);

        this.root.find('form .control-label').css('float', 'left');//.removeClass('col-sm-4').addClass('col-sm-2');
    }
    
}




interface EmpViewFormProps extends jx.views.ReactiveViewProps {
    usr: breeze.Entity
}
interface EmpViewFormState extends jx.views.ReactiveViewState {
    usr: breeze.Entity
}
class EmpViewForm extends jx.views.ReactiveView {

    constructor(props: EmpViewFormProps) {
        super(props);
        this.state.usr = props.usr;
    }

    props: EmpViewFormProps;
    state: EmpViewFormState;


    get item(): breeze.Entity {
        return this.state.usr;
    }


    render() {

        var html =
            <div className="row emp-viewform" style={{ fontSize:15 }}>
                <div className="col-lg-9">
                    <dl className="dl-horizontal">
                        <dt>User name: </dt> <dd>{"{0} {1}".format(_.result(this.item, 'name'), _.result(this.item, 'surname')) }</dd>
                        <dt>Email: </dt> <dd>{_.result(this.item, 'email') }</dd>
                        <br />
                        <dt><i className="fa fa-linkedin-square m-r-xs"></i></dt> <dd><a href="#"> Linkedin url</a> </dd>
                        <dt><i className="fa fa-google-plus-square m-r-xs"></i></dt> <dd><a href="#"> Google+ url</a> </dd>
                        <dt><i className="fa fa-facebook-square m-r-xs"></i></dt> <dd><a href="#"> Facebook url</a> </dd>                        
                    </dl>
                </div>
                <div className="col-lg-3" id="cluster_info">
                    <dl className="dl-horizontal">                        
                    </dl>
                </div>
            </div>


        return html;

    }
    
}



class EmpViewFormEdit extends EmpViewForm {

    render() {

        var html =
            <b.Form horizontal className="edit-form">

                <dl className="dl-horizontal hidden">
                    <dt style={{ textAlign: 'left', marginLeft: 60, width: 70 }}>Status: </dt>
                    <dd style={{ marginLeft: 0 }} ><span className="label label-primary">Active</span></dd>
                </dl>

                <b.Col lg={12} className="">
                    
                    <TextInput
                        owner={this}
                        title="Name" datamode={DataMode.edit}
                        icon="fa-user" property="name" required={true}
                        type="text" placeholder="User name"/>


                    <TextInput
                        owner={this}
                        title="Surname" datamode={DataMode.edit}
                        icon="fa-user" property="surname" required={true}
                        type="text" placeholder="User surname"/>


                    <TextInput
                        owner={this}  datamode={DataMode.edit}
                        title="Email" property="email"
                        icon="fa-envelope" required={true}
                        type="email" placeholder="Email"/>

                </b.Col>


                <b.Col lg={12} className="" style={{ marginTop: 40 }}>

                    <SocialLink owner={this}  datamode={DataMode.edit}
                        title="Linkedin" property="usrlinkedin"
                        icon="fa-linkedin" placeholder="Linkedin url"
                        type="text" usr={this.item} />

                    <SocialLink owner={this} datamode={DataMode.edit}
                        title="Google+" property="usrgoogleplus"
                        icon="fa-google-plus"  usr={this.item}
                        type="text" placeholder="Google+ url"/>

                    <SocialLink owner={this}  datamode={DataMode.edit}
                        title="Facebook" property="usrfacebook"
                        icon="fa-facebook"  usr={this.item}
                        type="text" placeholder="Facebook url"/>

                </b.Col>
            </b.Form>;


        return html;

    }
}




enum DataMode { edit, view }
interface TextInputProps extends jx.views.ReactiveViewProps {
    title: string,
    icon: string,
    type: string,
    property: string,
    datamode?: DataMode,
    placeholder?: string,
    required?: boolean
}
interface TextInputState extends jx.views.ReactiveViewState {
    datamode?: DataMode
}
class TextInput extends jx.views.ReactiveView {

    constructor(props: TextInputProps) {

        super(props);

        this.state.datamode = this.props.datamode;

        if (this.state.datamode === undefined) {
            this.state.datamode = DataMode.view
        }
    }

    props: TextInputProps;
    state: TextInputState;

    render() {

        var view_visible = this.state.datamode === DataMode.view ? '' : 'hidden';
        var edit_visible = this.state.datamode === DataMode.edit ? '' : 'hidden';

        var html =
            <b.FormGroup controlId="formHorizontalEmail" className="txt-root">

                <b.Col componentClass={b.ControlLabel} sm={2}>
                    {"{0}:".format(this.props.title)}
                </b.Col>

                <b.Col sm={10}>

                    <p className={"view-mode {0}".format(view_visible) }  style={{ marginTop: 6, marginBottom: 10, fontSize: 15, fontWeight: 300 }}>
                        <i className={"fa {0} m-r-xs".format(this.props.icon) }></i>
                        <span data-bind={"text:{0}".format(this.props.property)} >{this.props.title}</span>
                    </p>

                    <div className={"input-group edit-mode {0}".format(edit_visible) } style={{ margin: 0 }}>
                        <span className="input-group-addon">
                            <i className={"fa {0} m-r-xs".format(this.props.icon) }></i>
                        </span>
                        <input type={this.props.type} placeholder={this.props.placeholder} name={this.props.property} className="form-control" required={this.props.required} data-bind={"textInput:{0}".format(this.props.property) } />
                    </div>
                    <span className="error-place"></span>
                </b.Col>

            </b.FormGroup>

        return html;
    }


    componentWillReceiveProps(nextProps: TextInputProps) {
        super.componentWillReceiveProps(nextProps);
        this.state.datamode = nextProps.datamode;
    }

}



interface SocialLinkProps extends TextInputProps {
    usr: breeze.Entity 
}
class SocialLink extends TextInput {

    props: SocialLinkProps;
    
    render() {

        var readonly = <span data-bind={"text:{0}".format(this.props.property) }>{_.result(this.props.usr, this.props.property)}</span>;

        var val = _.result(this.props.usr, this.props.property);

        if (!val) {
            readonly = <span>{this.props.placeholder}</span>;
        }

        var view_visible = this.state.datamode === DataMode.view ? '' : 'hidden';
        var edit_visible = this.state.datamode === DataMode.edit ? '' : 'hidden';

        var html =
            <b.FormGroup controlId="formHorizontalEmail">
                
                <b.Col sm={12}>

                    <p className={"view-mode {0} ".format(view_visible) }  style={{ marginTop: 6, marginBottom: 10, fontSize: 15, fontWeight: 300 }}>
                        <i className={"fa {0} m-r-xs".format(this.props.icon) }></i>
                        {readonly}
                    </p>

                    <div className={"input-group edit-mode {0}".format(edit_visible) } style={{ margin: 0 }}>
                        <span className="input-group-addon">
                            <i className={"fa {0} m-r-xs".format(this.props.icon) }></i>
                        </span>
                        <input type={this.props.type} className="form-control" placeholder={this.props.placeholder} data-bind={"textInput:{0}".format(this.props.property) } />
                    </div>

                </b.Col>

            </b.FormGroup>


        return html;

    }
}