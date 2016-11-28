/// <reference path="../qw.base/lib/qwapp.tsx" />
/// <reference path="../qw.base/lib/qwtypes.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import app = require('../qw.base/lib/qwapp');
import tp = require('../qw.base/lib/qwtypes');



export class AppBase extends app.QwWaveApp {

    get_app_settings(): tp.AppSettings {

        return {

            BACKENDLESS_APPID: '5F76BFFF-B6EE-F6AB-FFE2-5051554CA500',
            BACKENDLESS_KEYID: '06A5D87B-83D9-0A58-FF6A-11ABA901C100',
            BACKENDLESS_VERID: 'V1',

            namespace: 'qw.ins',
            pagedir: '../../qw.ins',

            Menus: [
                { name: 'home', title: 'home', icon: 'fa fa-home', url: '/' },
                { name: 'products', title: 'products', icon: 'fa fa-th-large', url: '/products/*' },
                { name: 'customers', title: 'customers', icon: 'fa fa-user', url: '/customers'}
            ]
        }
    }
}