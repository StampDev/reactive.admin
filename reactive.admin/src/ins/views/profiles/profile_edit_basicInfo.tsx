/// <reference path="profile_occptree.tsx" />
/// <reference path="profiles_new.tsx" />
/// <reference path="../../../../typings/sweetalert/sweetalert.d.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;

import jx = require('../../../core/lib');
import { OccpTreeView } from './profile_occptree';
import nw = require('./profiles_new');



enum DataMode { view, edit }

interface ProfileEditBasicInfoState extends jx.views.ReactiveViewState {
    datamode: DataMode
}
export interface ProfileEditBasicInfoProps extends jx.views.ReactiveViewProps {
    profid: any;
}
export class ProfileEditBasicInfo extends jx.views.ReactiveView {

    constructor(props: ProfileEditBasicInfoProps) {
        super(props);
        this.state.datamode = DataMode.view;
    }

    props: ProfileEditBasicInfoProps;
    state: ProfileEditBasicInfoState;
    occpinfo: any;


    private __ds: jx.data.DataSource;
    get ds(): jx.data.DataSource {

        if (!this.__ds) {

            this.__ds = new jx.data.DataSource('prof');

            this.__ds.dm.entityChanged.subscribe((args: breeze.EntityChangedEventArgs) => {
                this.entity_changed(args);        
            });
        }
        return this.__ds;
    }


    get prof(): any {
        return this.ds.dm.getEntities('prof')[0];
    }


    entity_changed(args: breeze.EntityChangedEventArgs) {

        if (args.entityAction === breeze.EntityAction.PropertyChange) {
            this.newState({
                datamode: DataMode.edit
            });
        } else {

            this.newState({
                datamode: DataMode.view
            });

        }
    }


    render() {

        var can_save = this.state.datamode === DataMode.edit ? 'primary' : 'default';
        var can_cancel = this.state.datamode === DataMode.edit ? 'warning' : 'default';

        var html =
            <b.Row>

                <div >
                    
                    <b.Col lg={12}>
                        
                        <h1 style={{ display: 'inline-block' }}>Basic information</h1>


                        <rb.Button bsStyle={can_cancel} bsSize="small"
                            onClick={this.cancel_edit.bind(this) }
                            className="pull-right">
                            <i className="fa fa-times"></i> cancel
                        </rb.Button>


                        <rb.Button bsStyle={can_save} bsSize="small"
                            onClick={this.save_changes.bind(this) }
                            className="pull-right m-r-xs">
                            <i className="fa fa-check"></i> save
                        </rb.Button>


                    </b.Col>


                    <b.Col lg={12}>
                        <hr />
                    </b.Col>

                    
                    <b.Col lg={12}>

                        <form style={{}}>

                            <h3>Profile title</h3>

                            <b.FormGroup>
                                <b.FormControl name="proftitle" type="text" data-bind="textInput:PROFTITLE" />
                            </b.FormGroup>

                            <br />
                            
                            <h3>
                                <span className="isco-title">Isco occupation</span>
                                <rb.Button bsStyle="primary"        
                                    onClick={this.select_occp.bind(this) }                            
                                    className="btn-outline pull-right hidden">
                                    select the profile isco occupation
                                </rb.Button>
                            </h3>

                            <div className="m-t-sm">
                                <h3>
                                    <strong className="occp text-info"></strong>
                                </h3>
                            </div>

                            <br />
                            
                            <h3>Profile description</h3>
                            <jx.controls.QuillEditor
                                onChange={this.on_descr_changed.bind(this)}
                                entity={this.prof} property="PROFDESCRIPTION"/>
                            
                               
                        </form>
                        
                    </b.Col>


                </div>
                
                <jx.modal.Modal ref='modal'
                    title="Select an isco occupation"
                    bsSize="lg"
                    onFinish={() => { return this.store_occp_select(); } } />

            </b.Row>;



        return html;
    }


    on_descr_changed() {


    }

    

    on_notify() {
        
        switch (this.current_event.action) {
            
            case jx.constants.events.view_initialized: {
                
                this.load_profile().then(() => {

                    this.update_occp(_.result(this.prof,'OCCPID')).done();
                    
                    this.apply_bindings();

                });

            } break;

            case 'occp-selected': {
                this.occpinfo = this.current_event.data;
            } break;

            case 'occp-unselected': {
                this.occpinfo = null;
            } break;
        }
        
        return super.on_notify();
    }


    select_occp(e: Event) {

        e.preventDefault();

        (this.refs['modal'] as jx.modal.Modal).show(<OccpTreeView owner={this as any} />);
    }


    private store_occp_select(): Q.Promise<Boolean> {

        var d = Q.defer<Boolean>();

        var opts: SweetAlert.AlertModalSettings 
                  & SweetAlert.Settings = {
            title:'Warning',
            text:'Activities and Skills not associated with the selected isco occupation will be deleted. Continue?',            
            type:'warning',
            showCancelButton: true,
            showConfirmButton: true,            
        }

        swal(opts, ok =>{
         
            if (ok) {

                this.update_occp(this.current_event.data['occpid'], true);

                d.resolve(true);

            } else {

                d.reject(false);
            }
               
        });
        

        return d.promise;
    }
    
    

    private update_occp(occpid:any, reset?: boolean) {
        
        var ds: jx.data.DataSource = new jx.data.DataSource('occp');

        this.root.find('.occp').empty();

        this.root.find('.occp').append($('<i class="fa fa-spin fa-spinner" ></i>'));

        return ds.fetch_data({
            where: {
                'ID': occpid
            }
        }).then(data => {
            
            this.root.find('.occp').html(_.result(data[0], 'OCCPCONCEPT_EN'));
            
            if(reset){

                this.prof['OCCPID'](this.occpinfo['occpid']);

                this.broadcast({
                    action: 'occp-stored',
                    data: data[0]
                });
            }
            
            return true;

        }).fail((err) => {

                toastr.error(JSON.stringify(err));

                return false;
        });

    }


    apply_bindings() {
        ko.applyBindings(this.prof, this.root.find('form')[0]);
    }
    

    load_profile() {

        utils.spin(this.root);

        var d = Q.defer();

        this.ds.fetch_data({
            where: {
                ID: { 'eq': this.props.profid }
            }
        }).then(() => {
            
            d.resolve(true);

        }).finally(() => {

            utils.unspin(this.root);

        });

        return d.promise;
    }


    cancel_edit() {

        if (this.state.datamode != DataMode.edit) {
            return;
        }

        if (this.ds.dm.hasChanges()) {

            utils.can_looseChanges({
                title: 'Do you want cancel changes made this profile?',
                text:'These changes will be lost'
            }).then(ok => {

                if (ok) {

                    var occpid = this.prof.entityAspect.originalValues['OCCPID'];

                    if (occpid != _.result(this.prof, 'OCCPID')) {

                        this.update_occp(occpid, true)
                            .then(() => {

                                this.ds.dm['rejectChanges']();

                                this.newState({
                                    datamode: DataMode.view
                                });

                            });

                    } else {

                        this.ds.dm['rejectChanges']();

                        this.newState({
                            datamode: DataMode.view
                        });
                    }        
                }
            })
        }
    }


    save_changes() {

        if (this.state.datamode != DataMode.edit) {
            return;
        }

        var d = Q.defer();

        if (this.ds.dm.hasChanges()) {

            utils.spin(this.root);

            this.ds.saveChanges().then(() => {

                toastr.success('Data saved successfully');

                this.broadcast({
                    action: 'profile-saved',
                    data: this.prof
                });

                d.resolve(true);

            }).fail(err => {

                toastr.error(JSON.stringify(err));

                d.reject(false);

            }).finally(() => {

                utils.unspin(this.root);

            });

        }

        return d.promise;
    }
}
