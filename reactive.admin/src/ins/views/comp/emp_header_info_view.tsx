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
    emp: breeze.Entity,
    usr: any
}
interface EmpsHeaderInfoState extends ui.BtState {
    usr: any
}
export class EmpsHeaderInfo extends ui.TypeView<EmpsHeaderInfoProps, EmpsHeaderInfoState>{

    constructor(props: EmpsHeaderInfoProps) {
        super(props);
        this.state.usr = props.usr;
    }

    render() {
        
        var name = _.result(this.state.usr, 'name');
        var surname = _.result(this.state.usr, 'surname');

        if (!surname) {
            surname = '';
        }

        var usr_name = '{0} {1}'.format(name, surname);


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


    ds: jx.data.DataSource;

    on_notify() {

        switch (this.current_event.action) {
            
            case 'update-user': {

                this.newState({
                    reload: true
                }, () => {

                    this.setState({
                        reload: false,
                        usr: this.current_event.data
                    });

                })

            } break;

        }

        return super.on_notify();
    }
}