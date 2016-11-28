/// <reference path="lib.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;

import jx = require('./lib');

export interface ViewState extends jx.views.ReactiveViewState {
}
export interface ViewProps extends jx.views.ReactiveViewProps {
}

export class TypeView<P extends ViewProps, S extends ViewState> extends jx.views.ReactiveView {

    props: P;
    state: S;

    initState(state: S, callback?: () => any) {
        super.setState(state, callback);
    }
    
}

export interface BtState extends jx.views.ReactiveViewState {
}
export interface BtProps extends jx.views.ReactiveViewProps {
}
export class BtCtrl<K extends BtProps, T extends BtState> extends TypeView<K, T> {
    props: K;
    state: T;
}


export interface IconProps extends BtProps {
    icon: string
}
export class Icon extends BtCtrl<IconProps, BtState>{
    render() {
        return <i className={"fa {0}".format(this.props.icon) } {...this.props}></i>
    }
}


export interface TextIconProps extends BtProps {
    icon: any,
    placeholder?: string,
    required?: boolean 
}
export class TextIcon extends BtCtrl<TextIconProps, BtState> {

    render() {
        
        var html =
            <b.FormGroup>
                <b.InputGroup>
                    <b.InputGroup.Addon>
                        <Icon icon={this.props.icon} />
                    </b.InputGroup.Addon>
                    <b.FormControl required={this.props.required} placeholder={this.props.placeholder} {...this.props}/>
                </b.InputGroup>
            </b.FormGroup>;
        return html;
    }
}


export interface TextAreaProps extends BtProps {
    label?: any,
    placeholder?: any
}
export class TextArea extends BtCtrl<TextAreaProps, BtState>{

    render() {

        var label = <b.ControlLabel>{this.props.label}</b.ControlLabel>;

        if (!this.props.label) {
            label = null;
        }

        var html =
            <b.FormGroup>
                {label}
                <b.FormControl componentClass="textarea" placeholder={this.props.placeholder} />
            </b.FormGroup>;

        return html;
    }
}


export function get<T extends BtProps>(ctrl: any, props: T) {
    var View: any = ctrl;
    return <View {...props} />;
}
