/// <reference path="../../../qw.base/lib/qwexplorer.tsx" />
/// <reference path="../../app/smrtpage.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;

import qw = require('../../../qw.base/lib/qwview');
import ex = require('../../../qw.base/lib/qwexplorer');
import smrt = require('../../app/smrtpage');


export class ProductExplorerPage extends smrt.SmartPage {

    get_uiSchema() {

        var ui = super.get_uiSchema();

        ui.content = <ExplorerContent owner={this as any} />

        return ui;
    }
}



class ExplorerContent extends ex.QwExplorer{

    get_model() {
        return 'products';
    }

}