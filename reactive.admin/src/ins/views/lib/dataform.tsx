// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');

import rb = require('react-bootstrap');
var b: any = rb;
import ui = require('../../../core/ui');


export enum ActionMode { EditSwitch, btnDefault, AllowsOn }
export enum DataMode { EditMode, ViewMode }


export interface DataFormState extends ui.BtState {
    datamode?: DataMode
    actionmode?: ActionMode
}
export interface DataFormProps extends ui.BtProps {
    Id?: any,
    model?: string,
    header?: any,
    actionmode?: ActionMode
}
export class DataForm extends ui.TypeView<DataFormProps, DataFormState>{

    constructor(props: DataFormProps) {

        super(props);
        
        // init action mode
        this.state.actionmode = props.actionmode;
        if (!this.state.actionmode) {
            this.state.actionmode = ActionMode.EditSwitch
        }

        this.state.datamode = DataMode.ViewMode;

        this.state.loading = true;
    }


    private __ds: jx.data.DataSource;
    get ds(): jx.data.DataSource {

        if (!this.__ds) {
            this.__ds = new jx.data.DataSource(this.get_modelname());
        }
        return this.__ds;
    }


    get_modelname() {
        return this.props.model;
    }


    private __item: breeze.Entity;
    get item(): breeze.Entity {

        if (!this.__item) {

            if (this.IsNew) {
                this.__item = this.insert_new();
            } else {
                this.__item = this.ds.dm.getEntities(this.get_modelname())[0]
            }            
        }

        return this.__item;
    }


    get IsNew(): boolean {
        return !this.props.Id;
    }


    render() {

        var ui: any = this.get_uiSchema();

        var html =
            <form>
                {ui.header} {ui.buttons}
                {ui.top_separator}
                {ui.uiContent}
                {ui.footer}
            </form>;
            
        return html;
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                this.load_data().then(() => {

                    this.initState({
                        loading: false
                    }, () => {

                        this.root.find('form').validate();

                        this.bind_controls();
                    })

                });

            } break;
        }

        return super.on_notify();
    }


    load_data(): Q.Promise<any> {

        if (!this.IsNew) {

            return this.ds.fetch_data(this.build_whereclause()).then(() => {
                return [this.item];
            });

        } else {
            return Q.resolve([this.item]);
        }
    }


    build_whereclause() {

        var qry: jx.data.DataQuery = {
            where: {
                ID: this.props.Id
            }
        }

        return qry;
    }


    bind_controls() {

        ko.cleanNode(this.root[0]);

        ko.applyBindings(this.item, this.root[0]);
        
    }


    insert_new() {
        return this.ds.dm.createEntity(this.get_modelname(), this.get_initial_values());
    }


    get_initial_values() {
        return {
            ID: utils.guid()
        }
    }


    get_uiContent() {
        return {};
    }
    

    get_uiSchema(): any {        

        var ui = {

            header: <h1 style={{ display:'inline-block' }} >{this.props.header}</h1>,

            top_separator: <hr />,

            buttons: this.get_action_buttons(),  

            uiContent: this.get_uiContent()

        }
        
        return ui;
    }



    get_action_buttons() {

        var btn_edit_visible = 'hidden';
        var btn_commit_visible = 'hidden';

        var btn_save_enabled = 'default';
        var btn_cancel_enabled = 'default';

        switch (this.state.actionmode) {

            case ActionMode.EditSwitch: {

                if (this.state.datamode === DataMode.ViewMode) {
                    btn_edit_visible = '';
                } else {

                    btn_commit_visible = '';

                    btn_save_enabled = 'primary';
                    btn_cancel_enabled = 'warning';
                }

            } break;

            case ActionMode.AllowsOn: {

                btn_commit_visible = '';

                btn_save_enabled = 'primary';
                btn_cancel_enabled = 'warning';

            } break;

            case ActionMode.btnDefault: {

                btn_commit_visible = '';

                if (this.state.datamode === DataMode.EditMode) {

                    btn_save_enabled = 'primary';
                    btn_cancel_enabled = 'warning';

                } else {

                    btn_save_enabled = 'default';
                    btn_cancel_enabled = 'default';
                }


            } break;

        }

        var btns = [
            <rb.Button bsStyle={"{0}".format(btn_cancel_enabled) }
                onClick={this.cancel_edit.bind(this) }
                bsSize="small" className={"btn-cancel btn-outline pull-right m-l-sm {0}".format(btn_commit_visible) }>
                <i className="fa fa-times" ></i> cancel
            </rb.Button>,

            <rb.Button bsStyle={"{0}".format(btn_save_enabled) }
                onClick={this.save_data.bind(this) }
                bsSize="small" className={"btn-save btn-outline pull-right m-l-sm {0}".format(btn_commit_visible) }>
                <i className="fa fa-check" ></i> save
            </rb.Button>,


            <rb.Button bsStyle="info" bsSize="small"
                onClick={this.enter_edit.bind(this) }
                className={"btn-edit btn-outline pull-right m-l-sm {0}".format(btn_edit_visible) }>
                <i className="fa fa-edit" ></i> edit
            </rb.Button>
        ];


        return btns;
    }


    cancel_edit(e: Event) {

        this.initState({
            datamode: DataMode.ViewMode
        }, () => {

            this.bind_controls();
        });
    }


    enter_edit(e: Event) {

        this.initState({
            datamode: DataMode.EditMode
        }, () => {

            this.bind_controls();
        });
    }


    save_data(e: Event) {

        this.initState({
            datamode: DataMode.ViewMode
        }, () => {

            this.bind_controls();
        });

    }

    /*


    save_data() {

        var d = Q.defer();

        if (!this.root.find('form').valid()) {
            return Q.reject(false);
        }

        utils.spin(this.root);

        this.ds.save_changes()
            .then(() => {

                toastr.success('Data saved successfully');
            })
            .fail(err => {

                toastr.error(JSON.stringify(err));
            })
            .finally(() => {

                utils.unspin(this.root);
            });

        return d.promise;
    }
    */


}
