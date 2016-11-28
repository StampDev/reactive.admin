/// <reference path="../../../core/ui.tsx" />
/// <reference path="../../../core/lib.tsx" />

// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;

import jx = require('./../../core/lib');
import ui = require('../../../core/ui');



export interface TextState extends ui.BtProps {

}
export interface TextProps extends ui.BtProps {
    label?: any,
    item?: any,
    field?: any,
    placeholder?: any,
    cls?: any,
    style?: any    
}
export class Text extends ui.TypeView<TextProps, TextState>{

    render() {

        var html =
            <b.FormGroup>
                <b.InputGroup>                    
                    <b.FormControl required  placeholder={this.props.placeholder} {...this.props}/>
                </b.InputGroup>
            </b.FormGroup>


        return html;
    }
}
