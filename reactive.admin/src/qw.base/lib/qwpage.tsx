/// <reference path="qwtypes.tsx" />
/// <reference path="qwview.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;


import ap = require('./qwapp');
import lib = require('./qwlib');
import qv = require('./qwview');
import tp = require('./qwtypes');



export interface QwPageState extends qv.QwState {
}
export interface QwPageProps extends qv.QwProps {
}
export class QwPage<P extends QwPageProps, S extends QwPageState> extends qv.QwView<P, S> {
}


export interface QwAppMenusProps extends qv.QwProps {
}
export class QwAppMenus extends qv.QwView<QwAppMenusProps, any>{
}



export interface QwExplorerState extends qv.QwState {
}
export interface QwExplorerProps extends qv.QwProps {
}
export class QwExplorer extends qv.QwView<QwExplorerProps, QwExplorerState>{

    render() {

        var ui: any;

        var html;

        return html;
    }

}


