// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;

export interface EmpPersonalInfoProps extends jx.views.ReactiveEditDataViewProps {    
}
interface EmpPersonalInfoState extends jx.views.ReactiveEditDataViewState {
    datamode?: DataMode
}
export class EmpPersonalInfo extends jx.views.ReactiveEditDataView {


    state: EmpPersonalInfoState;
    props: EmpPersonalInfoProps;

    constructor(props: EmpPersonalInfoProps) {
        super(props);
        this.state.datamode = DataMode.view;
    }


    get_model(): string {
        return 'usr';
    }
    

    render() {

        if (this.state.loading) {
            return <i className="fa fa-spin fa-spinner"></i>
        }

        var viewform = <EmpViewForm owner={this} usr={this.item} />;

        if (this.state.datamode === DataMode.edit) {
            viewform = <EmpViewFormEdit owner={this} usr={this.item} />;
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

        if (!this.ds.dm.hasChanges()) {
            this.toggle_edit(e);
            return;
        }

        utils.spin(this.root);
        
        var fields = this.item.entityAspect.originalValues;

        var update = _.filter(Object.keys(fields), f => {
            return f === "usrname" || f === "usrsurname"
        }).length > 0;

        this.save_data().then(() => {

            toastr.success('Data saved successfully');

            this.toggle_edit(e);

            if (update) {
                this.broadcast({
                    action: 'update-user',
                    data: this.item
                });
            }

        }).finally(() => {

            utils.unspin(this.root);
        });
    }


    cancel(e: Event) {

        this.cancel_data();

        this.toggle_edit(e);
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_data_loaded: {
                
            } break;
                

        }

        return super.on_notify();
    }


    toggle_edit(e: Event) {

        if (e) {
            e.preventDefault();
        }

        var __datamode = this.state.datamode === DataMode.edit ? DataMode.view : DataMode.edit;

        this.newState({
            datamode: __datamode
        }, () => {

            if (this.state.datamode === DataMode.edit) {
                ko.applyBindings(this.item, this.root.find('.edit-form')[0]);
            }

        })
        
        return false;
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
                        <dt>User name: </dt> <dd>{"{0} {1}".format(_.result(this.item, 'usrname'), _.result(this.item, 'usrsurname')) }</dd>
                        <dt>Email: </dt> <dd>{_.result(this.item, 'usremail') }</dd>                        
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
                <b.Col lg={6} className="">

                    <dl className="dl-horizontal">
                        <dt style={{ textAlign: 'left', marginLeft: 60, width: 70 }}>Status: </dt>
                        <dd style={{ marginLeft: 0 }} ><span className="label label-primary">Active</span></dd>
                    </dl>

                    <TextInput
                        owner={this}
                        title="Name" datamode={DataMode.edit}
                        icon="fa-user" property="usrname"
                        type="text" placeholder="User name"/>


                    <TextInput
                        owner={this}
                        title="Surname" datamode={DataMode.edit}
                        icon="fa-user" property="usrsurname"
                        type="text" placeholder="User surname"/>


                    <TextInput
                        owner={this}  datamode={DataMode.edit}
                        title="Email" property="usremail"
                        icon="fa-envelope"
                        type="email" placeholder="Email"/>

                </b.Col>


                <b.Col lg={6} className="" style={{ marginTop: 40 }}>

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
    placeholder?: string
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
            <b.FormGroup controlId="formHorizontalEmail">

                <b.Col componentClass={b.ControlLabel} sm={4}>
                    {"{0}:".format(this.props.title)}
                </b.Col>

                <b.Col sm={8}>

                    <p className={"view-mode {0}".format(view_visible) }  style={{ marginTop: 6, marginBottom: 10, fontSize: 15, fontWeight: 300 }}>
                        <i className={"fa {0} m-r-xs".format(this.props.icon) }></i>
                        <span data-bind={"text:{0}".format(this.props.property)} >{this.props.title}</span>
                    </p>

                    <div className={"input-group edit-mode {0}".format(edit_visible) } style={{ margin: 0 }}>
                        <span className="input-group-addon">
                            <i className={"fa {0} m-r-xs".format(this.props.icon) }></i>
                        </span>
                        <input type={this.props.type} placeholder={this.props.placeholder} className="form-control" data-bind={"textInput:{0}".format(this.props.property) } />
                    </div>

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