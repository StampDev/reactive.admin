// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');

import rb = require('react-bootstrap');
var b: any = rb;



interface EmailInfo {
    index: number,
    email:any
}

interface State extends jx.views.ReactiveViewState {
    emails: EmailInfo[];
}
export interface Props extends jx.views.ReactiveViewProps {
}
export class EmpsInvitExplorer extends jx.views.ReactiveView {

    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        this.state.emails = [];
    }

    render() {

        var ui = this.get_uiSchema();

        var send_enabled = this.state.emails.length > 0 ? 'success' : 'default';

        var html =
            <div>
                <div className="alert alert-info">
                    <h3 className="m-l-xs" >You can add employees by sending invitation mails</h3>
                    <p>You may import your contacts from Outlook, Gmail or Linkedin</p>
                </div>                
                <b.Button bsStyle="primary"
                    onClick={this.add_email.bind(this)}
                    className="btn-outline">
                    <i className="fa fa-plus" ></i> Add email address
                </b.Button>

                <b.Button bsStyle={send_enabled} className="pull-right" onClick={this.send_invites.bind(this) }>                    
                    <i className="fa fa-envelope-o" ></i> Invite
                </b.Button>

                <hr />

                <form>

                    <div className="email-list">
                        {_.map(this.state.emails, e => {
                            return e.email
                        })}
                    </div>

                </form>

            </div>;


        return html;
    }


    on_notify(): Q.Promise<any> {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

            } break;

            case 'delete-mail': {

                this.delete_mail(this.current_event.data as any);

            } break;
        }


        return super.on_notify();
    }


    get_uiSchema() {

        var ui = super.get_uiSchema();

        return ui;
    }


    send_invites() {

        if (this.state.emails.length === 0) {
            return;
        }

        if (!this.root.find('form').valid()) {
            return;
        }
    }


    add_email() {

        var list = this.state.emails.slice();

        var max = _.max(_.map(this.state.emails, m => m.index)) + 1;

        if (this.state.emails.length === 0) {
            max = 1;
        }

        list.push({
            index: max,
            email: <EmailAddress owner={this} index={max} />
        });


        this.newState({
            emails:list
        }, () => {

            this.validate_mails();
        });        
    }

    delete_mail(index: number) {

        var list = this.state.emails.slice();

        list.splice(index, 1);

        this.newState({
            emails: list
        }, () => {

            this.validate_mails();
        });        
    }


    validate_mails() {

        var options= {
            rules: {},
            errorPlacement: (err, el) => {
                $(el).closest('.root').find('.error-place').empty();
                $(el).closest('.root').find('.error-place').append(err);
            }
        };

        _.each(this.state.emails, m => {

            options.rules['email-{0}'.format(m.index)] = {
                required: true,
                email: true
            }
        });

        this.root.find('form').validate(options);
        
    }

}


interface EmailAddressProps extends jx.views.ReactiveViewProps {
    index: number
}
class EmailAddress extends jx.views.ReactiveView {

    props: EmailAddressProps;
    
    render() {

        var ui = this.get_uiSchema();

        var html =
            <div className="emp-email-add root">
                <div className="input-group m-b">                 
                    <span className="input-group-btn">
                        <button type="button" className="btn btn-default">
                            <i className="fa fa-envelope-o"></i>
                        </button>                    
                    </span>
                    <input type="email" className="form-control" required placeholder="Enter a valid email address" name={"email-{0}".format(this.props.index) } />
                    <span className="input-group-btn">
                        <button type="button" className="btn btn-default"
                            onClick={this.delete_email.bind(this)} >
                            <i className="fa fa-times"></i>
                        </button>
                    </span>                    
                </div>
                <span className="error-place"></span>
            </div>;


        return html;
    }


    delete_email() {

        this.props.owner.notify({
            action: 'delete-mail',
            data: this.props.index
        });

    }
}