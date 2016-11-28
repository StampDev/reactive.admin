/// <reference path="../../core/jx__.tsx" />
/// <reference path="ins_wrapper_content.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');

import jx = require('../../core/lib');

import { InsPageSubNavBar } from './ins_page_subnavbar';
import { InsWrapperContent } from './ins_wrapper_content';


export class InsPageWrapper extends jx.views.ReactView {

    render() {

        var html =
            <div id="page-wrapper" className="gray-bg dashbard-1">

                <InsPageSubNavBar />          

                <InsWrapperContent />

            </div>


        return html;
    }
    
}