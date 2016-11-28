// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;
import ui = require('../../../core/ui');


export interface EmpsHeaderInfoProps extends ui.BtProps {
    emp: breeze.Entity
}
export class EmpsHeaderInfo extends ui.TypeView<EmpsHeaderInfoProps, ui.BtState>{

    render() {

        if (this.state.loading) {
            return <i className="fa fa-spin fa-spinner"></i>;
        }

        var usr_name = '{0} {1}'.format(_.result(this.usr, 'usrname'), _.result(this.usr, 'usrsurname'));


        var html =
            <div className="row" style={{ marginBottom: 30 }} >
                <div className="col-md-12">
                    <div className="profile-image">
                        <img src="/ins/img/a4.jpg" className="img-circle circle-border m-b-md" alt="profile" />
                    </div>
                    <div className="profile-info">
                        <div className="">
                            <div>
                                <h2 className="no-margins">
                                    <span className="text-danger" >{usr_name}</span>
                                </h2>
                                <h4>Current job position</h4>
                                <small className="">
                                    {"About {0}".format(usr_name) }
                                </small>
                            </div>
                        </div>
                    </div>

                </div>

                <br />

                <div className="col-md-8 m-b-sm">
                    <table className="table small m-b-xs">
                        <tbody>
                            <tr>
                                <td>
                                    <strong>142</strong> Activities
                                </td>
                                <td>
                                    <strong>22</strong> skills
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Department</strong> Comments
                                </td>
                                <td>
                                    <strong>Overall score</strong> {"36%"}
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <br />

            </div>;


        return html;

    }

    get usr(): breeze.Entity {
        return this.ds.findkey(_.result(this.props.emp, 'usrid'));
    }

    ds: jx.data.DataSource;

    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                if (this.state.loading) {

                    this.ds = new jx.data.DataSource('usr');

                    this.ds.exec_query({
                        where: { id: _.result(this.props.emp, 'usrid') }
                    }).then(() => {

                        this.newState({
                            loading: false
                        });

                    });
                }

            } break;


            case 'update-user': {

                this.newState({
                    reload: true
                }, () => {

                    utils.spin(this.root);

                    this.ds.dm.clear();
                    this.ds.exec_query({
                        where: { id: _.result(this.current_event.data, 'id') }
                    }).then(() => {

                        this.newState({
                            reload: false
                        }, () => {

                            utils.unspin(this.root);
                        });

                    });

                })

            } break;

        }

        return super.on_notify();
    }
}