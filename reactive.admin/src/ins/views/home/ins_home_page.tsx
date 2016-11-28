/// <reference path="../../lib/ins_master_page.tsx" />
/// <reference path="ins_dashboard.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');

import { InsMasterPage } from '../../lib/ins_master_page';
import { InsDashboard } from './ins_dashboard';


export class InsHomePage extends InsMasterPage {

    get_page_content() {

        var html = <InsDashboard />

        return html;
    }
}