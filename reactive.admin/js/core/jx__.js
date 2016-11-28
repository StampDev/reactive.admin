/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/underscore/underscore.d.ts" />
/// <reference path="utils.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/react/react.d.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
//var __settings: types.app_settings;
//var __routes: types.route_list;
//var __app: app.Application;
//const __instance_dir: string = '../ins';
//declare var page;
//declare var PubSub;
//declare var chance;
//breeze.core['config'].initializeAdapterInstance("uriBuilder", "json");
//var ajaxAdapter:any = breeze.config.getAdapterInstance('ajax');
//ajaxAdapter.defaultSettings = {
//    cache : false   
//};
////var dsa:any = breeze.config.getAdapterInstance('dataService');
////var jra:any = dsa.jsonResultsAdapter;
////jra.extractResults = function extract_results(data) {
////    if (data.results.hasOwnProperty('payload')) {
////        var payload = data.results['payload'];
////        return payload;
////    }
////    return data;
////}
//export module types {
//    export interface route {        
//        view: string
//    }
//    export interface route_page_info {
//        params: any,
//        path: any
//    }
//    export interface route_list {
//        [name: string]: route
//    }
//    export interface app_settings {
//        page_root: string
//        application_path?: string
//    }
//}
//export module constants {
//    export module router {
//        export const current_route: string = 'current_route'
//    }
//    export module events {
//        export const view_initialized: string = 'view_initialized'
//    }
//}
//export module system {
//    export function load_config() {
//        var d = Q.defer();
//        var __config_path: string = __instance_dir + '/config';
//        require([__config_path], obj => {
//            __settings = obj.config;
//            d.resolve(__settings);
//        });
//        return d.promise;
//    }
//    export function load_routes() {
//        var d = Q.defer();
//        var __routes_path: string = __instance_dir + '/routes';
//        require([__routes_path], obj => {
//            __routes = obj.routes;
//            d.resolve(__routes);
//        });
//        return d.promise;
//    }
//    export function load_application() {
//        var d = Q.defer();
//        if (!__settings.application_path) {
//            return Q.reject(false);
//        }
//        var __app_path: string = __instance_dir + __settings.application_path;
//        require([__app_path], obj => {
//            __app = new obj['InsApp']();
//            d.resolve(__app);
//        });
//        return d.promise;
//    }
//    export function start() {
//        Q.all([
//            load_config(),
//            load_routes()
//        ]).then(() => {
//            Backendless.initApp('5F76BFFF-B6EE-F6AB-FFE2-5051554CA500', '06A5D87B-83D9-0A58-FF6A-11ABA901C100', 'v1');
//            load_application().fail(() => {
//                __app = new app.Application();
//            }).finally(() => {
//                __app.start_routing();
//            });
//        });
//    }    
//}
//export module app {
//    export class router {
//        private app: Application;
//        constructor(app: Application) {
//            this.app = app;
//        }
//        private start_routing() {
//            var keys = Object.keys(__routes);
//            _.each(keys, (key: any) => {
//                var route = __routes[key];
//                page(key, ctx => {
//                    storage.set(constants.router.current_route, {
//                        params: ctx.params,
//                        path: ctx.path
//                    } as types.route_page_info);
//                    var _key = _.find(Object.keys(__routes), _i => {
//                        return _i === ctx.path;
//                    });
//                    var path = '';
//                    if (!_key) {
//                        path = __instance_dir + '/views/page404';
//                    } else {
//                        path = __instance_dir + __routes[_key].view;
//                    }
//                    require([path], obj => {
//                        var view = obj[Object.keys(obj)[0]];
//                        ReactDOM.unmountComponentAtNode($(__settings.page_root)[0]);
//                        ReactDOM.render(React.createElement(view), $(__settings.page_root)[0]);
//                    });
//                });
//            });
//            page.start();
//        }
//        navigate(urlpath: string) {
//            return page(urlpath);
//        }
//        start() {
//            this.start_routing();
//        }
//    }
//    export class Application {
//        private __router: router;
//        get router(): router {
//            if (!this.__router) {
//                this.__router = new router(this);
//            }
//            return this.__router;
//        }
//        start_routing() {
//            this.router.start();
//        }
//        login(email: string, password: string): Q.Promise<any> {
//            var d = Q.defer();
//            Backendless.UserService.login(email, password, true, new Backendless.Async((data) => {
//                d.resolve(true);
//            }, (err) => {
//                d.reject(err);
//            }));
//            return d.promise;
//        }
//        logout() {
//            Backendless.UserService.logout(new Backendless.Async((data) => {
//            }, (err) => {
//                alert(err);
//            }));
//        }
//    }
//}
//export module pubsub {
//    export function subscribe(topic: string, callback: (msg?: any, data?: any) => any): number {
//        return PubSub.subscribe(topic, callback);
//    }
//    export function publish(topic: string, data?: any) {
//        PubSub.publish(topic, data);
//    }
//}
//export module views {
//    var viewcount: number = 1;
//    export interface ReactProps extends React.Props<any> {
//        owner?: ReactView,        
//    }
//    export interface ReactState {
//        loading?: boolean,
//    }
//    export class ReactView extends React.Component<ReactProps, any>{
//        props: ReactProps;
//        state: ReactState;
//        constructor(props: ReactProps) {
//            super(props);
//            this.state = {};
//        }
//        get root(): JQuery {
//            return $(ReactDOM.findDOMNode(this));
//        }
//        public get app(): app.Application {
//            return __app;
//        }
//        componentDidMount() {
//        }
//    }
//    export class BaseMasterPage extends ReactView {
//    }
//    export class BaseLoginView extends ReactView {
//        get ctrl_email(): JQuery {
//            return this.root.find('.ctrl_email');
//        }
//        get ctrl_password(): JQuery {
//            return this.root.find('.ctrl_password');
//        }
//        componentDidMount() {
//            super.componentDidMount();
//            this.root.find('.form-login').validate({
//                rules: {
//                }
//            });
//        }
//    }
//    export interface ReactiveEvent {
//        action: string,
//        data?: any,
//        done?: (args: any) => any
//    }
//    export interface ReactiveViewProps extends ReactProps {
//        owner?: views.ReactiveView
//    }
//    export interface ReactiveViewState extends ReactState {
//    }
//    export class ReactiveView extends ReactView {
//        props: ReactiveViewProps;
//        state: ReactiveViewState;
//        private _viewid: any
//        get viewid(): any {
//            if (!this._viewid) {
//                this._viewid = 'view-' + viewcount++;
//            }
//            return this._viewid;
//        }
//        previous_event: ReactiveEvent;
//        current_event: ReactiveEvent;
//        constructor(props: ReactiveViewProps) {
//            super(props);
//            pubsub.subscribe(this.viewid, (msg: string, data: any) => {
//                this.on_broadcast_received(data);
//            });
//        }
//        componentDidMount() {
//            super.componentDidMount();
//            this.broadcast({
//                action: constants.events.view_initialized,
//            })
//        }
//        broadcast(event: ReactiveEvent) {
//            this.publish(this.viewid, event);
//        }
//        can_broadcast(new_event: ReactiveEvent): Q.Promise<Boolean> {
//            return Q.resolve(true);
//        }
//        private on_broadcast_received(new_event: ReactiveEvent) {
//            this.can_broadcast(new_event).then(() => {
//                this.previous_event = this.current_event;
//                this.current_event = new_event;
//                this.on_broadcast().then((args: any) => {
//                    if (this.current_event.done) {
//                        this.current_event.done(args);
//                    }
//                });
//            });
//        }
//        publish(target: string, event: ReactiveEvent) {
//            pubsub.publish(target, event);
//        }
//        on_broadcast(): Q.Promise<any> {
//            return Q.resolve(true);
//        }
//    }
//}
//export module storage {
//    var local: any = $['localStorage'];
//    export function set(name: string, obj: any) {
//        local.set(name, obj);
//    }
//    export function get(name: string) {
//        function isJson(str) {
//            try {
//                JSON.parse(str);
//            } catch (e) {
//                return false;
//            }
//            return true;
//        }
//        var obj: any = local.get(name);
//        if (obj) {
//            if (isJson(obj)) {
//                obj = JSON.parse(obj);
//            }
//        }
//        return obj;
//    }
//    export function remove(name: string) {
//        return local.remove(name);
//    }
//}
//export module backend {
//    var srv_url = 'https://umarket-node.herokuapp.com/api'
//    export module less {
//        export function fetch() {
//        }
//    }
//}
//export module data {
//    export interface DataQuery {
//        //from: string,
//        where?: any,
//        orderBy?: string[]
//        merge?: breeze.MergeStrategySymbol
//    }
//    export class DataSource {
//        model: string;
//        constructor(model: string) {
//            this.model = model
//        }
//        fetch_data(query: DataQuery): Q.Promise<any> {
//            var d = Q.defer();
//            var __qry: any = _.extend({
//                from: this.model
//            }, query);
//            var qry = breeze.EntityQuery.from('data').withParameters({
//                    $method: 'POST',
//                    $encoding: 'JSONP',
//                    $data: __qry
//            });
//            this.dm.executeQuery(qry).then(rst => {
//                if (rst.results && rst.results.length > 0)
//                {
//                    var str_data = (rst.results[0] as any).payload;
//                    this.dm.importEntities(str_data, {
//                        mergeStrategy: query.merge ? query.merge : breeze.MergeStrategy.OverwriteChanges
//                    });
//                }
//                d.resolve(true);
//            }).catch(err => {
//                toastr.error(JSON.stringify(err));
//                d.reject(false);
//            });
//            return d.promise;
//        }
//        fetch_metadata(): Q.Promise<any> {
//            var d = Q.defer();
//            this.dm.fetchMetadata().then(() => {
//                this.dm.dataService.hasServerMetadata = true;
//                d.resolve(true);
//            });
//            return d.promise;
//        }
//        private _dm: breeze.EntityManager;
//        get dm(): breeze.EntityManager {
//            if (!this._dm) {
//                this._dm = new breeze.EntityManager({
//                    dataService: new breeze.DataService({
//                        serviceName: '{0}'.format(utils.srv_url),
//                        //hasServerMetadata : false             
//                        //useJsonp : true
//                    }),
//                    validationOptions: new breeze.ValidationOptions({
//                        validateOnSave: false,
//                        validateOnAttach: false,
//                        validateOnQuery: true
//                    })
//                })
//            }
//            return this._dm;
//        }
//    }
//}
//export module controls {
//    export class Constants {
//        static VALUE_CHANGED: string = 'VALUE_CHANGED'
//    }
//    export interface BindableControlProps extends views.ReactiveViewProps {
//        attrs?: React.HTMLProps<any>,
//        property: string,        
//        entity: any,
//        readonly?: boolean
//    }
//    export interface BindableControlState extends views.ReactiveViewState {
//    }
//    export class BindableControl extends views.ReactiveView {
//        props: BindableControlProps;
//        state: BindableControlState;
//        constructor(props: BindableControlProps) {
//            super(props);            
//        }
//        //update_entity_value(val: any) {
//        //    if (this.props.entity && this.props.property) {
//        //        if ($.isFunction(this.props.entity[this.props.property])) {
//        //            this.props.entity[this.props.property](val);
//        //        } else {
//        //            this.props.entity[this.props.property] = val;
//        //        }
//        //    }
//        //}
//    }
//    export interface TextareaProps extends BindableControlProps {
//    }
//    export class Textarea extends BindableControl {
//        props: TextareaProps;
//        render() {
//            var html = <textarea {...this.props.attrs} className="form-control" />
//            return html;
//        }
//    }
//    export interface TogglableTextareaProps extends TextareaProps {
//    }
//    export interface TogglableTextareaState extends BindableControlState {
//        readonly: boolean;
//    }
//    export class TogglableTextarea extends Textarea {
//        props: TogglableTextareaProps;
//        state: TogglableTextareaState;
//        constructor(props: TogglableTextareaProps) {
//            super(props);
//            this.state.readonly = this.props.attrs && this.props.attrs.readOnly;
//        }
//        componentWillReceiveProps(nextProps: TogglableTextareaProps) {
//            this.state.readonly = nextProps.attrs && nextProps.attrs.readOnly;
//        }
//        render() {
//            var html = super.render();
//            if (this.state.readonly) {
//                html = <p {...this.props.attrs}>{null}</p>
//            }
//            return html;
//        }
//    }
//    export interface TextNumericProps extends views.ReactProps {
//        ctx?: any,
//        property?: any,
//        readonly?: boolean
//    }
//    interface TextNumericState extends views.ReactState {
//        value: any
//    }
//    export class TextNumeric extends views.ReactView {
//        props: TextNumericProps;
//        state: TextNumericState;
//        componentWillMount() {
//            if (this.props.ctx && this.props.property) {
//                this.state.value = _.result(this.props.ctx, this.props.property);
//            }
//        }
//        render() {
//            if (this.props.readonly) {
//                return <span className="ctrl-numeric" style={{ fontSize: 24 }}>{this.state.value}</span>
//            }
//            return <input type= "text"  className="form-control ctrl-numeric input-lg"
//                defaultValue={this.state.value} style={{ fontSize: 24 }}/>
//        }
//        componentDidMount() {
//            super.componentDidMount();
//            this.init_numeric();
//        }
//        componentDidUpdate() {
//            this.init_numeric();
//        }
//        init_numeric() {
//            (this.root as any).autoNumeric('init', { 'aSign': '€ ' });
//            if (!this.props.readonly) {
//                var that = this;
//                this.root.on('change', e => {
//                    var __value = ($(e.currentTarget) as any).autoNumeric('get');
//                    if (that.props.ctx && this.props.property) {
//                        if ($.isFunction(that.props.ctx[that.props.property])) {
//                            that.props.ctx[that.props.property](__value);
//                        } else {
//                            that.props.ctx[that.props.property] = __value
//                        }
//                    }
//                });
//            }
//        }
//    }
//    export interface TextInputProps extends BindableControlProps {
//        placeholder?: string
//    }
//    export interface TextInputState extends BindableControlState {
//        item: any
//    }
//    export class TextInput extends BindableControl {
//        props: TextInputProps;
//        state: TextInputState;
//        constructor(props: TextInputProps) {
//            super(props);
//            this.state.item = this.props.entity;
//        }
//        render() {
//            var default_value = null;
//            if (this.state.item && this.props.property) {
//                default_value = _.result(this.state.item, this.props.property);
//            }
//            var html = <input type="text" {...this.props.attrs} className="form-control" placeholder={this.props.placeholder}
//                onChange={this.onchange.bind(this)} defaultValue={default_value } />
//            return html;
//        }
//        onchange() {
//            if (this.state.item && this.props.property) {
//                var val = this.root.val();
//                if ($.isFunction(this.state.item[this.props.property])) {
//                    this.state.item[this.props.property](val);
//                } else {
//                    this.state.item[this.props.property] = val;
//                }
//            }
//        }
//    }
//    export interface SummerNotePropsState extends BindableControlState {
//        item: any
//    }
//    export interface SummerNoteProps extends BindableControlProps {
//    }
//    export class SummerNote extends BindableControl {
//        props: SummerNoteProps;
//        state: SummerNotePropsState;
//        constructor(props: SummerNoteProps) {
//            super(props);
//            this.state.item = this.props.entity;
//        }
//        render() {
//            var html =
//                <div className="summernote">
//                    {_.result(this.state.item, this.props.property) }
//                </div>;
//            return html;
//        }
//        on_broadcast(): Q.Promise<any> {
//            var that = this;
//            switch (this.current_event.action) {
//                case constants.events.view_initialized: {
//                    this.root['summernote']({
//                        toolbar: [
//                            ['fontsize', ['fontsize']],
//                            ['style', ['bold', 'italic', 'underline', 'clear']],
//                            ['color', ['color']]
//                        ],
//                        minHeight: 200,
//                        oninit: () => {
//                            that.root.parent().find('.note-editable').css('min-height', '150px');
//                            that.root.parent().find('.note-editable').css('border', 'lightgray 1px solid');
//                            that.root.parent().find('.note-editor').css({ 'min-height': 'inherit', 'margin-bottom': '30px' });
//                            that.root.parent().find('.control-label').css('text-align', 'left');
//                        },
//                        onKeyup: (e) => {
//                            if (e) {
//                            }
//                            //$("#product_desc_l").html($(this).code());
//                        }
//                    });
//                } break;
//            }
//            return Q.resolve(true);
//        } 
//    }
//}
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/core/jx__.js.map