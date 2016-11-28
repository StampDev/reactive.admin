// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX



import React = require('react');
import ReactDOM = require('react-dom');

import { InsMasterPage, ins } from '../../lib/ins_master_page';
import jx = require('../../../core/lib');

import rb = require('react-bootstrap');
var b: any = rb;



export interface ProfileWizFinishPageProps extends jx.views.ReactiveViewProps {
    page_index?: number
}
export class ProfileWizFinishPage extends jx.views.ReactiveView {

    props: ProfileWizFinishPageProps;
    prof: any;
    activs_ids: any[];
    skills_ids: any[];

    constructor(props: ProfileWizFinishPageProps) {
        super(props);
    }


    render() {

        var html =
            <div className="row" style={{ minHeight: 300 }}>

                <div className="col-lg-12" style={{ paddingLeft: 0, paddingRight: 0 }}>

                    <h1>Confirm and save</h1>
                    
                    <hr />

                    <h3>Review the following information and press <span className="text-primary">finish</span> to create a new professional profile</h3>

                    <br />

                    <b.Panel header={<h2 style={{ fontSize:18 }}>Basic information</h2>}>

                        <p className="proftitle tr-fontsize" ></p>

                        <p className="occp text-info tr-fontsize" ></p>

                        <p className="profdescription tr-fontsize" ></p>

                    </b.Panel>

                    <br />

                    <b.Panel header={<h2 style={{ fontSize: 18 }}>Activities</h2>}>
                        <br/>
                        <div className="activs">
                        </div>
                    </b.Panel>

                    <br />

                    <b.Panel header={<h2 style={{ fontSize: 18 }}>Skills</h2>}>
                        <br />
                        <div className="skills">
                        </div>
                    </b.Panel>

                </div>

            </div>;


        return html;
    }


    save_data() {

        var d = Q.defer();

        utils.spin(this.root);
        
        var src_obj: breeze.Entity = this.prof;

        var src_em = src_obj.entityAspect.entityManager;

        var dst_em = src_em.createEmptyCopy();

        dst_em.importEntities(src_em.exportEntities());

        _.each(this.activs_ids, id => {

            var obj = dst_em.createEntity('proa', {
                ID: utils.guid(),
                PROFID: src_obj['ID'](),
                OCCPID: src_obj['OCCPID'](),
                ACTSID: id
            });

            dst_em.addEntity(obj);

        });


        _.each(this.skills_ids, id => {

            var obj = dst_em.createEntity('pros', {
                ID: utils.guid(),
                PROFID: src_obj['ID'](),
                OCCPID: src_obj['OCCPID'](),
                SKLSID: id
            });

            dst_em.addEntity(obj);

        });


        var ds = new jx.data.DataSource('prof');

        ds.saveChangesEx(dst_em.exportEntities())
            .then(() => {
                toastr.success('Data saved successfully');
                d.resolve(true);
            })
            .fail(err => {
                toastr.error(JSON.stringify(err));
                d.reject(err);
            })
            .finally(() => {

                utils.unspin(this.root);
            });

        return d.promise;
    }


    on_notify() {

        switch (this.current_event.action) {

            case 'add-prof-finished': {

                this.save_data().then(() => {

                    this.broadcast({
                        action:'new-profile-added',
                        data: _.result(this.prof, 'ID')
                    });
                    
                });
                
            } break;

            case 'prof-stored': {

                this.root.find('.proftitle').html(_.result(this.current_event.data, 'PROFTITLE'));
                this.root.find('.profdescription').html(_.result(this.current_event.data, 'PROFDESCRIPTION'));

                var ds = new jx.data.DataSource('occp');

                this.prof = this.current_event.data;

                ds.exec_query({
                    where: {
                        ID: { eq: _.result(this.current_event.data, 'OCCPID') }
                    }
                }).then(data => {
                    this.root.find('.occp').html(_.result(data[0], 'OCCPCONCEPT_EN'));
                });

            } break;
                
            case 'activs-stored': {
                
                var ds1 = new jx.data.DataSource('acts');

                this.activs_ids = this.current_event.data;

                ds1.exec_query({
                    where: {
                        ID: { in: this.current_event.data }
                    }
                }).then(_data => {

                    this.root.find('.activs').empty();

                    var html = <ListGroup data={_data} descr='ACTSDESCR_EN' />
                    
                    ReactDOM.render(html, this.root.find('.activs')[0]);
                    
                });
                                
            } break;
                
            case 'skills-stored': {

                var ds2 = new jx.data.DataSource('skls');

                this.skills_ids = this.current_event.data;

                ds2.exec_query({
                    where: {
                        ID: { in: this.current_event.data }
                    }
                }).then(_data => {

                    this.root.find('.skills').empty();

                    var html = <ListGroup data={_data} descr='SKLSCONCEPT' />
                    
                    ReactDOM.render(html, this.root.find('.skills')[0]);

                });

            } break;

        }


        return super.on_notify();
    }

}


interface ListGroupProps extends jx.views.ReactiveViewProps {
    data: any[],
    descr: string
}
class ListGroup extends jx.views.ReactiveView {

    props: ListGroupProps;

    render() {

        var html =
            <div>
                <rb.ListGroup>
                    {
                        _.map(this.props.data, d => {

                            var item =
                                <b.ListGroupItem href="#" className="tr-fontsize p-md">
                                    {_.result(d, this.props.descr) }
                                </b.ListGroupItem>;

                            return item;
                        })
                    }
                </rb.ListGroup>
            </div>;


        return html;
    }

}

/*
<ListGroup>
    <ListGroupItem href="#link1">Link 1</ListGroupItem>
    <ListGroupItem href="#link2">Link 2</ListGroupItem>
    <ListGroupItem onClick={alertClicked}>
      Trigger an alert
    </ListGroupItem>
  </ListGroup>
*/