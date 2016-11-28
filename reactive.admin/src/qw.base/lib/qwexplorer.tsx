/// <reference path="qwdata.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;

import ap = require('./qwapp');
import lib = require('./qwlib');
import qw = require('./qwview');
import tp = require('./qwtypes');
import qd = require('./qwdata');



export interface QwExplorerState extends qw.QwState {
}
export interface QwExplorerProps extends qw.QwProps {
}
export class QwExplorer extends qw.QwView<QwExplorerProps, QwExplorerState>{

    get_model() {
        return null;
    }

    private _ds: qd.DataSource;
    get ds(): qd.DataSource{
        if (!this._ds) {
            this._ds = new qd.DataSource(this.get_model());
        }
        return this._ds;
    }


    render() {

        var ui:any = this.get_uiSchema();

        var html =
            <div>
                {ui.title}  {ui.buttons}

                {ui.datalist}


                {ui.data_form}

            </div>;

        return html;
    }


    on_notify(): Q.Promise<any> {

        switch (this.activeEvent.name) {

            case qw.Constants.HasMounted: {

                this.load_data();

            } break;
        }
        
        return super.on_notify();
    }


    load_data() {

        return this.ds.fetch_data();

    }
}

