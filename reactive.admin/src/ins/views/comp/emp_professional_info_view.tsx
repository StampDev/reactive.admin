/// <reference path="emp_job_roles.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;
import { EmpExplorer, Datalist_Find, Datalist_FindProps } from '../lib/emp_explorer';
import { EmpJobExplorer, EmpJobExplorerProps } from './emp_job_roles'; 

export interface EmpProfessionalInfoProps extends jx.views.ReactiveViewProps {
    emp: breeze.Entity,
    usr: any
}
interface EmpProfessionalInfoState extends jx.views.ReactiveViewState {
    usr: any
}
export class EmpProfessionalInfo extends jx.views.ReactiveView {

    props: EmpProfessionalInfoProps;
    state: EmpProfessionalInfoState;


    render() {

        var html =
            <div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="m-b-md">
                            <h2>Professional profile</h2>
                        </div>
                    </div>
                </div>

                <b.Row>
                    <b.Col lg={12}>
                        <EmpStatistics />
                    </b.Col>
                </b.Row>

                <div className="row">
                    <div className="col-lg-12">

                        <jx.views.TabControl>

                            <b.Tabs defaultActiveKey={1} id="tabs">

                                <b.Tab eventKey={1} title="Experience history">

                                    <br />
                                    {/*
                                    <EmpJobExplorer owner={this} emp={this.props.emp} />
                                    */}

                                </b.Tab>

                                <b.Tab eventKey={2} title="Activities">

                                    <br />

                                    <EmpActsExplorer owner={this} emp={this.props.emp} usr={this.props.usr}/>

                                </b.Tab>

                                <b.Tab eventKey={3} title="Skills">

                                    <br />
                                    
                                    {/*
                                    <EmpSkillsExplorer owner={this} emp={this.props.emp} />
                                    */}
                

                                </b.Tab>
                                
                            </b.Tabs>

                        </jx.views.TabControl>

                    </div>
                </div>
            </div>;


        return html;
    }
}

class EmpStatistics extends jx.views.ReactiveView {

    render() {

        var html =
            <div>
                <table width='100%'>
                    <tbody>
                        <tr>
                            <td>
                                <div style={{ marginRight: 10 }}>
                                    <h5>Usage</h5>
                                    <h2>65%</h2>
                                    <div className="progress progress-mini">
                                        <div style={{ width: '68%' }} className="progress-bar" />
                                    </div>
                                    <div className="m-t-sm small">last update 4: 32 pm.</div>
                                </div>
                            </td>
                            <td>
                                <div style={{ marginRight: 25 }}>
                                    <h5>Search hits</h5>
                                    <h2>14%</h2>
                                    <div className="progress progress-mini">
                                        <div style={{ width: '38%' }} className="progress-bar progress-bar-danger" />
                                    </div>
                                    <div className="m-t-sm small">last update 4: 32 pm.</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr />
            </div>

        return html;
    }

}



class EmpActsExplorer extends EmpExplorer {

    get_title(): string {
        return 'My professional activities';
    }

    get_select_title() {
        return 'Select one or more activities';
    }

    get_detail_field(): string {
        return 'actid';
    }

    get_detail_table() {
        return 'usra';
    }

    get_lookup_table() {
        return 'acts';
    }

    get_lookup_field() {
        return 'ACTSDESCR_EN';
    }


    get_exec_paging(dt: Datalist_Find, req, draw, setts) {

        utils.spin(dt.root);

        var sql_count = 'select count(*) total from acts';

        var where = null;

        var search_term = dt.api.settings().search();

        if (search_term) {
            where = " ACTSDESCR_EN like '%{0}%' ".format(search_term);
        }

        if (dt.occpinfo) {

            if (where) {
                where = "{0} and (ACTSISCO like '{1}%') ".format(where, dt.occpinfo.occpisco);
            } else {
                where = "ACTSISCO like '{0}%' ".format(dt.occpinfo.occpisco);
            }
        }

        var _not_in = undefined;

        var exclude_ids: any[] = _.map(dt.props.exclusions, a => _.result(a, 'actid'));

        if (exclude_ids && exclude_ids.length > 0) {

            _.each(exclude_ids, id => {

                if (!_not_in) {
                    _not_in = "'{0}'".format(id);
                } else {
                    _not_in = "{0}, '{1}'".format(_not_in, id);
                }
            });

            _not_in = ' (ID NOT IN ({0})) '.format(_not_in);
        }

        if (_not_in) {

            where = where ?
                '{0} and {1}'.format(where, _not_in)
                : _not_in
        }

        if (where) {
            sql_count = '{0} where {1} '.format(sql_count, where);
        }


        var ds = new jx.data.DataSource('acts');


        ds.exec_raw(sql_count).then(rst => {

            var total_count = _.result(rst[0], 'total');

            var sql = 'select * from acts ';

            if (where) {
                sql = '{0} where {1} '.format(sql, where);
            }

            sql = '{0} order by ACTSDESCR_EN offset {1} rows fetch next {2} rows only'.format(sql, req['start'], req['length']);


            ds.exec_raw(sql).then(list => {

                var info = {
                    draw: req['draw'],
                    recordsTotal: list['length'],
                    recordsFiltered: total_count,
                    data: list
                }

                draw(info);

            }).finally(() => {

                utils.unspin(dt.root);

            });

        });
    }

}


class EmpSkillsExplorer extends EmpExplorer {

    get_title(): string {
        return 'My professional skills';
    }

    get_select_title() {
        return 'Select one or more skills';
    }

    get_detail_field(): string {
        return 'sklsid';
    }

    get_detail_table() {
        return 'usrs';
    }

    get_lookup_table() {
        return 'skls';
    }

    get_lookup_field() {
        return 'SKLSCONCEPT';
    }


    get_exec_paging(dt: Datalist_Find, req, draw, setts) {

        utils.spin(dt.root);

        var base_sql = `
            SELECT DISTINCT S.* 
            FROM OCCS OS 
            JOIN SKLS S ON S.ID = OS.SKLSID 
            JOIN OCCP_ISCO ISCO ON OS.OCCPID = ISCO.ID 
        `;

        var sql_count = 'select count(*) total from ({0}) A'.format(base_sql);

        var where = null;

        var search_term = dt.api.settings().search();

        if (search_term) {
            where = " S.{0} like '%{1}%' ".format(dt.props.lookup_field, search_term);
        }

        if (dt.occpinfo) {

            var base_where = `
                EXISTS (SELECT 1 FROM OCCP P WHERE P.OCCPISCO = '{0}'
                   AND ISCO.OCCPPARENTISCO LIKE P.OCCPISCO + '%' )
            `.format(dt.occpinfo.occpisco);

            if (where) {
                where = "{0} and {1} ".format(where, base_where);
            } else {
                where = base_where;
            }
        }


        var _not_in = undefined;

        var exclude_ids: any[] = _.map(dt.props.usr['usrs'](), s => _.result(s, 'sklsid'));

        if (exclude_ids && exclude_ids.length > 0) {

            _.each(exclude_ids, id => {

                if (!_not_in) {
                    _not_in = "'{0}'".format(id);
                } else {
                    _not_in = "{0}, '{1}'".format(_not_in, id);
                }
            });

            _not_in = ' (S.ID NOT IN ({0})) '.format(_not_in);
        }

        if (_not_in) {

            where = where ?
                '{0} and {1}'.format(where, _not_in)
                : _not_in
        }


        if (where) {
            sql_count = 'select count(*) total from ({0} where {1} ) A '.format(base_sql, where);
        } else {
            sql_count = 'select count(*) total from ({0}) A '.format(base_sql);
        }


        var ds = new jx.data.DataSource('skls');


        ds.exec_raw(sql_count).then(rst => {

            var total_count = _.result(rst[0], 'total');

            var sql = base_sql;

            if (where) {
                sql = '{0} where {1}'.format(sql, where);
            }

            sql = '{0} order BY S.SKLSCONCEPT offset {1} rows fetch next {2} rows only'.format(sql, req['start'], req['length']);


            ds.exec_raw(sql).then(list => {

                var info = {
                    draw: req['draw'],
                    recordsTotal: list['length'],
                    recordsFiltered: total_count,
                    data: list
                }

                draw(info);

            }).finally(() => {

                utils.unspin(dt.root);

            });

        });

        return null;
    }

}