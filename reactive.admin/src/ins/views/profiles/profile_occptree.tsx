/// <reference path="profiles_new.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import jx = require('../../../core/lib');

import rb = require('react-bootstrap');
var b: any = rb;


interface PathInfo {
    id: string,
    parentid: string,
    level: number
}
export interface OccpTreeViewProps extends jx.views.ReactiveViewProps {
    noAnim?: boolean
}
interface OccpTreeViewState extends jx.views.ReactiveViewState {
    parentId: string,
    level: number,
    is_left: boolean,    
    path: PathInfo[];
}
export class OccpTreeView extends jx.views.ReactiveView {

    props: OccpTreeViewProps;
    state: OccpTreeViewState;
    
    constructor(props: OccpTreeViewProps) {
        super(props);
        this.state.loading = true;
        this.state.is_left = true;
        this.state.level = 1;
        this.state.path = [];
    }

    //var ds = new jx.data.DataSource('occp');
    __ds: jx.data.DataSource;
    get ds(): jx.data.DataSource {
        if (!this.__ds) {
            this.__ds = new jx.data.DataSource('occp');
        }
        return this.__ds;
    }

    render() {
        
        var content = null;

        if (this.state.loading) {
            content = null; //<div className="loading" style={{ minHeight: 400 }} ></div>;
        } else {

            content = 
                <div>
                    <SearchTerm />

                    <div className="row" style={{ maxHeight: 590, 'overflow-y': 'scroll' }}>
                        <rb.Col lg={7}>
                            {this.build_tree() }
                        </rb.Col>
                    </div>
                </div>
        }

        var html =
            <div>
                <div className="bg-warning p-xs b-r-sm m-b-sm">
                    <strong>Find an isco occupation</strong> <span> Select a specific occupation or click the right arrow </span> <span className="fa fa-arrow-right text-primary" ></span>  <span> to expand and access further options</span>
                </div>

                {content}
                
            </div>
            
        return html;

    }


    on_notify() {

        switch (this.current_event.action) {

            case 'tree-loading':
            case jx.constants.events.view_initialized: {

                utils.spin(this.root);

                this.load_occp_data().then(() => {

                    this.notify({
                        action: 'tree-loaded'
                    });

                });

            } break;


            case 'tree-loaded': {

                var that = this;

                this.setState(_.extend(this.state, {
                    loading: false
                }), () => {

                    utils.unspin(this.root);

                    this.root['slimScroll']({
                        'height': '600px'
                    });

                });

            } break;


            case 'expand-node': {

                var _args = this.current_event.data;

                this.state.is_left = true;

                if (_args['from_collapse']) {
                    _args = _args['parent_id'];
                    this.state.is_left = false;                    
                }

                this.expand_node(_args);
                
            } break;

            case 'collapse-node': {
                
                this.collapse_node(this.current_event.data);
   
            } break;


            case 'checkbox-enable': {

                this.root.find('.selection').slideUp(200, () => {
                    this.root.find('.selected-occp').empty();
                });
                
            } break;                
        }


        return super.on_notify();
    }


    expand_node(nodeid: string) {

        this.newState({
            loading: true,            
            parentId: nodeid
        }, () => {

            this.notify({
                action: 'tree-loading'
            });
        });

    }


    collapse_node(src_id: string) {

        var occp = _.find(this.ds.dm.getEntities('occp'), obj => {
            return _.result(obj, 'ID') === src_id
        });
        
        var parent_id = _.result(occp, 'OCCPPARENTID');

        this.update_path(parent_id);
        
        this.notify({
            action: 'expand-node',
            data: {
                parent_id: parent_id,
                from_collapse: true
            },            
        });
    }


    update_path(from_id: string) {
        
        var path_info = _.find(this.state.path, p => {
            return p.id === from_id
        });
        
        if (path_info) {

            this.state.path = _.filter(this.state.path, p => {
                return p.level < path_info.level
            });

        } else {

            this.state.path = [];

        }
        
    }


    load_occp_data() {

        utils.spin(this.root.find('.loading'));

        var d = Q.defer();

        var parentID = this.state.parentId;

        if (!parentID) {
            parentID = utils.DBNULL 
        }

        var __where:any = {
            "OCCPPARENTID": { eq: parentID }
        }

        if (this.state.parentId) {

            var parent_obj = _.find(this.ds.dm.getEntities('occp'), p => {
                return _.result(p, 'ID') === this.state.parentId
            });

            this.state.path.push({
                id: this.state.parentId,
                parentid: _.result(parent_obj, 'ID'),
                level: _.result(parent_obj, 'OCCPISCO') ? _.result(parent_obj, 'OCCPISCO').length : 5
            })            
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


    build_tree() {

        if (this.state.loading) {
            return null;            
        }

        var anim = this.state.is_left ? introAnimation.fromLeft : introAnimation.fromRight;

        if (this.props.noAnim) {
            anim = introAnimation.noAnim
        }

        return <TreeNodes owner={this} key={utils.guid() }
            anim ={anim}
            data={this.ds.dm.getEntities('occp') }
            level={this.state.level}
            keyfield="ID"
            displayfield="OCCPCONCEPT_EN"
            parentfield="OCCPPARENTID" />

    }
}



enum introAnimation { fromLeft, fromRight, noAnim }

interface TreeNodesProps extends jx.views.ReactiveViewProps {
    data: any[],
    level: number,
    keyfield: string,
    displayfield: string,
    parentfield: string,
    anim: introAnimation
}
class TreeNodes extends jx.views.ReactiveView {

    props: TreeNodesProps;
    count: number;

    render() {

        var roots: any = _.filter(this.props.data, d => {
            
            return !_.result(d, 'OCCPPARENTID')

        });

        var animation = '{0}'.format(this.props.anim === introAnimation.fromLeft ? 'fadeInLeft': 'fadeInRight');

        if (this.props.anim === introAnimation.noAnim) {
            animation = '';
        }

        var html =
            <div className={"root-tree animated {0}".format(animation)} >
                <div className="dd dd-nodrag">
                    <ol className="dd-list">
                        {this.fill_nodes(roots) }
                    </ol>
                </div>
            </div>                   

        return html;
    }


    fill_nodes(nodes:any[]) {

        if (!this.count) {
            this.count = 1;
        }

        var that = this;
        
        var views = _.map(nodes, node => {

            var children = _.filter(that.props.data, p => _.result(p, this.props.parentfield) === _.result(node, this.props.keyfield));
            
            var _text = _.result(node, that.props.displayfield);
            var isco: string = _.result(node, 'OCCPISCO');

            var length = isco ? isco.length : 5;

            var return_icon = null;
            var strong = '';
            

            if (children.length > 0) {

                strong = 'text-bold';

                return_icon =
                    <button className="btn btn-warning btn-sm btn-outline btn-collapse"
                        style={{ marginRight: 15 }}
                        onClick={this.collapse_node.bind(this) }>
                        <i className="fa fa-reply"></i>
                    </button>;                    
            }


            var btn_expand =
                <a href="#" className="btn btn-primary btn-outline btn-sm pull-right btn-expand" onClick={this.expand_node.bind(this) }>
                    <i className="fa fa-arrow-right"></i>
                </a>;


            if (children.length > 0 || length > 4) {

                btn_expand = null;
            }

            var text_style = { fontSize:15, color: 'gray' };

            if (children.length > 0) {
                text_style['font-weight'] = 'bold';
            }

            var checkbox = <CheckBox  />;

            if (length > 4) {
                checkbox = null;
            }
            

            var tr:any[] = [
                <td key={1} width="6%">{return_icon}</td>,
                <td key={2} width="5%">{checkbox}</td>,
                <td key={3}>
                    <div style={{ marginLeft: 15, display: 'inline-block', maxHeight: 60, width: '80%' }}>

                        <span className={'node-txt {0}'.format(strong) } style={text_style}>
                            { _text }
                        </span>

                    </div>
                </td>,
                <td key={4}>
                    {btn_expand}
                </td>
            ];

            if (!return_icon) {
                tr.shift();
            }

            var content = 
                <table width="100%">
                    <tbody>
                        {tr}
                    </tbody>
                </table>;
            
            var li =
                <li className="dd-item" data-id={this.count++}
                    data-occpisco={_.result(node, 'OCCPISCO') }
                    data-rowid={_.result(node, this.props.keyfield) }>

                    <div className="dd-handle dd-nodrag">

                        <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                            
                            {content}

                        </div>
                        
                    </div>

                    {this.fill_descendants(children) }
                </li>

            return li;
        });

        return views;
    }


    fill_descendants(children: any[]) {

        if (!children || children.length === 0) {
            return null;
        }

        var view =
            <ol className="dd-list">
                {this.fill_nodes(children) }
            </ol>    

        return view;
    }


    collapse_node(e: Event) {

        e.preventDefault();

        if ($(e.currentTarget).hasClass('btn-disabled')) {
            return;
        }

        var rowid = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');

        this.props.owner.notify({
            action: 'collapse-node',
            data: rowid
        });

    }
    

    expand_node(e: Event) {

        e.preventDefault();

        if ($(e.currentTarget).hasClass('btn-disabled')) {
            return;
        }

        var rowid = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');

        this.props.owner.notify({
            action: 'expand-node',
            data: rowid
        });

    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {

                this.root.find('.dd')['nestable']();

                this.root.find('[data-action="collapse"]').hide();

                this.root.find('.node-txt')['dotdotdot']();

            } break;

            case 'checkbox-enable': {

                this.root.find('.btn-collapse').addClass('btn-warning').removeClass('btn-default btn-disabled op-2')
                this.root.find('.btn-expand').removeClass('btn-default btn-disabled op-2').addClass('btn-primary')

                this.broadcast({
                    action: 'occp-unselected'
                });

            } break;

            case 'checkbox-disable': { // this means that a occp has just been selected

                this.root.find('.btn-expand').removeClass('btn-primary').addClass('btn-default btn-disabled op-2');
                this.root.find('.btn-collapse').removeClass('btn-warning').addClass('btn-default btn-disabled op-2')

                var occpid = this.root.find('.checkbox-selected').closest('[data-rowid]').attr('data-rowid');
                var isco = this.root.find('.checkbox-selected').closest('[data-rowid]').attr('data-occpisco');

                var text = this.root.find('.checkbox-selected').closest('[data-rowid]').find('.node-txt').html();

                this.broadcast({
                    action: 'occp-selected',
                    data: {
                        occpid: occpid,
                        occpisco: isco,
                        text : text
                    }
                });

            } break;                
        }

        return super.on_notify();
    }
}


class SearchTerm extends jx.views.ReactiveView{

    render(){

        var html =
            <form>
                <b.FormGroup>          
                    <b.FormControl
                        type="text"            
                        placeholder="Enter a search term" />          
                </b.FormGroup>
            </form>;
        
        return html;

    }

}


interface CheckBoxState extends jx.views.ReactiveViewState {
    is_checked: boolean,
    is_enabled: boolean
}
class CheckBox extends jx.views.ReactiveView {

    constructor(props?: any) {
        super(props);
        this.enabled = true;
    }

    state: CheckBoxState;
    private skip: boolean;
    private enabled: boolean;
    
    get checkbox(): jx.controls.IconCheckBox {
        return this.refs['checkbox'] as any
    }


    render() {
        
        var html =
            <div style={{ display: 'inline' }}>
                <jx.controls.IconCheckBox
                    is_checked={this.state.is_checked}
                    is_enabled={this.state.is_enabled}
                    ref='checkbox' onChecked={this.onchecked.bind(this) }  />
            </div>;

        return html;
    }


    onchecked(e: Event) {

        if (!this.enabled) {
            return;
        }

        this.skip = true;
       
        if (this.checkbox.is_checked) {
            
            this.broadcast({
                action: 'checkbox-disable'                
            });

        } else {

            this.broadcast({
                action: 'checkbox-enable',
            });
        }
    }

    on_notify(): Q.Promise<any> {
        
        switch (this.current_event.action) {

            case 'checkbox-enable': {

                if (this.skip) {

                    this.skip = false;

                } else {

                    this.newState({                        
                        is_enabled: true
                    });

                }

            } break;

            case 'checkbox-disable': {          

                if (this.skip) {

                    this.skip = false;
                    
                } else {

                    this.newState({
                        is_checked: false,
                        is_enabled: false
                    });

                }
                
            } break;
                
        }

        return super.on_notify();
    }
}



