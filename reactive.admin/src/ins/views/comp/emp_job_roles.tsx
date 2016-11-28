// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;



export interface EmpJobExplorerProps extends jx.views.ReactiveViewProps{
    emp: breeze.Entity
}
interface EmpJobExplorerState extends jx.views.ReactiveViewState {
    data: breeze.Entity[]
}
export class EmpJobExplorer extends jx.views.ReactiveView {

    constructor(props: EmpJobExplorerProps) {
        super(props);        
    }

    props: EmpJobExplorerProps;
    state: EmpJobExplorerState;

    private __ds: jx.bx.DataSource;
    get ds(): jx.bx.DataSource {
        if (!this.__ds) {
            this.__ds = new jx.bx.DataSource('jbr');
        }
        return this.__ds;
    }


    get is_new(): boolean {
        return true;
    }


    render() {

        if (this.state.loading) {
            return <i className="fa fa-spin fa-spinner fa-2x" ></i>
        }

        var data = this.state.data;
        
        var html =
            <b.Row>
                <b.Col lg={12}>
                    <h2>
                        <span>My job positions</span>
                        <b.Button bsStyle="success" bsSize="xs"
                            onClick={this.add_new_job.bind(this)}
                            className="btn-outline m-l-md">
                            <i className="fa fa-plus"></i> add
                        </b.Button>
                    </h2>

                    <hr />
                    
                </b.Col>

                <b.Col lg={12}>

                    {this.fill_with_items()}

                </b.Col>

            </b.Row>;


        return html;
    }


    fill_with_items() {

        var key: number = 1;

        var views = _.map(this.state.data, d => {

            var topborder = key === 1 ? 'no-top-border' : '';

            var date_from = _.result(d, 'jbrstartdate') ? moment(_.result(d, 'jbrstartdate')).format('MMM-YYYY') : '';
            var date_to = _.result(d, 'jbrenddate') ? moment(_.result(d, 'jbrenddate')).format('MMM-YYYY') : '';
            var duration = moment(_.result(d, 'jbrstartdate')).fromNow();

            var dates:any = "{0}".format(date_from);
            if (date_to) {
                dates = <span> <span className="m-r-sm">{date_from}</span> <span className="m-r-sm">-</span> <span>{date_to}</span> </span>;

                var start = moment(_.result(d, 'jbrstartdate'));
                var end = moment(_.result(d, 'jbrenddate'));
                
                duration = moment.duration(end.diff(start)).humanize();                
            }

            var location = _.result(d, 'jbrlocation');
            if (!location) {
                location = 'location';
            }

            var company = _.result(d, 'jbrcomp');
            if (company != undefined && company != null) {
                company = <span><i className="fa fa-home"></i> {company}</span>;
            }

            var id = _.result(d, utils.key);

            var html =
                <div className="timeline-item" key={key++} data-keyid={id}>

                    <b.Row>

                        <b.Col className={"content jbr-content {0}".format(topborder)} lg={12} style={{borderLeft: 'none'}}>

                            <b.Row>

                                <b.Col lg={12} style={{height:42}}>
                                    <h3>
                                        <span className="text-success jbrdescr">{_.result(d, 'jbrdescr') }</span>
                                        <button className="btn btn-primary btn-outline btn-xs btn-action op-1 m-l-lg m-r-xs">
                                            <i className="fa fa-edit"></i> edit
                                        </button>

                                        <button className="btn btn-danger btn-outline btn-xs btn-action op-1 btn-delete"  >
                                            <i className="fa fa-trash"></i> delete
                                        </button>

                                        <p className="m-l-lg" style={{ fontWeight: 400, display: 'inline-block' }}>{company}</p>

                                    </h3>
                                    
                                </b.Col>
                                
                            </b.Row>
                            
                            <b.Row>
                                <b.Col className="m-l-xs" lg={12}>
                                    <span>{dates}</span>
                                    <span className="m-l-sm">{"( {0} )".format(duration) }</span>
                                </b.Col>                                
                            </b.Row>
                            <br />
                            <b.Row>
                                <b.Col className="m-l-xs" lg={12}>
                                    <i className="fa fa-map-marker m-r-xs"></i> {location}
                                </b.Col>                                 
                            </b.Row>
                            <br />
                            <p>{_.result(d,'jbrnotes')}</p>
                    </b.Col>

                    </b.Row>
                    
                </div>

            return html;
        });


        return views;
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {
                
                if (this.state.loading) {
                    this._load();
                }


            } break;

        } 

        return super.on_notify();
    }


    delete_jbr(id: string) {

        utils.ask_question('Are you sure you want to delete this item?')
        .then((ok) => {
            
            var obj: breeze.Entity = _.find(this.ds.dm.getEntities('jbr'), d => {
                return _.result(d, utils.key) === id;
            }) as any;

            obj.entityAspect.setDeleted();

            utils.spin(this.root);

            this.ds.saveChanges().then(() => {

                toastr.success('Datat successfully deleted');

                this.newState({
                    data: this.ds.dm.getEntities()
                });
                

            }).fail(err => {

                toastr.error(JSON.stringify(err));

            }).finally(() => {

                utils.unspin(this.root);

            });

        });

    }


    add_new_job(e: Event) {

        e.preventDefault();
        
        jx.modal.Show({
            inmodal: true,
            icon: <i className="fa fa-user-circle-o modal-icon" ></i>,
            bsSize:'lg',
            title: 'Add a new job position',
            content: (modal: jx.modal.Modal) => {
                return <EmpJobRoleView owner={this} modal={modal} autoinsert={true} start_by_loading={true} emp={this.props.emp} />
            }
        });

        $('.modal-body').addClass('col-lg-12');
    }


    reload() {

        this.setState({
            loading: true
        }, () => {

            this._load();

        })

    }


    private _load() {

        var d = Q.defer();

        this.ds.dm.clear();

        this.ds.fetch_data({
            condition: "empid='{0}'".format(_.result(this.props.emp, utils.key))
        }).then(data => {

            this.setState({
                loading: false,
                data: data
            }, () => {

                this.root.find('.btn-delete').click((e: Event) => {

                    var id = $(e.currentTarget).closest('.timeline-item').attr('data-keyid');

                    this.delete_jbr(id);

                });

                this.root.find('.jbr-content').hover(function () {

                    $(this).find('.btn-action').toggleClass('op-1');

                }, function () {

                    $(this).find('.btn-action').toggleClass('op-1');

                });

            });
        });

        return d.promise;

    }
}




interface EmpJobRoleViewProps extends jx.views.ReactiveEditDataViewProps {
    emp: breeze.Entity,
    modal: jx.modal.Modal
}
interface EmpJobRoleViewState extends jx.views.ReactiveEditDataViewState {
    emp: breeze.Entity
}
class EmpJobRoleView extends jx.views.ReactiveEditDataView {

    props: EmpJobRoleViewProps;
    state: EmpJobRoleViewState;

    constructor(props: EmpJobRoleViewProps) {
        super(props);

        this.state.emp = this.props.emp;

        this.props.modal.save = () => {
            this.save();
        }
    }


    componentWillReceiveProps(props: EmpJobRoleViewProps) {
        super.componentWillReceiveProps(props);
        this.state.emp = props.emp
    }


    get_model(): string {
        return 'jbr';
    }


    get_initial_values() {
        
        return {
            compid: this.app.CompId,
            deptid: _.result(this.props.emp, 'deptid'),
            empid: _.result(this.props.emp, utils.key)
        };
    }


    save() {

        if (!this.ds.dm.hasChanges()) {
            return;
        }

        utils.spin(this.root);

        this.save_data().then(() => {

            toastr.success('Data saved successfully');

            this.props.owner['reload']();

            this.props.modal.close();

        }).fail(err => {

            toastr.error(JSON.stringify(err));

        }).finally(() => {

            utils.unspin(this.root);
        });
    }
    

    load_data(qry?: jx.data.DataQuery) {

        return this.ds.fetch_metadata().then(() => {
            return Q.resolve(this.ds.dm.getEntities('jbr'));
        });
        
    }


    render() {

        if (this.state.loading) {
            return <i className="fa fa-spin fa-spinner fa-2x" ></i>
        }

        var default_jobstart = this.item ? _.result(this.item, 'jbrstartdate') : '';
        var default_jobend = this.item ? _.result(this.item, 'jbrenddate') : '';

        var html =
            <b.Row>

                <b.Form>

                    <b.Col lg={12}>

                        <jx.controls.TextIcon
                            label='Job role description'
                            icon='fa-pencil-square-o'
                            placeholder='Job description'
                            property='jbrdescr'
                            />  
                                              
                    </b.Col>

                    <div>
                        
                        <b.Col lg={6}>

                            <jx.controls.TextIcon
                                label='Company'
                                icon='fa-bank'
                                placeholder='Company'
                                property='jbrcomp'
                                />  
                        </b.Col>


                        <b.Col lg={6}>

                            <jx.controls.TextIcon
                                label='Location'
                                icon='fa-map-marker'
                                placeholder='Location'
                                property='jbrlocation'
                                />  
                            
                        </b.Col>

                    </div>

                    <b.Col lg={6}>

                        <h2>Job start</h2>

                        <div className="form-group date-ctrl" data-prop="jbrstartdate">
                            <div className="input-group date">
                                <span className="input-group-addon"><i className="fa fa-calendar" /></span>
                                <input type="text" className="form-control" defaultValue={default_jobstart} />
                            </div>
                        </div>
                    </b.Col>

                    <b.Col lg={6}>

                        <h2><span>Job end</span> <span className="text-success">(optional) </span></h2>

                        <div className="form-group date-ctrl" data-prop="jbrenddate">
                            <div className="input-group date">
                                <span className="input-group-addon"><i className="fa fa-calendar" />
                                </span><input type="text" className="form-control" defaultValue={default_jobend}/>
                            </div>
                        </div>

                    </b.Col>

                    <b.Col lg={12}>

                        <h2>Comments</h2>
                        <jx.controls.QuillEditor />

                    </b.Col>

                </b.Form>
                
            </b.Row>

        return html;
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                return this.load_data().then(() => {

                    return super.on_notify();
                })

            };


            case jx.constants.events.view_data_loaded: {

                this.root.find('.date-ctrl .input-group.date')['datepicker']({
                    format: "mm-yyyy",
                    startView: "months",
                    minViewMode: "months",
                    autoclose: true
                }).on('changeDate', (ev: any) => {

                    var property = $(ev.currentTarget).closest('[data-prop]').attr('data-prop');
                    this.item[property](ev.date);

                });

                ko.applyBindings(this.item, this.root.find('form')[0]);

            } break;

        }

        return super.on_notify();
    }
}