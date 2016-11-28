// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../core/lib');


export class Page404 extends jx.views.ReactView {


    render() {

        var html =
            <div className="middle-box text-center animated fadeInDown">
                <h1>404</h1>
                <h3 className="font-bold">Page Not Found</h3>
                <div className="error-desc">
                    Sorry, but the page you are looking for has note been found.Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.
                    <form role="form" className="form-inline m-t">
                        <div className="form-group">
                            <input type="text" placeholder="Search for page" className="form-control" />
                        </div>
                        <button className="btn btn-primary" type="submit">Search</button>
                    </form>
                </div>
            </div>



        return html;

    }
}