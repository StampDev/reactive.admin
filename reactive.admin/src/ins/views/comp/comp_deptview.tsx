// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;


interface State extends jx.views.ReactiveViewState {
    data: breeze.Entity[]
}
export interface CompDeptViewProps extends jx.views.ReactiveViewProps {
    modal?: jx.modal.Modal,
    id?: string,
    parentid?: string,
    outline?: string
}
export class CompDeptView extends jx.views.ReactiveView {


    get is_new(): boolean {
        return !this.props.id;
    }


    get is_root(): boolean {
        return _.result(this.item, 'deptparentid') == undefined
            || _.result(this.item, 'deptparentid') == null;
    }


    private _ds: jx.data.DataSource;
    get ds(): jx.data.DataSource {
        if (!this._ds) {
            this._ds = new jx.data.DataSource('compdept');
        }
        return this._ds;
    }


    private _item: breeze.Entity;
    get item(): breeze.Entity {

        if (!this._item) {
            if (this.is_new) {

                var parentid = this.root.find('.depts-select').val();

                if (!parentid) {
                    parentid = null;
                }

                this._item = this.ds.dm.createEntity('compdept', {
                    id: utils.guid(),
                    compid: this.app.CompId,
                    deptparentid: parentid
                });

            } else {

                this._item = _.find(this.ds.dm.getEntities('compdept'), f => f['id']() === this.props.id);
            }
        }

        return this._item;
    }


    constructor(props: CompDeptViewProps) {

        super(props);

        this.state.loading = true;

        this.props.modal.save = () => {

            return this.onSave().then(() => {

                this.props.modal.close();

                this.broadcast({
                    action: 'post-department-finished'
                })

            });
        }
    }


    state: State;
    props: CompDeptViewProps;


    render() {

        if (this.state.loading) {
            return <jx.views.LoaderView height={200} />
        }

        var display_select = (this.is_new || !this.is_root) ? '' : 'hidden';


        var html =
            <div>
                <form>

                    <h2>Department name</h2>

                    <b.FormGroup>
                        <b.FormControl name="deptname" type="text" data-bind="textInput:deptname" />
                    </b.FormGroup>


                    <h2 className={display_select} >Parent department</h2>

                    <div className="form-group">

                        <select className={"form-control m-b depts-select {0}".format(display_select) }>
                        </select>

                    </div>

                </form>

            </div>;


        return html;
    }


    skip: boolean;


    on_change() {

        if (!this.skip) {
            var parentid = this.root.find('.depts-select').val();
            this.item['deptparentid'](parentid);
        }

    }


    fill_options() {

        if (!this.state.data || !this.state.data.length) {
            return null;
        }

        var root = _.find(this.state.data, d => {
            return !_.result(d, 'deptparentid');
        });

        if (!root) {
            root = this.state.data[0];
        }

        var options = this.fill_dept(root, 1);

        return options;
    }


    count: number;


    fill_dept(dept: any, intent: number) {

        if (this.count === undefined) {
            this.count = 0;
        }

        var _intent = '';

        for (var i = 0; i < intent; i++) {
            _intent = _intent + '. ';
        }

        var options: any[] = [];

        if (_.result(dept, 'id') != this.props.id) {

            if (!this.is_new) {

                if (!this.is_descendant(dept)) {

                    options.push({
                        id: _.result(dept, 'id'),
                        text: _intent + _.result(dept, 'deptname')
                    });

                }
            } else {

                options.push({
                    id: _.result(dept, 'id'),
                    text: _intent + _.result(dept, 'deptname')
                });
            }

        }


        var children = _.filter(this.state.data, d => {
            return _.result(d, 'deptparentid') === _.result(dept, 'id');
        });

        _.each(children, child => {

            options = options.concat(this.fill_dept(child, intent + 1));

        });

        return options;
    }


    is_descendant(ent: any): boolean {

        if (!ent) {
            return false
        }

        if (_.result(ent, 'deptparentid') === this.props.id) {
            return true
        }

        var parent = _.find(this.ds.dm.getEntities('compdept'), d => {
            return _.result(d, 'id') === _.result(ent, 'deptparentid');
        });

        return this.is_descendant(parent);

    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                if (this.state.loading) {

                    var that = this;

                    this.load_departments().then((_data: any) => {

                        this.newState({
                            loading: false,
                            data: _data
                        }, () => {


                            if (this.is_new || !this.is_root) {

                                var options = this.fill_options();


                                this.root.find('.depts-select').on('change', e => {
                                    this.on_change();
                                });


                                this.root.find('.depts-select')['select2']({

                                    minimumResultsForSearch: Infinity,

                                    data: options
                                });


                                if (!this.is_new) {

                                    this.skip = true;

                                    try {

                                        this.root.find('.depts-select').val(_.result(this.item, 'deptparentid')).trigger("change");

                                    } finally {

                                        this.skip = false;

                                    }
                                }
                            }


                            ko.applyBindings(that.item, that.root[0]);

                        });

                    });
                }

            } break;

        }

        return super.on_notify();
    }


    load_departments() {

        var d = Q.defer();

        var qry: jx.data.DataQuery = null;

        if (this.props.parentid) {

            qry = {
                where: {
                    'id': { eq: this.props.parentid }
                }
            }
        }

        this.ds.exec_query(qry).then(() => {
            d.resolve(this.ds.dm.getEntities('compdept'));
        });

        return d.promise;
    }



    onSave(): Q.Promise<any> {

        var d = Q.defer();

        utils.spin(this.root);

        this.ds.saveChanges()
            .then(() => {

                toastr.success('Data saved successfully');

                d.resolve(true);
            })
            .fail(err => {

                toastr.error(JSON.stringify(err));

                d.reject(false);
            })
            .finally(() => {

                utils.unspin(this.root);
            });

        return d.promise;
    }

}
