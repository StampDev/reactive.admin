/// <reference path="../../../core/jx__.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');


export class InsLoginPage extends jx.views.ReactView {


    render() {

        var html =
            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>
                    <div>
                        <h1 className="logo-name">AF+</h1>
                    </div>
                    <h3>Afriknet Market</h3>
                    <p>Perfectly designed and precisely prepared admin theme with over 50 pages with extra new web app views.
                        {/*Continually expanded and constantly improved Inspinia Admin Them (IN+)*/}
                    </p>
                    <p>Login in.To see it in action.</p>
                    <form action="index.html" role="form" className="m-t">
                        <div className="form-group">
                            <input type="email" required placeholder="Username" className="form-control" />
                        </div>
                        <div className="form-group">
                            <input type="password" required placeholder="Password" className="form-control" />
                        </div>
                        <button className="btn btn-primary block full-width m-b" type="submit">Login</button>
                        <a href="#"><small>Forgot password?</small></a>
                        <p className="text-muted text-center"><small>Do not have an account?</small></p>
                        <a href="register.html" className="btn btn-sm btn-white btn-block">Create an account</a>
                    </form>
                    <p className="m-t"> <small>Inspinia we app framework base on Bootstrap 3 © 2014</small> </p>
                </div>
            </div>



        return html;

    }
}