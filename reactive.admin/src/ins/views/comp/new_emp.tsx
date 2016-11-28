// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;


export interface NewEmployeeViewProps extends jx.views.ReactiveViewProps {
    deptid: string,
    modal: jx.modal.Modal
}
export class NewEmployeeView extends jx.views.ReactiveView {

    props: NewEmployeeViewProps;

    private active_tab: number;

    constructor(props: NewEmployeeViewProps) {

        super(props);

        this.active_tab = 1;

        this.props.modal.save = () => {
            this.on_save().then(() => {
                this.props.modal.close();
            });
        }
    }


    render() {

        var tabs: TabItem[] = [
            {
                title: 'Invite by email',
                content: () => {

                    var html =
                        <div data-tab={1} >
                            <InvitationMail />
                        </div>;

                    return html;
                }
            },
            {
                title: 'Register new user',
                content: () => {

                    var html =
                        <div data-tab={2} >
                            <RegisterEmp deptid={this.props.deptid} />
                        </div>;

                    return html;

                }
            }
        ];

        var html =
            <b.Row style={{ 'background-color': '#ffffff', height: 365 }}>

                <b.Col lg={12} className="p-sm register-form">

                    <RegisterEmp deptid={this.props.deptid} />
                    
                </b.Col>

            </b.Row>


        return html;
    }


    on_tabchange(tab: number) {
        this.active_tab = tab;
    }


    on_save(): Q.Promise<any> {

        var $form = this.root.find('.register-form form');

        if (!$form.valid()) {

            return Q.reject(false);
        }

        return this.invite_usr({
            usremail: $form.find('[name="usremail"]').val(),
            usrname: $form.find('[name="usrname"]').val(),
            usrsurname: $form.find('[name="usrsurname"]').val(),
            usrstatus: jx.constants.data.USRSTATUS.Pendning
        });

    }


    invite_usr(args: {        
        usremail: string,
        usrname?: string,
        usrsurname?: string,
        usrstatus?: number
    }) {

        utils.spin(this.root);

        var d = Q.defer();

        var user = new Backendless.User();
        user['name'] = args.usrname;
        user.username = args.usrname;
        user['usersurname'] = args.usrname;
        user['usrstatus'] = 1;
        user['compid'] = this.app.CompId;
        user.email = args.usremail;
        user.password = '1234567890';

        Backendless.UserService.register(user, new Backendless.Async(rst => {



            var qry = new Backendless.DataQuery();
            qry.condition = "email='{0}'".format(args.usremail);

            Backendless.Data.of(Backendless.User).find(qry, new Backendless.Async(rst => {

                var emp = {
                    ___class: 'emp',
                    usrid: rst['data'][0]['objectId'],
                    empemail: args.usremail,
                    compid: this.app.CompId,
                    deptid: this.props.deptid
                }
                

                Backendless.Persistence.of('emp').save(emp,

                    new Backendless.Async(rst => {

                        toastr.success('Employee successfully invited');

                        d.resolve(true);

                    }, err => {

                        toastr.error(JSON.stringify(err));
                    }));


            }, err => {


            }));
            
        }, err => {

            toastr.error(JSON.stringify(err));

        }));


        return d.promise;
    }
    

    register_user() {

        return Q.resolve(true);
    }
}



interface TabItem {
    title: string,
    content: () => any
}
interface TabControlProps extends jx.views.ReactiveViewProps {
    tabs: TabItem[],
    on_tabchange?: (tabindex?: number) => any
}
class TabControl extends jx.views.ReactiveView {

    props: TabControlProps;

    render() {

        var index = 1;

        var menus = [];
        var panes = [];

        _.each(this.props.tabs, tab => {

            var id = utils.guid();
            var tabindex = index++;

            var active = tabindex === 1 ? 'active' : '';
            var href = 'tab-{0}'.format(id);

            var li =
                <li role="presentation" className={active}>
                    <a href={'#' + href} role="tab" data-toggle="tab" data-tabindex={tabindex}>
                        {tab.title}
                    </a>
                </li>;

            menus.push(li);

            var pane =
                <div role="tabpanel" id={href} className={"tab-pane {0}".format(active) } >
                    {tab.content() }
                </div>;

            panes.push(pane);
        });


        var html =
            <div>
                <ul className="nav nav-tabs" role="tablist">
                    {menus}
                </ul>
                <div className="tab-content">
                    {panes}
                </div>
            </div>;

        return html;

    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                this.root.find('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {

                    var tabindex: any = $(e.currentTarget).attr('data-tabindex');

                    if (this.props.on_tabchange) {
                        this.props.on_tabchange(tabindex);
                    }

                });

            } break;
        }


        return super.on_notify();
    }

}


class InvitationMail extends jx.views.ReactiveView {

    render() {

        var template = {
            text: `<p><h3>Stamp registration</h3><p>
                   <p>Welcome to Stamp!</p>
                   <p>To complete your registration, please click the link below:</p>
                   <p class="text-info"><a href="http://www.stamp.com?registration=1234">http://www.stamp.com?registration=1234</a></p>`
        }

        var html =
            <div>

                <h2>Send an invitation email</h2>

                <form>

                    <b.FormGroup className="m-b-sm">
                        <b.InputGroup>
                            <b.InputGroup.Addon>
                                <i className="fa fa-envelope-o"></i>
                            </b.InputGroup.Addon>
                            <b.FormControl type="email" name="email" required placeholder="Enter valid email" />
                        </b.InputGroup>
                        <span className="error-tag"></span>
                    </b.FormGroup>
                    <br/>
                    <jx.controls.QuillEditor minheight={100} entity={template} property="text"  />

                </form>

            </div>

        return html;

    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                this.root.find('form').validate({
                    rules: {
                        email: {
                            email: true,
                            required: true
                        }
                    },
                    errorPlacement(err, el: JQuery) {
                        $(el).closest('form').find('.error-tag').html(err);
                    }
                });


            } break;

        }

        return super.on_notify();
    }
}



interface RegisterEmpState extends jx.views.ReactiveViewState {
    items: any[]
}
interface RegisterEmpProps extends jx.views.ReactiveViewProps {
    deptid: string
}
class RegisterEmp extends jx.views.ReactiveView {

    props: RegisterEmpProps;
    state: RegisterEmpState;


    render() {

        var html =
            <form>
                <div className="row" style={{ marginTop:0 }}>                    
                    <b.Col lg={12} style={{ marginTop: 0 }}>
                        <h2>Email</h2>
                        <b.FormGroup className="m-b-sm">
                            <b.InputGroup>
                                <b.InputGroup.Addon>
                                    <i className="fa fa-envelope-o"></i>
                                </b.InputGroup.Addon>
                                <b.FormControl type="email" name="usremail" required placeholder="Enter valid email" />
                            </b.InputGroup>
                            <span className="error-tag" ></span>
                        </b.FormGroup>
                    </b.Col>


                    <b.Col lg={6}>

                        <h2>Name</h2>
                        <b.FormGroup >
                            <b.InputGroup>
                                <b.InputGroup.Addon>
                                    <i className="fa fa-user"></i>
                                </b.InputGroup.Addon>
                                <b.FormControl type="text" name="usrname" required placeholder="Name" />
                            </b.InputGroup>
                            <span className="error-tag" ></span>
                        </b.FormGroup>

                    </b.Col>


                    <b.Col lg={6}>

                        <h2>Surname</h2>
                        <b.FormGroup className="m-b-sm">
                            <b.InputGroup>
                                <b.InputGroup.Addon>
                                    <i className="fa fa-user"></i>
                                </b.InputGroup.Addon>
                                <b.FormControl type="text" name="usrsurname" required placeholder="Surname" />
                            </b.InputGroup>
                            <span className="error-tag" ></span>
                        </b.FormGroup>

                    </b.Col>

                    <b.Col lg={12}>

                        <h2>Department</h2>
                        <div className="form-group m-b-sm">
                            <select className={"form-control m-b depts-select" }>
                            </select>
                        </div>                        

                    </b.Col>
                </div>

            </form>;



        return html;
    }


    private _depts_ds: jx.data.DataSource;
    get ds_depts(): jx.data.DataSource {
        if (!this._depts_ds) {
            this._depts_ds = new jx.data.DataSource('compdept');
        }
        return this._depts_ds;
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                this.root.validate({
                    rules: {
                        usremail: {
                            email: true,
                            required: true
                        },
                        usrname: { required: true },
                        usrsurname: { required: true },
                    },             
                    errorPlacement(err, el: JQuery) {
                        $(el).closest('form').find('.error-tag').html(err);
                    }
                });


                this.load_departments().then((data: any[]) => {

                    this.fill_options();

                });


            } break;                
        }

        return super.on_notify();
    }


    count: number;


    fill_options() {

        var data = this.state.items;

        if (!data.length) {
            return;
        }

        if (this.count === undefined) {
            this.count = 0;
        }

        var dept = this.state.items[0];

        var options: any[] = [{
            id: this.props.deptid,
            text: _.result(dept, 'deptname')
        }];


        this.root.find('.depts-select').on('change', e => {
           
        });


        this.root.find('.depts-select')['select2']({
            minimumResultsForSearch: Infinity,
            data: options
        });


        this.root.find('.select2-container').css('width', '100%');
    }


    load_departments() {

        var d = Q.defer();

        var qry = new Backendless.DataQuery();

        if (this.props.deptid) {
            qry.condition = "objectId='{0}'".format(this.props.deptid);
        }

        Backendless.Persistence.of('compdept').find(qry,
            new Backendless.Async(rst => {

                this.state.items = rst['data'];

                d.resolve(rst['data']);

        }, err => {                
                d.reject(err)
        }));
        
        return d.promise;
    }
}