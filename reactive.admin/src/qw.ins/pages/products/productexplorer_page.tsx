/// <reference path="../../../qw.base/lib/qwexplorer.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;
import ins = require('../../app/inspage');
import qw = require('../../../qw.base/lib/qwview');
import ex = require('../../../qw.base/lib/qwexplorer');


export class ProductExplorerPage extends ins.InsPage {

    get_uiSchema() {

        var ui = super.get_uiSchema();

        ui.content = <ExplorerContent owner={this} />

        return ui;
    }
}



class ExplorerContent extends ex.QwExplorer{

    get_model() {
        return 'products';
    }

}