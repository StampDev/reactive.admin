/// <reference path="../../lib/ins_master_page.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');

import { InsMasterPage } from '../../lib/ins_master_page';


export class InsHomePage extends InsMasterPage {

    get_page_content() {
        var html =
            <div className="animated fadeInRight">
                <h1><i className="fa fa-home" ></i> Home page</h1>
            </div>

        return html;
    }
}