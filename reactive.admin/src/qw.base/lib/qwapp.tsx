/// <reference path="qwtypes.tsx" />
/// <reference path="qwlib.tsx" />

// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import tp = require('./qwtypes');
import lib = require('./qwlib');

declare var UrlPattern;

export class QwWaveApp {

    constructor() {
        window['quickwave-app'] = this;
    }
    
    private _router: QwRouter;
    
    Start() {

        //1. Init backendless
        this.init_backendLess();

        //2. Init namespace
        this.init_applayout();

        this.startRouter();
    }


    private __settings: tp.AppSettings;
    get appSettings(): tp.AppSettings {
        if (!this.__settings) {
            this.__settings = this.get_app_settings();
        }
        return this.__settings;
    }

    get_app_settings(): tp.AppSettings {
        return null;
    }


    init_backendLess() {
        Backendless.initApp(this.appSettings.BACKENDLESS_APPID,
            this.appSettings.BACKENDLESS_KEYID, this.appSettings.BACKENDLESS_VERID);    
    }


    init_applayout() {
      
    }


    get_AppPageLayout(menu: string): any {
        return null
    }


    startRouter() {

        this._router = new QwRouter(this);

        this._router.startRouting();

    }
}



export module Constants {
    export const CURRENT_ROUTE: string = 'CURRENT_ROUTE'
}

interface urlpattern {
    handler: any,
    url: string;
}

export class QwRouter {
    
    private app: QwWaveApp;

    constructor(app: QwWaveApp) {
        this.app = app;        
    }

    patterns: any[];
    
    startRouting() {
        
        _.each(this.app.appSettings.Menus, r => {

            page(r.url, ctx => {
                
                lib.local.set(Constants.CURRENT_ROUTE, {
                    params: ctx.params,
                    path: ctx.path
                });

                var path = '{0}{1}'.format(this.app.appSettings.pagedir, r.path);

                require([path], rst => {

                    var Page: any = rst[Object.keys(rst)[0]];

                    ReactDOM.unmountComponentAtNode($('#applayout')[0]);

                    ReactDOM.render(<Page />, $('#applayout')[0]);

                });
                
            });
            
        });
        
        page.start();
        
    }
    
}