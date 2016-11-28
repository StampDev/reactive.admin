/// <reference path="../../qw.base/lib/qwtypes.tsx" />
/// <reference path="../../qw.base/lib/qwapp.tsx" />
/// <reference path="smrtpage.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import app = require('../../qw.base/lib/qwapp');
import tp = require('../../qw.base/lib/qwtypes');
import cli = require('../../qw.cli/app');
import page = require('./smrtpage');


export class SmartApp extends cli.AppBase {

    get_app_settings(): tp.AppSettings {

        var setts = _.extend(super.get_app_settings(), {
            namespace: 'qw.smrt',
            pagedir: '../../qw.smrt',

            Menus: [
                { name: 'home', title: 'home', icon: 'fa fa-home', url: '/', path:'/pages/home/smrt-homepage' },
                { name: 'products', title: 'products', icon: 'fa fa-th-large', url: '/products/*', path:'/pages/products/productexplorer_page' },
                { name: 'customers', title: 'customers', icon: 'fa fa-user', url: '/customers' }
            ]
        });

        return setts;
    }

    get_AppPageLayout(menu: string): any {
        return <page.SmartPage />
    }

}