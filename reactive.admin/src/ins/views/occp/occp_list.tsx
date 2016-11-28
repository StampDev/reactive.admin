// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');

import rb = require('react-bootstrap');
var b: any = rb;


interface PathInfo {
    id?: string,
    parentid?: string    
}




export interface OccpListProps extends jx.views.ReactiveViewProps {
}
interface OccpListState extends jx.views.ReactiveViewState {
    parent_id: string,
    level: number,
    animate: boolean,
    path: PathInfo[];
}
export class OccpList extends jx.views.ReactiveView {

    constructor(props: OccpListProps) {
        super(props);
        this.state.loading = true;
        this.state.path = [];
    }

    props: OccpListProps;
    state: OccpListState;

    __ds: jx.data.DataSource;
    get ds(): jx.data.DataSource {
        if (!this.__ds) {
            this.__ds = new jx.data.DataSource('occp');
        }
        return this.__ds;
    }


    render() {

        if (this.state.loading) {
            return <div className="loading" style={{ minHeight: 300 }} ></div>
        }

        var html =
            <rb.ListGroup className="animated fadeInUp">
                <br />
                {this.fill_with_data()}
            </rb.ListGroup>
        
        return html;
    }


    on_notify() {

        switch (this.current_event.action) {

            case 'occp-loading':
            case jx.constants.events.view_initialized: {
                
                this.load_occp_data().then(() => {

                    this.notify({
                        action: 'occp-loaded'
                    });

                });

            } break;

            case 'occp-loaded': {

                this.newState({
                    loading: false
                });                
            } break;

            case 'occp-expand': {

                this.expand_node();

            } break;

        }

        return super.on_notify();
    }


    fill_with_data() {

        if (this.state.loading) {
            return null;
        }

        var data = this.ds.dm.getEntities('occp');
        
        var views = _.map(data, d => {

            var has_children = _.filter(this.ds.dm.getEntities('occp'), p => {
                return _.result(p, 'OCCPPARENTID') === _.result(d, 'ID')
            }).length > 0;

            var view =
                <ListItem owner={this}
                    occp={d}
                    has_children={has_children}
                    animate={this.state.animate}
                    action={Action.expand} />;

            return view;

        });


        return views;

    }
    

    load_occp_data() {

        utils.spin(this.root.find('.loading'));

        var d = Q.defer();

        var parentID = this.state.parent_id;

        if (!parentID) {
            parentID = utils.DBNULL
        }

        var __where: any = {
            "OCCPPARENTID": { eq: parentID }
        }
        

        if (this.state.path && this.state.path.length > 0) {

            var parent_ids = _.map(this.state.path, p => {
                return p.id
            });

            __where = [{
                "or": [{ "ID": { in: parent_ids } }, { "OCCPPARENTID": { eq: parentID } }]
            }]

        }

        this.ds.dm.clear();

        this.ds.fetch_data({

            where: __where,

            orderBy: ["OCCPISCO"]

        }).then(() => {

            d.resolve(true);

        }).finally(() => {

            utils.unspin(this.root.find('.loading'));

        });

        return d.promise;
    }


    expand_node() {

        var id = this.current_event.data;
        
        this.state.parent_id = id;

        this.add_to_path(id);

        this.state.animate = true;

        this.notify({           
            action: 'occp-loading'
        });
    }


    add_to_path(id: string) {

        var path_info = _.find(this.state.path, p => {
            return p.id === id
        });

        if (!path_info) {

            var obj = _.find(this.ds.dm.getEntities('occp'), d => {
                return _.result(d, 'ID') === id;
            });

            this.state.path.push({
                id: id,
                parentid: _.result(obj,'OCCPPARENTID')
            })
        }
    }
}


enum Action { expand, collapse}
interface ListItemProps extends jx.views.ReactiveViewProps {
    action: Action,
    animate?: boolean,
    has_children?: boolean,
    occp:any
}
class ListItem extends jx.views.ReactiveView {

    props: ListItemProps;

    constructor(props: ListItemProps) {
        super(props);
    }

    render() {

        var classlist = null;

        if (this.props.animate) {
            classlist='animated fadeInUp '
        }

        var text_style = 'text-success';
        if (this.props.has_children) {
            text_style = 'text-warning';
        }

        var html =
            <rb.ListGroupItem key={utils.guid()}
                className={'{0}'.format(classlist) } href="#"
                onClick={this.on_click.bind(this) }>

                <table width='100%'>
                    <tbody>
                        <tr>
                            <td>
                                <span className={text_style} style={{ fontSize: 20 }} >
                                    {_.result(this.props.occp, 'OCCPCONCEPT_EN') }
                                </span>
                            </td>
                            <td>
                                <i className="pull-right fa fa-arrow-right"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </rb.ListGroupItem>
            

        return html;
    }


    on_click(e: Event) {
        e.preventDefault();

        switch (this.props.action) {
            case Action.expand: {
                this.expand();
            } break;

            case Action.collapse: {
                this.collapse();
            } break;
        }
    }


    expand() {
        this.broadcast({
            action: 'occp-expand',
            data: _.result(this.props.occp, 'ID')
        });
    }

    collapse() {

        this.broadcast({
            action: 'occp-collapse',
            data: _.result(this.props.occp, 'ID')
        });

    }

}