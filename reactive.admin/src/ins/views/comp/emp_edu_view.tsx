// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import jx = require('../../../core/lib');
import rb = require('react-bootstrap');
var b: any = rb;




export interface EmpEduViewProps extends jx.views.ReactiveViewProps{
    emp: breeze.Entity
}
export interface EmpEduViewState extends jx.views.ReactiveDataViewState {
    emp: breeze.Entity
}
export class EmpEduView extends jx.views.ReactiveView {

    constructor(props: EmpEduViewProps) {
        super(props);
        this.state.emp = props.emp;
    }

    props: EmpEduViewProps;
    state: EmpEduViewState;


    render() {

        var html =
            <b.Row>
                <b.Col lg={12}>
                    <h2>
                        <span className="text-success">Education</span>
                        <b.Button bsStyle="primary" bsSize="xs"
                            className="btn-outline m-l-md">
                            <i className="fa fa-plus"></i> add
                        </b.Button>
                    </h2>
                </b.Col>
            </b.Row>

        return html;
    }

}