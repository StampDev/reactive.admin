/// <amd-dependency path="url-pattern" />
// A '.tsx' file enables JSX support in the TypeScript compiler,
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../core/lib');

var _urlp = require('url-pattern');


interface InsPageBreadCrumbState extends jx.views.ReactiveViewState {
    pagetitle: any,
    custom_content:any
}
export class InsPageBreadCrumb extends jx.views.ReactiveView {

    state: InsPageBreadCrumbState;

    render() {

        var route = jx.local.get(jx.constants.router.current_route);
        
        var menu = this.app.router.find_matching_menu(route.path);
        
        var parent = _.find(this.app.router.flatten_menus, mn => mn.name === menu.parent);
        var header = parent ? (parent.header ? parent.header : parent.title)
            : menu.header ? menu.header : menu.title;
        
        var items = [];
        

        if (menu.name != 'home') {
            
            items.push(<li><a href="/">Home</a></li>);
            
            if (parent) {
                items.push(<li><a href="#">{parent.title}</a></li>);
            }

            var title = menu.header ? menu.header : menu.title;

            items.push(<li className="active"><a href="#"><strong>{title}</strong></a></li>);
        }

        var html =
            <div className="row wrapper border-bottom white-bg page-heading">

                <div className="col-lg-5">

                    <h2>{header}</h2>

                    <ol className="breadcrumb">
                        {items}
                    </ol> 
                </div>

                <div className="col-lg-7">
                    <div className="">
                        {this.state.custom_content}
                    </div>
                </div>
            </div>;
        
        return html;
    }


    on_notify() {

        switch (this.current_event.action) {

            case 'update-page-title': {
                
                this.setState({
                    pagetitle: this.current_event.data
                });
                
            } break;


            case 'on-custom-content': {

                this.newState({
                    custom_content: this.current_event.data
                });
                
            } break;

        }
        
        return super.on_notify();
    }
    
}
