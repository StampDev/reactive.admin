/// <reference path="insmenus.tsx" />
/// <reference path="../../qw.base/lib/qwview.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


/// <reference path="../../qw.base/lib/qwpage.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;

import p = require('../../qw.base/lib/qwpage');
import vw = require('../../qw.base/lib/qwview');
import mn = require('./insmenus');

interface uiSchema extends vw.QwUiSchema {
}
export class InsPage extends p.QwPage<any, any>{

    constructor(props:any) {

        super(props);
        
    }


    render() {

        var ui: any = this.get_uiSchema();
        
        var html =
            <div id='wrapper'>

                <nav className="navbar-default navbar-static-side" role="navigation">

                    {ui.appMenus}

                </nav>


                <div id="page-wrapper" className="gray-bg">
                    <div className="row border-bottom">
                        <nav className="navbar navbar-static-top white-bg" role="navigation" style={{ marginBottom: 0 }}>
                            <div className="navbar-header">
                                <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i className="fa fa-bars" /> </a>
                                <form role="search" className="navbar-form-custom" method="post" action="#">
                                    <div className="form-group">
                                        <input type="text" placeholder="Search for something..." className="form-control" name="top-search" id="top-search" />
                                    </div>
                                </form>
                            </div>
                            <ul className="nav navbar-top-links navbar-right">
                                <li>
                                    <a href="#">
                                        <i className="fa fa-sign-out" /> Log out
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="row">
                            <div className="col-lg-12">
                                {ui.content}
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="pull-right">
                            10GB of <strong>250GB</strong> Free.
                        </div>
                        <div>
                            <strong>Copyright</strong> Example Company © 2014-2015
                        </div>
                    </div>
                </div>


            </div>;

        return html;
    }


    componentDidMount() {

        super.componentDidMount();

        $('body').removeClass('gray-bg');

        $.getScript('/ins/js/inspinia.js');
        
    }


    get_uiSchema() {

        return {

            appMenus: <mn.InsMenus owner={this} />,

            content: <div className="text-center m-t-lg">
                <h1>
                    Welcome in INSPINIA Static SeedProject
                </h1>
                <small>
                    It is an application skeleton for a typical web app.You can use it to quickly bootstrap your webapp projects and dev environment for these projects.
                </small>
            </div>
        }
    }
    
}