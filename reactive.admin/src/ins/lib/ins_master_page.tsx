
/// <reference path="../../core/jx__.tsx" />
/// <reference path="ins_page_menus.tsx" />

/// <reference path="ins_page_wrapper.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');

import jx = require('../../core/lib');

import { InsPageNavBar } from './ins_page_menus';
import { InsPageWrapper } from './ins_page_wrapper';



export module ins {

    export module constants {

        export const on_tbl_record_opened = 'on_tbl_record_opened'
    }

}



export class InsMasterPage extends jx.views.BaseMasterPage {


    render() {

        var html =
            <div className="master-page">

                <InsPageNavBar />
                
                <InsPageWrapper />
                
            </div>


        return html;

    }


    componentWillMount() {

        $('body').addClass('gray-bg');

        // 2. received message from wrapper_content
        jx.pubsub.subscribe('onWrappercontentMounted', () => {

            this.set_content();

        });
    }

    componentDidMount() {

        $('body').removeClass('gray-bg');

        $.getScript('/ins/js/inspinia.js');
    }


    set_content() {

        // 3. send content to wrapper_content
        jx.pubsub.publish('onSetcontent', {
            content: this.get_page_content()
        })
    }


    get_page_content() {
        return null
    }
}