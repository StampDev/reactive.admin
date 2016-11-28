
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


export class SmrtMenus extends page.QwAppMenus {

    render() {

        var html =
            <aside id="left-panel">
                {/* User info */}
                <div className="login-info">
                    <span> {/* User image size is adjusted inside CSS, it should stay as is */}
                        <a href="javascript:void(0);" id="show-shortcut" data-action="toggleShortcut">
                            <img src="/smrt/img/avatars/sunny.png" alt="me" className="online" />
                            <span>
                                john.doe
                            </span>
                            <i className="fa fa-angle-down" />
                        </a>
                    </span>
                </div>
                {/* end user info */}
                {/* NAVIGATION : This navigation is also responsive

			To make this navigation dynamic please make sure to link the node
			(the reference to the nav > ul) after page load. Or the navigation
			will not initialize.
			*/}
                <nav>
                    {/* 
				NOTE: Notice the gaps after each icon usage <i></i>..
				Please note that these links work a bit different than
				traditional href="" links. See documentation for details.
				*/}
                    <ul>
                        {this.build_menus()}
                    </ul>
                </nav>
                <span className="minifyme" data-action="minifyMenu"> <i className="fa fa-arrow-circle-left hit" /> </span>
            </aside>


        return html;
    }
    

    build_menus() {

        var menus: any = this.app.appSettings.Menus;

        var count: number = 0;

        var views = _.map(menus, (menu: tp.AppMenu) => {

            var is_active = count++ === 0 ? 'active' : '';

            var html =
                <li className="">
                    <a href={menu.url} title={menu.title}>
                        <i className={"{0}".format(menu.icon) }></i>
                        <span className="menu-item-parent">{"{0}".format(menu.title) }</span>
                    </a>
                </li>


            return html;

        });

        return views;
    }
}
