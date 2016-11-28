// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX



import React = require('react');
import ReactDOM = require('react-dom');

import jx = require('../../core/lib');


interface InsWrapperContentState extends jx.views.ReactiveViewState {
    content: any
}
export class InsWrapperContent extends jx.views.ReactView {

    state: InsWrapperContentState;

    render() {

        var html =
            <div className="row">

                <div className="col-lg-12">

                    <div className="wrapper wrapper-content">
                        {this.state.content}
                    </div>

                </div>

                <div className="footer fixed">
                    <div className="pull-right">
                        10GB of <strong>250GB</strong> Free.
                    </div>
                    <div>
                        <strong>Copyright</strong> Example Company &copy; 2014-2015
                    </div>
                </div>

            </div>

        //
        return html;

    }


    componentWillMount() {

        $('body').addClass('gray-bg');

        jx.pubsub.subscribe('onSetcontent',(msg:any, args:any) => {

            this.setState(_.extend(this.state, args), () => {
                
            });


            
        });
    }


    componentDidMount() {

        super.componentDidMount();

        //1. send to master page that wrapper is ready 
        // --> see master_page for nect action
        jx.pubsub.publish('onWrappercontentMounted');
    }

}