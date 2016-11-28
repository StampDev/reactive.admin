// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import jx = require('../../core/lib');



export class InsPageNavBar extends jx.views.ReactiveView {

    render() {
        
        var html =
            <nav role="navigation" className="navbar-default navbar-static-side ">
                <div className="sidebar-collapse">
                    <ul id="side-menu" className="nav metismenu">
                        <li className="nav-header">
                            <div className="dropdown profile-element">
                                <span>
                                    <img src="/ins/img/profile_small.jpg" className="img-circle" alt="image" />
                                </span>
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <span className="clear">
                                        <span className="block m-t-xs">
                                            <strong className="font-bold">David Williams</strong>
                                        </span> <span className="text-muted text-xs block">Art Director <b className="caret" /></span>
                                    </span>
                                </a>
                                <ul className="dropdown-menu animated fadeInRight m-t-xs">
                                    <li><a href="#">Profile</a></li>
                                    <li><a href="#">Contacts</a></li>
                                    <li><a href="#">Mailbox</a></li>
                                    <li className="#" />
                                    <li><a href="#">Logout</a></li>
                                </ul>
                            </div>
                            <div className="logo-element">
                                HR+
                            </div>
                        </li>

                        {this.build_menus()}

                    </ul>
                </div>
            </nav>
        
        return html;
    }


    on_notify() {

        switch (this.current_event.action) {

            case jx.constants.events.view_initialized: {


            } break;

        }

        return super.on_notify();

    }


    build_menus() {

        var route = jx.local.get(jx.constants.router.current_route);

        var active_url = route ? route.path : null;

        // get menus as defined in app context
        var appMenus = _.filter(this.app.get_menus(), mn => !mn.hidden);

        var menus = [];
        
        _.each(appMenus, menu => {
            
            var children = menu.submenus ?
                _.filter(menu.submenus, sub => !sub.hidden) : [];

            var sub_menus = null;

            if (children.length) {

                var has_active_submenu = false;

                var subs =
                    _.map(children, c => {


                        var flatten_menu = _.find(this.app.router.flatten_menus, mn => {
                            return mn.name === c.name
                        });


                        var submenu_is_active = (active_url && this.app.router.matching_url(active_url, flatten_menu.url)) ? 'active' : '';

                        if (!submenu_is_active) {

                            if (flatten_menu.alters) {

                                var found = _.filter(flatten_menu.alters, alt => {

                                    var mn = this.app.router.find_menu_by_name(alt);

                                    return mn && this.app.router.matching_url(active_url, mn.url)

                                }).length > 0;

                                submenu_is_active = found ? 'active' : '';
                            }

                        }


                        has_active_submenu = has_active_submenu || submenu_is_active != '';


                        var li =
                            <li className={"li-menu sub-menu no-outline {0}".format(submenu_is_active) }>
                                <a data-menu={c.name} data-menu-parent={menu.name} href={flatten_menu.url} className="no-outline">
                                    {c.title}
                                </a>
                            </li>;

                        return li;
                    });


                var collapse = has_active_submenu ? 'collapse in' : 'collapse';


                sub_menus =
                    <ul className={"nav nav-second-level {0}".format(collapse) }>{subs}</ul>;
            }


            var lookup = _.find(this.app.router.flatten_menus, mn => {
                return mn.name === menu.name
            });


            var icon = menu.icon ? <i className={menu.icon}></i> : null;


            var arrow = children.length > 0 ? <span className="fa arrow"></span> : null;


            var active = has_active_submenu || (this.app.router.matching_url(active_url, lookup.url)) ? 'active' : '';


            var _view =
                <li className={"li-menu root-menu no-outline {0}".format(active) }>
                    <a href={lookup.url} data-menu={menu.name} className="no-outline">
                        {icon}
                        <span>{menu.title}</span>
                        {arrow}
                    </a>
                    {sub_menus}
                </li>;

            menus.push(_view);

        });

        
        return menus;
    }


}