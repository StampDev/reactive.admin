/// <reference path="qwlib.tsx" />
/// <reference path="qwapp.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;

import ap = require('./qwapp');
import lib = require('./qwlib');


var viewcount: number = 1;

declare var PubSub;


export module Constants {

    export const HasMounted: string = 'HasMounted'
    export const HasUpdated: string = 'HasUpdated'    
}


export interface QwEventBroadcast {
    name: string,
    args?: any,
    done?: (args?: any) => any    
}


interface QwViewAccessViewCallBack {
    (view: QwView<any,any>): void
}


export interface QwUiSchema {
}
export interface QwState {
}
export interface QwProps extends React.Props<any> {
    owner?: QwView<any, any>
}
export class QwView<P extends QwProps, S extends QwState> extends React.Component<P, S>{


    get app(): ap.QwWaveApp {
        return window['quickwave-app'] as ap.QwWaveApp;
    }


    get root(): JQuery {
        return $(ReactDOM.findDOMNode(this));
    }


    private _viewid: any
    get viewid(): any {

        if (!this._viewid) {
            this._viewid = 'view-' + viewcount++;
        }
        return this._viewid;
    }


    activeEvent: QwEventBroadcast;


    constructor(props: P) {

        super(props);

        this.notify_handler = lib.pubsub.subscribe(this.viewid, (msg: string, data: any) => {

            this.activeEvent = data;

            this.on_notify().then((args: any) => {

                if (this.activeEvent.done) {
                    this.activeEvent.done(args);
                }

            }).fail(err => {

                toastr.error(JSON.stringify(err), 'Notify failed');
            })
        });


        this.get_view_handler = lib.pubsub.subscribe('get-' + this.viewid, (msg: string, data: any) => {

            var callback = data;

            callback(this);
        });


        this.broadcast_handler = lib.pubsub.subscribe(lib.pubsub.BROADCAST, (msg, data: any) => {
            this.activeEvent = data;
            this.on_notify();
        });
    }
    

    private notify_handler: number;
    private broadcast_handler: number;
    private get_view_handler: number;


    componentWillReceiveProps(next: P) {        
        
    }


    componentWillMount() {

    }


    componentDidMount() {

        this.notify({
            name: Constants.HasMounted
        });
    }


    componentDidUpdate() {

        this.notify({
            name: Constants.HasUpdated
        });

    }


    componentWillUnmount() {

        PubSub.unsubscribe(this.broadcast_handler);
        PubSub.unsubscribe(this.notify_handler);
        PubSub.unsubscribe(this.get_view_handler);

    }
    

    componentWillUpdate() {

    }


    get_uiSchema(): QwUiSchema {
        return {};
    }


    newState(state: S, done?: () => any) {

        this.setState(_.extend(this.state, state), () => {
            if (done) {
                done();
            }
        });
    }

    
    on_notify(): Q.Promise<any> {
        return Q.resolve(true);
    }


    notify(event: QwEventBroadcast) {
        lib.pubsub.publish(this.viewid, event);
    }


    accessView(viewid: string, callback: QwViewAccessViewCallBack) {
        return PubSub.publishSync('get-' + viewid, callback);
    }


    broadcast(event: QwEventBroadcast) {
        lib.pubsub.publish(lib.pubsub.BROADCAST, event);
    }
}


class TestView extends QwView<QwProps, QwState>{
    
}