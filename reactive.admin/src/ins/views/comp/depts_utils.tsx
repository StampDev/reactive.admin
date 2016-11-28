// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;



interface CompDeptBreadCrumViewState extends jx.views.ReactiveViewState {
    items:any[]
}
export interface CompDeptBreadCrumViewProps extends jx.views.ReactiveViewProps {
    id: string
}
export class CompDeptBreadCrumView extends jx.views.ReactiveView {

    props: CompDeptBreadCrumViewProps;
    state: CompDeptBreadCrumViewState;

    render() {

        if (this.state.loading) {
            return null;
        }

        var data = this.state.items;
        
        var target = _.find(data, d => {
            return this.props.id ?
                (_.result(d, utils.key) === this.props.id)
                : (!_.result(d, 'deptparentid'));
        });

        return <InternalBreadcrumb target={target} data={data} />;
    }


    get_model(): string {
        return 'compdept';
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                Backendless.Persistence.of('compdept').find({
                    condition: "compid='{0}'".format(this.app.CompId)
                }, new Backendless.Async(rst => {

                        this.newState({
                            loading: false,
                            items: rst['data']
                        });
                        
                }, err => {

                    toastr.error(JSON.stringify(err));

                }))


            } break;

        }

        return super.on_notify();
    }
}


interface InternalBreadcrumbProps extends jx.views.ReactiveViewProps {
    target: any,
    data: any[]
}
class InternalBreadcrumb extends jx.views.ReactiveView {

    props: InternalBreadcrumbProps;

    render() {

        var parents = this.get_parents(this.props.target);

        parents.push(this.props.target);
        
        var html =
            <ol className="breadcrumb">
                {this.buil_parents_path(parents) }
            </ol>;
         
        return html;
    }


    buil_parents_path(parents:any[]) {

        var views: any[] = [
            <li>
                <a href="/company/employees">
                    <i className="fa fa-home"></i>
                </a>
            </li>
        ];

        var index = 1;

        var list = _.map(parents, p => {

            var is_last = (index++) === parents.length;

            var content = _.result(p, 'deptname');

            if (is_last) {
                content = <strong className="text-danger" >{_.result(p, 'deptname') } </strong>;
            }
            
            var li =
                <li>
                    <a href={"/company/employees/depts/{0}".format(_.result(p, utils.key)) }>
                        {content}
                    </a>
                </li>;

            return li;
        });


        views = views.concat(list);


        return views;
    }


    get_parents(target: any) {

        var data: any[] = [];

        var parent = _.find(this.props.data, d => {
            return _.result(d, utils.key) === _.result(target, 'deptparentid');
        });

        if (parent) {
            data.push(parent);
            data = data.concat(this.get_parents(parent));
        }

        return data.reverse();
    }

}




interface DeptHierarchyViewState extends jx.views.ReactiveViewState {
    items: any[];
}
export interface DeptHierarchyViewProps extends jx.views.ReactiveViewProps {
    id: string,    
}
export class DeptHierarchyView extends jx.views.ReactiveView{

    props: DeptHierarchyViewProps;
    state: DeptHierarchyViewState;
    
    constructor(props: DeptHierarchyViewProps) {
        super(props);
        this.state.items = [];
    }
    

    render() {
        
        if (this.state.loading) {
            return <jx.views.LoaderView  />
        }

        var data = this.state.items;
        
        var dept = _.find(data, d => {
            return (_.result(d, utils.key) === this.props.id);
        });

        var parent = _.find(data, d => {
            return (_.result(d, utils.key) === _.result(dept, 'deptparentid'));
        });

        jx.local.set('current-dept', this.props.id);
        
        var html =
            <div>
                {this.display_parent(parent)}
                {this.display_subdepts(dept)}
            </div>


        return html;
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                if (this.state.loading) {

                    var qry = new Backendless.DataQuery();

                    qry.condition = "compid='{0}'".format(this.app.CompId);
                    
                    Backendless.Persistence.of('compdept').find(qry, new Backendless.Async(rst => {

                        this.newState({
                            loading: false,
                            items: rst['data']
                        });
                        
                    }, err => {

                        toastr.error(JSON.stringify(err));
                        
                    }));


                }

            } break;

        }

        return super.on_notify();
    }


    display_parent(dept: any) {

        var parent = dept;

        if (!parent) {
            return null;
        }

        var parent_title = parent ? _.result(parent, 'deptname') : '';

        var parent_href = parent ? "/company/employees/depts/{0}".format(_.result(parent, utils.key)) : '#';

        var html =
            <div>
                <h2>Parent department</h2>
                <h3>
                    <a href={parent_href}>{parent_title}</a>
                </h3>

                <br />
            </div>;

        return html;
    }



    display_subdepts(dept: any) {

        var subs = _.filter(this.state.items, d => {
            return _.result(d, 'deptparentid') === _.result(dept, utils.key)
        }); 

        if (subs.length === 0) {
            return null;
        }

        var children = _.map(subs, sub => {

            var item =
                <h3>
                    <a href={"/company/employees/depts/{0}".format(_.result(sub, utils.key)) }>
                        {_.result(sub, 'deptname') }
                    </a>
                </h3>

            return item;
        });

        var html =
            <div>
                <h2>Sub-departments</h2>
                {children}
            </div>;


        return html;
        
    }



    get_model(): string {
        return 'compdept';
    }

}

