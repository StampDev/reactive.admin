// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import jx = require('../../core/lib');



export class InsPageNavBar extends jx.views.ReactView {

    render() {

        var html =
            <nav role="navigation" className="navbar-default navbar-static-side">
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
                                    <li><a href="profile.html">Profile</a></li>
                                    <li><a href="contacts.html">Contacts</a></li>
                                    <li><a href="mailbox.html">Mailbox</a></li>
                                    <li className="divider" />
                                    <li><a href="login.html">Logout</a></li>
                                </ul>
                            </div>
                            <div className="logo-element">
                                HR+
                            </div>
                        </li>

                        <li className="active">
                            <a href="/"><i className="fa fa-home" /> <span className="nav-label">Home</span> </a>                            
                        </li>

                        <li>
                            <a href="/inventory"><i className="fa fa-cubes" /> <span className="nav-label">Inventory</span> </a>
                        </li>

                        <li>
                            <a href="/admin"><i className="fa fa-th-large" /> <span className="nav-label">Admin</span> </a>
                        </li>
                    </ul>
                </div>
            </nav>
        
        return html;
    }



    componentDidMount() {

        super.componentDidMount();

        this.highlight_active_menu();

    }



    highlight_active_menu() {

        $('.sidebar-collapse li').removeClass('active');
        $('.sidebar-collapse li a').removeClass('active');

        var route: jx.core_types.route_page_info = jx.local.get(jx.constants.router.current_route);

        var menu = route.path;

        //if (!menu || menu === '/') {
        //    menu = '/account/dashboard'
        //}

        $('#side-menu').find('[href="{0}"]'.format(menu)).closest('li').addClass('active');

        //$('.nav-second-level [href="{0}"]'.format(menu)).closest('.collapse').addClass('in');
        //$('.nav-second-level [href="{0}"]'.format(menu)).closest('li').addClass('active');
        //$('.nav-second-level [href="{0}"]'.format(menu)).parents('li').last().addClass('active');
    }

}