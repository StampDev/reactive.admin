/// <reference path="../../qw.base/lib/qwview.tsx" />
/// <reference path="../../qw.base/lib/qwpage.tsx" />
/// <reference path="../../qw.base/lib/qwtypes.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;


import vw = require('../../qw.base/lib/qwview');
import page = require('../../qw.base/lib/qwpage');
import tp = require('../../qw.base/lib/qwtypes');


export class InsMenus extends page.QwAppMenus {

    render() {

        var html =
            <div className="sidebar-collapse">

                <ul className="nav metismenu" id="side-menu">
                    <li className="nav-header">
                        <div className="dropdown profile-element">
                            <a data-toggle="dropdown" className="dropdown-toggle" href="#">
                                <span className="clear"> <span className="block m-t-xs"> <strong className="font-bold">David Williams</strong>
                                </span> <span className="text-muted text-xs block">Art Director <b className="caret" /></span> </span> </a>
                            <ul className="dropdown-menu animated fadeInRight m-t-xs">
                                <li><a href="#">Logout</a></li>
                            </ul>
                        </div>
                        <div className="logo-element">
                            IN+
                        </div>
                    </li>


                    {this.build_menus()}
                    
                </ul>
            </div>
        
        return html;
    }


    build_menus() {

        var menus: any = this.app.appSettings.Menus;

        var count: number = 0;

        var views = _.map(menus, (menu: tp.AppMenu) => {

            var is_active = count++ === 0 ? 'active': '';

            var html =
                <li className={"{0}".format(is_active) }>
                    <a href={menu.url}>
                        <i className={"{0}".format(menu.icon) }></i>
                        <span className="nav-label">{"{0}".format(menu.title) }</span>
                    </a>
                </li>


            return html;

        });

        return views;
    }
}


