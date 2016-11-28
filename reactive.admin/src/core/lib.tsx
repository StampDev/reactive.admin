/// <amd-dependency path="url-pattern" />
/// <reference path="../../typings/backendless.d.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;
var _urlp = require('url-pattern');


declare var page;
declare var Cookies;
declare var PubSub;
declare var Quill;
declare var deepcopy;

var __modal_count: number;
__modal_count = 0;

var __settings: core_types.app_settings;
var __routes: core_types.route_list;
var __app: app.Application;

const __instance_dir: string = '../ins';


breeze.core['config'].initializeAdapterInstance("uriBuilder", "json");

var ajaxAdapter: any = breeze.config.getAdapterInstance('ajax');

ajaxAdapter.defaultSettings = {
    cache: false
};


export module core_types {
    
    export interface route {
        view: string
    }


    export interface route_page_info {
        params: any,
        path: any
    }


    export interface route_list {
        [name: string]: route
    }


    export interface app_settings {
        page_root: string
        application_path?: string,
        BACKENDLESS_APPID?: string,
        BACKENDLESS_KEYID?: string,
        BACKENDLESS_VERID?: string
    }


    export enum Usertype { admin, contact, guest }


    export interface UrlType {
        path: string,
        params: any,
        previous: UrlType
    }


    export interface AppMenu {
        name: string,
        url: string,
        title?: string,
        header?: any,
        icon?: string,
        path: string,
        parent?: string,
        hidden?: boolean,                
        submenus?: AppMenu[],
        alters?: string[]    
    }
    
}


export module constants {


    export module local {

    }


    export module data {
        export enum USRSTATUS { Pendning, Active }
    }


    export module headers {

    }


    export module pubsub {

        export const broadcast: string = 'broadcast'


        export module articles_list {
            export const article_selected: string = 'article_selected'
        }


        export module products {
            export const current_product_updated: string = 'current_product_updated'
        }
    }


    export module app_menus {
        export const active_nav_menu: string = 'active-nav-menu';
    }


    export module events {
        export const view_initialized: string = 'view_initialized'
        export const view_updated: string = 'view_updated'
        export const view_data_loaded: string = 'view_item_loaded'
    }


    export module article_editview {

        export const REALOAD_ITEM_AFTER_SAVE: string = 'REALOAD_ITEM_AFTER_SAVE'

        export const SINGLE_PRODUCT_LOADED: string = 'SINGLE_PRODUCT_LOADED'

        export const NEW_AMAZON_ARCTICLE: string = 'NEW_AMAZON_ARCTICLE'
    }


    export module article_datalist {

        export const STORED_ACTIVE_PAGE: string = 'STORED_ACTIVE_PAGE'

        export const RESTORED_ACTIVE_PAGE: string = 'RESTORED_ACTIVE_PAGE'
    }


    export module app {

        export const PREVIOUS_WINDOW_SCROLL_POSITION: string = 'PREVIOUS_WINDOW_SCROLL_POSITION'
    }


    export module router {

        export const current_route: string = 'current_route'

    }
}


export module views {

    var viewcount: number = 1;


    export interface ReactViewProps extends React.Props<any> {
        owner?: ReactView,
        start_by_loading?: boolean      
    }


    export interface ReactViewState {
        loading?: boolean,
    }


    export class ReactView extends React.Component<ReactViewProps, ReactViewState>{

        state: ReactViewState;
        props: ReactViewProps;
        __context: any;


        constructor(props?: ReactViewProps) {

            super(props);

            this.props = props;

            this.state = {};

            if (this.props.start_by_loading) {
                this.state.loading = true;
            }
        }
        
        
        get app(): app.Application {
            return __app;
        }


        initalize_state(): ReactViewState {
            return {
            };
        }


        get root(): JQuery {
            return $(ReactDOM.findDOMNode(this));
        }


        jget(sel: string): JQuery {
            return this.root.find(sel);
        }

        componentWillReceiveProps(nextProps: any) {

        }

        
        componentWillMount() {

        }


        componentDidUpdate() {

        }


        componentWillUnmount() {

        }


        componentDidMount() {

        }


        componentWillUpdate() {

        }


        newState(new_state, done?: ()=> any) {

            this.setState(_.extend(this.state, new_state), () => {
                if (done) {
                    done();
                }
            });

        }


        updateState<T extends ReactViewState>(state:T, done?: ()=>any){
            this.newState(state, done);
        }
        

        error(err:any){

            toastr.error(JSON.stringify(err));

        }

    }
    

    export interface ReactiveEvent {
        action: string,
        data?: any,
        done?: (args?:any) => any
    }


    export interface ReactiveViewProps extends ReactViewProps {
        owner?: views.ReactiveView        
    }    
    export interface ReactiveViewState extends ReactViewState {
         ui?: any
    }    
    export class ReactiveView extends ReactView {

        props: ReactiveViewProps;
        state: ReactiveViewState;


        get_uiSchema() {
            return null;
        }

        private _viewid: any
        get viewid(): any {

            if (!this._viewid) {
                this._viewid = 'view-'+ viewcount++;
            }
            return this._viewid;
        }



        previous_event: ReactiveEvent;
        current_event: ReactiveEvent;

        private notify_handler: number;
        private broadcast_handler: number;
        private get_view_handler: number;
        

        constructor(props: ReactiveViewProps) {

            super(props);

            this.notify_handler = pubsub.subscribe(this.viewid, (msg: string, data: any) => {
                this.on_notification_received(data);
            });


            this.get_view_handler = pubsub.subscribe('get-' + this.viewid, (msg: string, data: any) => {
                return data(this);
            });
            

            this.broadcast_handler = pubsub.subscribe(constants.pubsub.broadcast, (msg, data:any) => {
                this.on_broadcast_received(data);
            });

        }


        componentDidMount() {
            
            super.componentDidMount();

            if (this.root && this.root.length > 0) {
                this.root.attr('data-reactive-view', this.viewid);
            }
            
            this.notify({
                action: constants.events.view_initialized,                
            })            
        }


        componentDidUpdate() {

            if (this.root && this.root.length > 0) {
                this.root.attr('data-reactive-view', this.viewid);
            }
            
            super.componentDidUpdate();
            
        }


        componentWillUnmount() {

            super.componentWillUnmount();

            PubSub.unsubscribe(this.broadcast_handler);
            PubSub.unsubscribe(this.notify_handler);
            PubSub.unsubscribe(this.get_view_handler);
        }


        componentWillReceiveProps(nextProps: ReactiveViewProps) {
            super.componentWillReceiveProps(nextProps);
        }
        

        notify(event: ReactiveEvent) {
            pubsub.publish(this.viewid, event);
        }


        get_view(viewid: string, callback) {
            return PubSub.publishSync('get-' + viewid, callback);
        }


        can_process_notification(new_event: ReactiveEvent): Q.Promise<Boolean> {
            return Q.resolve(true);
        }


        private on_notification_received(new_event: ReactiveEvent) {            

            return this.can_process_notification(new_event).then(() => {

                this.previous_event = this.current_event;

                this.current_event = new_event;

                return this.on_notify().then((args: any) => {

                    if (this.current_event.done) {

                        this.current_event.done(args);
                    }

                    return args;
                });

            }).done();
        }


        setState(state: any, done?: ()=> any) {
            super.setState(state, done)
        }


        on_notify(): Q.Promise<any> {
            return Q.resolve(true);
        }


        broadcast(event: ReactiveEvent) {
            pubsub.publish(constants.pubsub.broadcast, event);            
        }


        on_broadcast_received(broadcast: ReactiveEvent) {
            this.notify(broadcast);
        }
        
    }



    export interface ReactiveDataViewProps extends ReactiveViewProps {
        model?: string,       
        autoload?: boolean 
    }
    export interface ReactiveDataViewState extends ReactiveViewState {
    }
    export class ReactiveDataView extends ReactiveView {

        props: ReactiveDataViewProps;
        state: ReactiveDataViewState;


        constructor(props: ReactiveDataViewProps) {
            super(props);
            this.state.loading = true;
        }


        private _ds: data.DataSource;
        get ds(): data.DataSource {
            if (!this._ds) {
                this._ds = new data.DataSource(this.get_model());
            }
            return this._ds;
        }


        get_model(): string {
            return this.props.model;
        }
        

        load_data(qry?: data.DataQuery) {
            return this.ds.exec_query(qry)
        }


        on_notify() {

            switch (this.current_event.action) {

                case constants.events.view_initialized: {

                    if (this.state.loading) {
                        
                        this.load_data().then(() => {

                            this.setState({
                                loading: false
                            });

                        });
                    }

                } break;

            }

            return super.on_notify();

        }
    }
    


    export interface ReactiveEditDataViewState extends ReactiveDataViewState {
        autoinsert: boolean;
    }
    export interface ReactiveEditDataViewProps extends ReactiveDataViewProps {
        id?: string,
        autoinsert?: boolean,        
    }
    export class ReactiveEditDataView extends ReactiveDataView {

        props: ReactiveEditDataViewProps;
        state: ReactiveEditDataViewState;

        constructor(props: ReactiveEditDataViewProps) {

            super(props);

            if (this.props.autoinsert === undefined) {
                this.state.autoinsert = true;
            } else {
                this.state.autoinsert = this.props.autoinsert;
            }
        }


        get is_new(): boolean {

            if (this.item) {
                return this.item.entityAspect.entityState == breeze.EntityState.Added;
            }
            return false;
        }


        private _item: breeze.Entity;
        get item(): breeze.Entity {

            if (!this._item) {
                this._item = this.init_item();
            }

            return this._item;
        }


        init_item(): any {

            var type: breeze.IStructuralType = this.ds.dm.metadataStore.getEntityType(this.get_model());

            var pk = type.dataProperties.filter(prop => {
                return prop.isPartOfKey;
            })[0];

            if (this.props.id) {

                return _.find(this.ds.dm.getEntities(this.get_model()), d => {
                    return _.result(d, pk.name) === this.props.id
                });

            } else {

                if (this.props.autoinsert) {

                    var values = _.extend({
                        [pk.name]: utils.guid()
                    }, this.get_initial_values());

                    var ent = this.ds.dm.createEntity(this.get_model(), values);

                    this.ds.dm.addEntity(ent);

                    return ent;
                }

            }
            return null;
        }

        
        get_initial_values() {
            return {};
        }


        save_data() {
            return this.ds.saveChanges();
        }


        cancel_data() {

            if (this.ds.dm.hasChanges()) {
                this.ds.dm.rejectChanges();
            }
            
        }


        on_notify() {

            switch (this.current_event.action) {

                case constants.events.view_initialized: {
                    
                    if (this.state.loading) {

                        if (!this.is_new) {

                            var type: breeze.IStructuralType = this.ds.dm.metadataStore.getEntityType(this.get_model());

                            var pk = type.dataProperties.filter(prop => {
                                return prop.isPartOfKey;
                            })[0];


                            var qry: data.DataQuery = {
                                where: { [pk.name]: { eq: this.props.id } }
                            }

                            this.load_data(qry).then(() => {

                                this.setState({
                                    loading: false
                                }, () => {

                                    this.notify({
                                        action: constants.events.view_data_loaded
                                    })

                                });

                            });

                        } else {

                            this.notify({
                                action: constants.events.view_data_loaded
                            })

                        }

                        
                    }                    
                } break;
            }
            return super.on_notify();
        }
    }
    

    export class BaseMasterPage extends ReactView {


    }


    export class BaseLoginView extends ReactView {


        get ctrl_email(): JQuery {
            return this.root.find('.ctrl_email');
        }

        get ctrl_password(): JQuery {
            return this.root.find('.ctrl_password');
        }


        componentDidMount() {

            super.componentDidMount();

            this.root.find('.form-login').validate({
                rules: {

                }
            });
        }

    }


    export interface LoaderViewProps extends views.ReactiveViewProps {
        height?: number
    }
    export class LoaderView extends views.ReactiveView {

        props: LoaderViewProps;

        render() {

            var style = {};

            var _height = this.props.height;

            if (!_height) {
                _height = 350;
            }

            
            var html =
                <div style={{ minHeight: _height }} >
                </div>;

            return html;
        }

        on_notify() {

            switch (this.current_event.action) {

                case constants.events.view_initialized: {
                    utils.spin(this.root);
                } break;
            }

            return super.on_notify();

        }
    }


    export class TabControl extends views.ReactiveView {

        render() {

            var html =
                <div>
                    {this.props.children}
                </div>

            return html;
        }


        on_notify() {

            switch (this.current_event.action) {

                case constants.events.view_initialized: {

                    this.fix_tabs_urls();

                } break;

            } 

            return super.on_notify();

        }


        fix_tabs_urls() {

            _.each(this.root.find('li[role="presentation"]'), li => {

                var a = $(li).find('a');

                var url = a.attr('aria-controls');

                $(a).attr('href', '#{0}'.format(url));

                $(a).off('click');

                $(a).click((e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();

                    $(e.currentTarget).tab('show');

                    return false;
                });

            });
        }

    }


    export class IBox extends views.ReactiveView {

        render() {

            var html =
                <div className="ibox ibox-view">

                    <div className="ibox-content">

                        {this.props.children}

                    </div>

                </div>


            return html;

        }

    }
    
}


export module system {


    export function load_config() {

        var d = Q.defer();


        var __config_path: string = __instance_dir + '/config';


        require([__config_path], obj => {

            __settings = obj.config;

            d.resolve(__settings);

        });
        return d.promise;
    }


    export function load_routes() {

        var d = Q.defer();

        var __routes_path: string = __instance_dir + '/routes';

        require([__routes_path], obj => {

            __routes = obj.routes;

            d.resolve(__routes);

        });

        return d.promise;

    }


    export function load_application() {

        var d = Q.defer();

        if (!__settings.application_path) {
            return Q.reject(false);
        }

        var __app_path: string = __instance_dir + __settings.application_path;

        require([__app_path], obj => {

            __app = new obj['InsApp']();

            d.resolve(__app);

        });

        return d.promise;

    }


    export function start() {

        function init_backendless() {

            Backendless.initApp(__settings.BACKENDLESS_APPID,
                __settings.BACKENDLESS_KEYID, __settings.BACKENDLESS_VERID);
        }
        

        Q.all([
            load_config(),
            load_routes()
        ]).then(() => {

            init_backendless();
            
            // dummy call to initialize remote database
            var ds = new data.DataSource('occp');

            var qry = {
                take: 50
            }

            ds.fetch_data(qry)
                .then(() => {

                    var metadata = ds.dm.metadataStore.exportMetadata()

                    __app.metadata = metadata;

                })
                .fail(err => {
                    toastr.error('Database initialization failed: ' + JSON.stringify(err));
                });
            
            load_application().finally(() => {

                __app.start_routing();
            });

        });
    }


    export function check_user_logged() {

        if (!Backendless.UserService.isValidLogin()) {

            page('/login');

            return false;
        }

        return true;
    }
    
}


export module app {


    export class router {
        
        private app: Application;

        flatten_menus: core_types.AppMenu[];


        constructor(app: Application) {
            this.app = app;
            this.flatten_menus = [];
        }
        

        private start_routing() {

            var __menus: core_types.AppMenu[] = this.app.get_menus();

            this.flatten_menus = this.flatten(__menus);
            
            _.each(this.flatten_menus, menu => {
                
                page(menu.url, ctx => {
                    this.execute_menu(ctx.path, ctx);
                });
            });

            page.start();
        }
                

        private flatten(list: core_types.AppMenu[], parent_url?: string): any[] {

            var sub_arrays: string[] = ['submenus'];

            var destlist = [];

            for (var i in list) {

                var src = list[i];

                var dest_obj = {};

                var has_children: boolean = false;


                for (var k in src) {

                    if (!src['hasOwnProperty'](k)) {
                        continue;
                    }

                    var is_array = _.filter(sub_arrays, p => {
                        return p === k;
                    }).length > 0;

                    if (!is_array) {

                        dest_obj[k] = src[k];

                    } else {

                        has_children = true;

                        var __list = this.flatten(src[k], src.url);

                        _.each(__list, obj => {

                            obj['parent'] = src['name'];
                        });
                        
                        destlist = destlist.concat(__list);
                    }
                }


                if (parent_url) {
                    dest_obj['url'] = '{0}{1}'.format(parent_url, src.url);
                }


                if (has_children) {
                    dest_obj['url'] = '/#';
                }


                destlist.push(dest_obj);

            }


            return destlist;

        }


        find_menu_by_name(name: string) {

            var menu = _.find(this.flatten_menus, mn => {
                return mn.name === name;
            });

            return menu;
        }

        
        find_matching_menu(url: string, match?: string)
        {
            if (match) {

                var pattern = new _urlp(match);

                return (url === match) || pattern.match(url);

            } else {

                var menu = _.find(this.flatten_menus, mn => {

                    var pattern = new _urlp(mn.url);

                    var matching = (mn.url === url)
                        || pattern.match(url);

                    return matching;
                });

                return menu;
            }

            
        }


        matching_url(url: string, match?: string): boolean {

            var menu = this.find_matching_menu(url, match);

            return (menu != undefined) && (menu != null);
            
        }


        execute_menu(url: string, ctx?: any) {

            //##
            if (window.location.href && window.location.href['endsWith']('##')) {
                url = url.replace('##', '');
            } else {

                //if (window.location.href && window.location.href['endsWith']('#')) {
                //    return;
                //}
            }

            
            local.set(constants.router.current_route, {
                params: ctx ? ctx.params : {},
                path: url
            } as core_types.route_page_info);


            var menu = this.find_matching_menu(url);


            if (!menu) {
                // --> 404 page
            }


            if (url != '/login' && url != '/register') {

                if (!system.check_user_logged()) {
                    return;
                }
            }
            

            var path = __instance_dir + menu.path;


            require([path], obj => {

                var view = obj[Object.keys(obj)[0]];

                ReactDOM.unmountComponentAtNode($(__settings.page_root)[0]);

                ReactDOM.render(React.createElement(view), $(__settings.page_root)[0]);

            });

        }


        navigate(urlpath: string) {

            return page(urlpath);
        }


        start() {

            this.start_routing();

        }
    }


    export class Application {

        private __router: router;


        get router(): router {

            if (!this.__router) {
                this.__router = new router(this);
            }

            return this.__router;
        }


        metadata: any;


        start_routing() {

            this.router.start();

        }


        get currentUser(): any {
            return Backendless.UserService.getCurrentUser();
        }


        get CompId(): string {
            return _.result(this.currentUser, 'compid');
        }
        

        login(email: string, password: string): Q.Promise<any> {

            var d = Q.defer();
            
            Backendless.UserService.login(email, password, true, new Backendless.Async((data) => {

                d.resolve(true);

            }, (err) => {

                d.reject(err);

            }));


            return d.promise;

        }


        logout() {

            Backendless.UserService.logout(new Backendless.Async((data) => {


            }, (err) => {

                alert(err);

            }));


        }


        get_menus(): core_types.AppMenu[] {

            return [];
        }
        

        add_corporate_account(args: {
            compname: string,            
            usrname: string,
            usrsurname: string,
            usremail: string,
            usrpassword: string
        }) {
            
            var user = _.extend(new Backendless.User(), {
                name: args.usrname,
                surname: args.usrsurname,
                email: args.usremail,
                password: args.usrpassword
            });

            Backendless.UserService.register(user, new Backendless.Async(rst => {


            }, err => {


            }));            
        }
    }

}


export module modal {


    export interface ModalState extends views.ReactViewState {
        show: boolean,
        content: any
    }
    export interface ModalProps extends views.ReactViewProps {
        title?: any,
        icon?: any,
        showModal?: boolean,
        inmodal?: boolean,
        bsSize?: string,
        action?: string,
        hide_footer?: boolean,
        classlist?: string,
        content?: (modal: modal.Modal) => any,
        onFinish?: () => Q.Promise<Boolean>
    }

    export class Modal extends views.ReactView {

        props: ModalProps;
        state: ModalState;

        private __modal_count: number;
        get modal_count(): number {
            if (!this.__modal_count) {
                this.__modal_count = ++__modal_count;
            }
            return this.__modal_count;
        }

        constructor(props: ModalProps) {

            super(props);

            this.state.show = false;

            if (this.props.showModal != undefined) {
                this.state.show = this.props.showModal;
            }

            if (this.props.content) {
                this.state.content = this.props.content(this);
            }
            
        }


        show(content?: any, title?: any) {

            var that = this;

            this.setState({ show: true, content: content } as any, () => {

                if (title) {
                    $('.modal-title').html(title);
                }

            });
        }


        close() {

            this.setState({ show: false } as any);
        }


        render() {

            var that = this;

            var props: any = {
                show: this.state.show,
                onHide: () => {
                    that.close()
                }
            }

            
            if (this.props.bsSize) {
                props.bsSize = this.props.bsSize;
            }

            var should_hide_footer = this.props.hide_footer ? 'hidden' : null;

            var action = this.props.action ? this.props.action : 'Save';
            var row_body = !this.props.inmodal ? 'row' : '';
            var inmodal = this.props.inmodal ? 'inmodal' : '';

            var html =
                <b.Modal {...props} data-dismiss="modal" className={"modal-count-{0} {1} {2}".format(this.modal_count, this.props.classlist, inmodal) }>

                    <b.Modal.Header closeButton>
                        {this.props.icon}
                        <b.Modal.Title class="header-title">
                            {this.props.title}
                        </b.Modal.Title>
                    </b.Modal.Header >

                    <b.Modal.Body className={row_body}>
                        {this.state.content}
                    </b.Modal.Body>

                    <b.Modal.Footer className={should_hide_footer}>
                        <b.Button style={{ padding: 10 }} onClick={() => { that.save() } } className='btn-save' bsStyle="primary">{action}</b.Button>
                    </b.Modal.Footer>

                </b.Modal>

            return html;

        }
                

        save() {

            if (this.props.onFinish) {
                this.props.onFinish().then(() => {
                    this.close();
                });
            }

        }        
    }


    export function Show(props: ModalProps) {

        var $container = $('body > .modal-container');

        if ($container.length === 0) {

            $container = $('<div class="modal-container"></div>').appendTo($('body'));

        } else {

            ReactDOM.unmountComponentAtNode($container[0]);
        }

        props.showModal = true;

        ReactDOM.render(<Modal {...props} />, $container[0]);
        
    }

}


export module controls {

    export class Constants {
        static VALUE_CHANGED: string = 'VALUE_CHANGED'
    }


    export interface BindableControlProps extends views.ReactiveViewProps {
        attrs?: React.HTMLProps<any>,
        property?: string,        
        entity?: any,
        readonly?: boolean,
        onChange?: ()=> any
    }

    interface BindableControlState extends views.ReactiveViewState {
        item: any;
    }

    export class BindableControl extends views.ReactiveView {
        props: BindableControlProps;
        state: BindableControlState;
        

        constructor(props: BindableControlProps) {
            super(props);
            this.state.item = this.props.entity;            
        }


        get_val(): any {
            return null;
        }


        onchange() {


            if (this.props.onChange) {
                this.props.onChange();
            } else {


                if (this.state.item && this.props.entity) {

                    var val = this.get_val();

                    if ($.isFunction(this.state.item[this.props.property])) {

                        this.state.item[this.props.property](val);

                    } else {

                        this.state.item[this.props.property] = val;
                    }
                }
            }
            
        }


        componentWillReceiveProps(nextProps: BindableControlProps) {

            if (nextProps && nextProps.entity) {
                this.state.item = nextProps.entity;
            }

        }

    }


    export interface TextareaProps extends BindableControlProps {
    }
    export class Textarea extends BindableControl {

        props: TextareaProps;

        render() {

            var attrs = _.extend({
                rows: 4
            }, this.props.attrs);

            var html =
                <textarea {...attrs} className="form-control" onChange={this.onchange.bind(this) } >
                    {_.result(this.state.item, this.props.property) }
                </ textarea>

            return html;
        }

        get_val(): any {
            return this.root.val();
        }
    }

    export interface TogglableTextareaProps extends TextareaProps {
    }
    interface TogglableTextareaState extends BindableControlState {
        readonly: boolean;
    }
    export class TogglableTextarea extends Textarea {

        props: TogglableTextareaProps;
        state: TogglableTextareaState;

        constructor(props: TogglableTextareaProps) {
            super(props);
            this.state.readonly = this.props.attrs && this.props.attrs.readOnly;
        }


        componentWillReceiveProps(nextProps: TogglableTextareaProps) {

            this.state.readonly = nextProps.attrs && nextProps.attrs.readOnly;
        }


        render() {

            var html = super.render();

            if (this.state.readonly) {
                html = <p {...this.props.attrs}>{null}</p>
            }

            return html;
        }

    }


    export interface TextNumericProps extends views.ReactViewProps {
        ctx?: any,
        property?: any,
        readonly?: boolean
    }
    interface TextNumericState extends views.ReactViewState {
        value: any
    }
    export class TextNumeric extends views.ReactView {

        props: TextNumericProps;
        state: TextNumericState;


        componentWillMount() {

            super.componentWillMount();

            if (this.props.ctx && this.props.property) {
                this.state.value = _.result(this.props.ctx, this.props.property);
            }
        }


        render() {

            if (this.props.readonly) {
                return <span className="ctrl-numeric" style={{ fontSize: 20 }}>{this.state.value}</span>
            }


            return <input type= "text"  className="form-control ctrl-numeric input-lg text-danger"
                defaultValue={this.state.value} style={{ fontSize: 20 }}/>

        }


        componentDidMount() {

            super.componentDidMount();

            this.init_numeric();
        }


        componentDidUpdate() {

            super.componentDidUpdate();

            this.init_numeric();
        }


        init_numeric() {

            (this.root as any).autoNumeric('init', { 'aSign': '€ ' });

            if (!this.props.readonly) {

                var that = this;

                this.root.on('change', e => {

                    var __value = ($(e.currentTarget) as any).autoNumeric('get');

                    if (that.props.ctx && this.props.property) {

                        if ($.isFunction(that.props.ctx[that.props.property])) {
                            that.props.ctx[that.props.property](__value);
                        } else {
                            that.props.ctx[that.props.property] = __value
                        }
                    }
                });
            }

        }

    }



    interface TextInputProps extends BindableControlProps {
        placeholder?: string
    }
    export interface TextInputState extends BindableControlState {
        item: any
    }
    export class TextInput extends BindableControl {

        props: TextInputProps;
        state: TextInputState;

        constructor(props: TextInputProps) {
            super(props);
            this.state.item = this.props.entity;
        }


        render() {

            var default_value = null;

            if (this.state.item && this.props.property) {
                default_value = _.result(this.state.item, this.props.property);
            }

            var html = <input type="text" {...this.props.attrs} className="form-control input-lg" name={this.props.property}
                placeholder={this.props.placeholder}
                onChange={this.onchange.bind(this)} defaultValue={default_value } />

            return html;
        }


        get_val(): any {
            return this.root.val();
        }
        

    }


    interface QuillEditorState extends BindableControlState {        
    }
    export interface QuillEditorProps extends BindableControlProps {
        placeholder?: string
        minheight?: number
    }
    export class QuillEditor extends BindableControl {

        props: QuillEditorProps;
        state: QuillEditorState;
        quill: JQuery;


        constructor(props: QuillEditorProps) {
            super(props);
            this.state.item = this.props.entity;
        }


        render() {

            var html =
                <div className="root-quill">                    
                </div>
                
            return html;
        }


        get_val(): any {
            return this.quill['getText']();
        }


        on_notify(): Q.Promise<any> {

            var that = this;

            switch (this.current_event.action) {

                case constants.events.view_initialized: {

                    this.init_quill();

                } break;

            }

            return super.on_notify();
        } 

        
        componentDidUpdate() {

            super.componentDidUpdate();

            this.init_quill();
        }


        init_quill() {

            this.root.empty();

            var content = _.result(this.state.item, this.props.property);

            if (!content) {
                content = '';
            }

            var $quill = $('<div class="quill-editor" style="min-height:80px; font-size:18px; font-weight:400; background:white">{0}</div>'.format(content)).appendTo(this.root);

            if (this.props.minheight) {
                $quill.css('min-height', '{0}px'.format(this.props.minheight));
            }

            if (this.quill) {
                delete this.quill; //???
            }

            this.quill = new Quill($quill[0], {
                theme: 'snow'                
            });

            this.quill.off('text-change');

            this.quill.on('text-change', (delta, source) => {

                this.onchange();

            });
        }
    }



    interface CheckBoxPropsState extends BindableControlState {
    }
    export interface CheckBoxProps extends BindableControlProps {
        title?: string,
        unposition?: boolean,
        on_check?: (e: Event) => any,
        on_uncheck?: (e: Event) => any     
    }
    export class CheckBox extends BindableControl {
        props: CheckBoxProps;
        state: CheckBoxPropsState;

        constructor(props: CheckBoxProps) {
            super(props);
        }


        render() {

            var html =
                <label>
                    {this.props.title}
                    <input type="checkbox"></input>             
                </label>
            
            return html;
        }


        on_notify(): Q.Promise<any> {

            switch (this.current_event.action) {

                case constants.events.view_initialized: {
                    this.initialize_checkbox();
                } break;

            }            
            return super.on_notify();
        }


        initialize_checkbox() {
            
            this.root.find('input')['iCheck']({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
                unposition: this.props.unposition
            });
            
            this.root.find('input').on('ifChecked', (event) => {

                this.set_value(true);

                if (this.props.on_check) {
                    this.props.on_check(event)
                }
            });

            this.root.find('input').on('ifUnchecked', (event) => {

                this.set_value(false);

                if (this.props.on_uncheck) {
                    this.props.on_uncheck(event)
                }
            });
            
            var default_value = null;

            if (this.state.item && this.props.property) {
                default_value = _.result(this.state.item, this.props.property);
            }

            if (default_value === true || default_value === 1) {

                this.root.find('input')['iCheck']('check');
            }
        }
        

        set_value(checked: boolean) {

            if (this.state.item && this.props.property) {

                if ($.isFunction(this.state.item[this.props.property])) {
                    this.state.item[this.props.property](checked);
                } else {
                    this.state.item[this.props.property] = checked;
                }
            }
        }


        get_val() {

            return this.root.find('input').prop("checked", true);
        }
    }


    interface IconCheckBoxState extends BindableControlState {
        is_checked: boolean,
        is_enabled: boolean,
    }
    export interface IconCheckBoxProps extends BindableControlProps {
        title?: string,
        is_checked?: boolean,
        is_enabled?: boolean,
        onChecked?: (ctrl: IconCheckBoxProps) => any  
    }
    export class IconCheckBox extends BindableControl {
        props: IconCheckBoxProps;
        state: IconCheckBoxState;
        

        constructor(props: IconCheckBoxProps) {
            super(props);
            this['id'] = utils.guid();
            this.state.is_checked = this.props.is_checked;
            this.state.is_enabled = this.props.is_enabled === undefined ? true : this.props.is_enabled;
        }

        componentWillReceiveProps(next: any) {

            this.state.is_checked = next.is_checked;
            this.state.is_enabled = next.is_enabled;

        }


        render() {
            
            var view = null;

            var _style = {
                verticalAlign: 'middle',
                opacity: this.state.is_enabled ? 0.7 : 0.1
            }

            if (this.state.is_checked) {
                view = <i className="fa fa-check-square-o fa-2x" style={_style} ></i>
            } else {
                view = <i className="fa fa-square-o fa-2x" style={_style}></i>
            }
            
            var html =
                <div onClick={this.do_check.bind(this) } style={{ display:'inline-block' }}>
                    {view}
                    <span>{this.props.title}</span>                    
                </div>
            
            return html;
        }


        private do_check() {

            if (!this.state.is_enabled) {
                return;
            }

            this.newState({
                is_checked: !this.state.is_checked
            }, () => {

                if (this.state.is_checked) {
                    this.root.addClass('checkbox-selected')
                } else {
                    this.root.removeClass('checkbox-selected')
                }

                if (this.props.onChecked) {
                    this.props.onChecked(this);
                }
            });
        }

        
        get is_checked(): boolean {
            return this.state.is_checked;
        }
        
    }


    export interface BoxProps extends views.ReactViewProps {
        title?: string,
        toolbox?: boolean,
        onfooter?: (panel: Box, $footer) => {

        },
        style?: any,
        className?: any
    }
    export class Box extends views.ReactView {

        props: BoxProps;

        constructor(props: BoxProps) {
            super(props);
        }

        render() {

            var props = _.extend({}, this.props);

            var toolbox = !this.props.toolbox ? 'hidden' : null;

            var html =
                <div className="ibox" {...props}>

                    <div className="ibox-title hidden">

                        <h5 className="title" >{this.props.title}</h5>

                        <div className={"ibox-tools {0}".format(toolbox) }>

                            <a className="collapse-link">
                                <i className="fa fa-chevron-up" />
                            </a>

                            <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                                <i className="fa fa-wrench" />
                            </a>

                            <ul className="dropdown-menu dropdown-user">
                                <li><a href="#">Config option 1</a></li>
                                <li><a href="#">Config option 2</a></li>
                            </ul>

                            <a className="close-link">
                                <i className="fa fa-times" />
                            </a>

                        </div>

                    </div>

                    <div className="ibox-content col-lg-12">
                        {this.props.children}
                    </div>

                    <div className={"ibox-footer hidden"}>
                    </div>

                </div>

            return html;

        }


        componentDidMount() {

            this.init_toolbox();
        }


        init_toolbox() {

            // Collapse ibox function
            this.jget('.collapse-link').click(function () {
                var ibox = $(this).closest('div.ibox');
                var button = $(this).find('i');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                setTimeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            });

            // Close ibox function
            this.jget('.close-link').click(function () {
                var content = $(this).closest('div.ibox');
                content.remove();
            });

            if (this.props.onfooter) {

                this.jget('.ibox-footer').removeClass('hidden')

                this.props.onfooter(this, this.jget('.ibox-footer'));
            }

        }

    }



    export interface TextIconProps extends views.ReactiveViewProps {
        label: string,
        icon: string,
        property?: string,
        placeholder?: string
    }
    export interface TextIconState extends views.ReactiveViewState {
    }
    export class TextIcon extends views.ReactiveView {

        props: TextIconProps;
        state: TextIconState;


        render() {

            var binding = this.props.property ? 'textInput:{0}'.format(this.props.property) : '';

            var html =
                <div>
                    <h2>
                        <span>{this.props.label}</span>
                    </h2>
                    <b.FormGroup >
                        <b.InputGroup>
                            <b.InputGroup.Addon>
                                <i className={"fa {0}".format(this.props.icon) }></i>
                            </b.InputGroup.Addon>
                            <b.FormControl type="text" name={this.props.property} required placeholder={this.props.placeholder} data-bind={binding}  />
                        </b.InputGroup>
                        <span className="error-tag" ></span>
                    </b.FormGroup>
                </div>

            return html;

        }
    }
    
}


export module forms {

    export module actions {

        export const EDIT_ROW: string = 'EDIT_ROW'
        export const DELETE_ROW: string = 'DELETE_ROW'
        export const INIT_SCROLLBAR: string = 'INIT_SCROLLBAR'
        export const DATA_LOADED: string = 'DATA_LOADED'
    }


    export module defs {

        interface Datasource {
            model: string
        }


        export enum RowType { simple, tabs }

        export enum Controltypes { text, bool, numeric, currency, enum, lookup, label }


        export interface ControlDefinition {
            title?: string,
            class?: string,
            type?: Controltypes,
            property?: string,
            readonly?: boolean,
            defaultvalue?: any,
            style?: React.CSSProperties
        }


        export interface ContentViewDefinition {
            col_size?: string,
            classlist?: string,
            style?: React.CSSProperties,
            separator?: boolean,
            //controls?: ui.RowControlsViewProps,
            //tabs?: ui.TabsControlViewProps
        }


    }


    export module ui {

        export interface ColSizes {
            lg?: number,
            md?: number,
            sm?: number,
            xs: number
        }
        
        enum SearchState { idle, started, running }

        export interface DataListState extends views.ReactiveViewState {
            data: any[],
            scroll_height?: number
        }
        export interface DataListProps extends views.ReactiveViewProps {
            name?: string,
            model?: string,
            allow_edit_row?: boolean,
            allow_delete_row?: boolean,
            row_count?: boolean,
            scroll_height?: number,
            apply_scrollheight?: boolean,
            load_data?: () => Q.Promise<any[]>
            settings?: DataTables.Settings
        }
        export class DataList extends views.ReactiveView {

            props: DataListProps;
            state: DataListState;
            datatable: DataTables.DataTable;


            constructor(props: DataListProps) {
                super(props);
                this.state.loading = true;
                this.searchState = SearchState.idle;
                this.state.scroll_height = this.props.scroll_height;

                if (!this.state.scroll_height) {
                    this.state.scroll_height = 670;
                }
            }


            private __ds: data.DataSource;
            get ds(): data.DataSource {

                if (!this.__ds) {
                    this.__ds = new data.DataSource(this.model);
                }

                return this.__ds;
            }


            api: any;
            private searchState: SearchState;
            private searchTimeOut: number;


            get tbl_settings(): DataTables.Settings {
                return this.props.settings;
            }


            render() {

                if (this.state.loading) {
                    return <views.LoaderView />
                }

                var html =
                    <div className="datalist">
                        <table className="table table-striped table-hover datalist-table" style={{ width: '100%' }}>
                        </table>
                    </div>

                return html;
            }


            get_model(): string {
                return this.props.model;
            }


            get model(): string {
                return this.get_model();
            }


            on_notify() {

                switch (this.current_event.action) {

                    case constants.events.view_initialized: {
                        
                        this.local_load_data();

                    } break;
                }

                return super.on_notify();
            }
            

            local_load_data() {

                var d = Q.defer();

                this.newState({
                    loading: true
                }, () => {

                    this.load_data()
                        .then(data => {

                            if (this.props.owner) {

                                this.props.owner.notify({
                                    action: actions.INIT_SCROLLBAR
                                });
                            }

                            this.newState({
                                loading: false,
                                data: data
                            }, () => {

                                this.init_datatable();

                                d.resolve(true);
                            });
                        }).fail(err => {

                            d.reject(err);
                        });
                });

                return d.promise;
            }


            init_datatable() {


                if (this.datatable) {
                    this.datatable.destroy();
                }


                this.init_database_events();


                var __options = this.init_datatable_settings();


                this.datatable = this.root.find('table')['dataTable'](__options);
                

                if (local.get(constants.article_datalist.STORED_ACTIVE_PAGE)) {

                    this.datatable.page(local.get(constants.article_datalist.STORED_ACTIVE_PAGE))['draw']('page' as any);
                    local.remove(constants.article_datalist.STORED_ACTIVE_PAGE);
                }


                if (local.get(constants.app.PREVIOUS_WINDOW_SCROLL_POSITION)) {

                    $(window).scrollTop(local.get(constants.app.PREVIOUS_WINDOW_SCROLL_POSITION));
                    local.remove(constants.app.PREVIOUS_WINDOW_SCROLL_POSITION);
                }
            }


            init_datatable_settings() {

                var _row_fn = this.tbl_settings.createdRow;

                var setts: DataTables.Settings = _.extend({

                    ordering: false,

                    createdRow: (row: Node, data: any[] | Object, dataIndex: number) => {

                        this.createdRow(row, data, dataIndex);

                        if (_row_fn) {
                            _row_fn.call(this, row, data, dataIndex);
                        }
                    }

                }, this.tbl_settings);

                setts.destroy = true;

                setts.data = this.state.data;

                setts.columns = this.init_columns(setts.columns);

                return setts;
            }


            init_database_events() {

                this.root.off('preInit.dt');
                this.root.on('preInit.dt', (e, settings) => {
                    this.api = new $.fn.dataTable.Api(settings);
                });

                this.root.find('table').off('draw.dt');
                this.root.find('table').on('draw.dt', () => {

                    var apply_scrollheight = this.props.apply_scrollheight;

                    if (apply_scrollheight === undefined) {
                        apply_scrollheight = true;
                    }

                    if (apply_scrollheight) {

                        this.root['slimScroll']({
                            'height': '{0}px'.format(this.state.scroll_height)
                        });

                    }
                    
                    this.root.find('ins').css('position', 'relative!important');


                    var search = this.api.settings().search();


                    if (search) {
                        this.root.find('.datalist-table')['highlight'](search);
                    } else {
                        this.root.find('.datalist-table')['unhighlight']();
                    }

                });

                
                this.root.find('table').off('init.dt');
                this.root.find('table').on('init.dt', () => {

                    this.init_search();
                    
                });

            }


            init_columns(_columns: DataTables.ColumnSettings[]): DataTables.ColumnSettings[] {

                var columns: DataTables.ColumnSettings[] = deepcopy(_columns) as any;

                _.each(columns, col => {

                    var _fn = col.createdCell;

                    col.createdCell = (cell: Node, cellData: any, rowData: any, row: number, col: number) => { //this.createdCell;

                        this.createdCell(cell, cellData, rowData, row, col);

                        if (_fn) {
                            _fn.call(this, cell, cellData, rowData, row, col);
                        }
                    }
                });


                if (this.props.row_count) {
                    this.add_row_counter(columns);
                }

                this.add_row_actions(columns);

                return columns;
            }


            init_search() {

                var that = this;

                this.root.find('.dataTables_filter input')
                    .unbind('input keydown keypress keyup')
                    .bind("input", function (e) {
                        
                        var fn = this;

                        if (that.searchState === SearchState.idle) {

                            that.searchState = SearchState.started;

                        } else {

                            if (that.searchState === SearchState.running) {

                                clearTimeout(that.searchTimeOut);

                                that.searchState = SearchState.started;
                            }
                        }

                        if (that.searchState === SearchState.started) {

                            that.searchState = SearchState.running;

                            var timeout = that.tbl_settings.serverSide ? 2000 : 500;

                            that.searchTimeOut = setTimeout(() => {

                                that.searchState = SearchState.idle;

                                var term = fn.value;

                                that.api.search(term).draw();

                            }, timeout);
                        }

                    })
                    .bind("keyup", function (e) {

                        if (e.keyCode == 13) {

                            if (that.searchState === SearchState.running) {

                                clearTimeout(that.searchTimeOut);
                            }

                            that.api.search(this.value).draw();

                        }
                    });

            }


            add_row_counter(columns: DataTables.ColumnSettings[]) {

                var counter: number = 1;

                var that = this;

                columns.unshift({
                    title: '',
                    data: null,
                    width: '5%',
                    createdCell: function (cell: Node, cellData: any, rowData: any, row: number, col: number) {

                        var api = this['api']();
                        var info:any = api.page.info();

                        var rowindex = (info.length * info.page) + row + 1;

                        $(cell).empty();

                        $(cell).append($('<div class="row-counter" data-rowcount={0}>{0}.</div>'.format(rowindex)));

                        $(cell).css('width', '5%');
                    }
                    
                });
            }


            add_row_actions(columns: DataTables.ColumnSettings[]) {

                var add_actions = this.props.allow_delete_row || this.props.allow_edit_row;

                if (add_actions) {

                    var td_actions = [];

                    if (this.props.allow_edit_row) {

                        td_actions.push(
                            <td>
                                {this.add_edit_row_btn(this.props.allow_delete_row) }
                            </td>
                        );
                    }

                    if (this.props.allow_delete_row) {

                        td_actions.push(
                            <td>
                                {this.add_delete_row_btn() }
                            </td>
                        );
                    }

                    var tbl_actions =
                        <table className="pull-right">
                            <tbody>
                                <tr>
                                    {td_actions}
                                </tr>
                            </tbody>
                        </table>;

                    columns.push({
                        title: '',
                        data: null,
                        createdCell: (cell: Node, cellData: any, rowData: any) => {

                            $(cell).empty();

                            ReactDOM.render(tbl_actions, $(cell)[0]);

                            $(cell).closest('tr').hover(() => {

                                $(cell).closest('tr').find('.btn-row-actions').css('opacity', '1')

                            }, () => {

                                $(cell).closest('tr').find('.btn-row-actions').css('opacity', '0.2')

                            });
                        }
                    })
                }
            }


            get_row_actions_style(margin?: boolean) {

                var _style: any = {
                    opacity: 0.3
                }

                if (margin) {
                    _style.marginRight = 10
                }

                return _style;
            }

                        
            add_edit_row_btn(margin?: boolean) {

                var _styles = {};

                if (margin) {
                    _styles = {
                        marginRight: 10
                    }
                }

                var btn =
                    <button className="btn btn-sm btn-info btn-outline btn-row-actions btn-row-edit"
                        onClick={this.do_edit_row.bind(this) }
                        style={this.get_row_actions_style(margin) }>
                        <i className="fa fa-edit"></i>
                    </button>;

                return btn;
            }


            do_edit_row(e: Event) {

                e.preventDefault();

                if (this.props.owner) {

                    var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');

                    this.props.owner.notify({
                        action: actions.EDIT_ROW,
                        data: id
                    });
                }
            }


            do_delete_row(e: Event) {

                e.preventDefault();

                if (this.props.owner) {

                    var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');

                    this.props.owner.notify({
                        action: actions.DELETE_ROW,
                        data: id
                    });
                }

            }


            add_delete_row_btn() {

                var btn =
                    <button className="btn btn-sm btn-warning btn-outline btn-row-actions btn-row-delete"
                        onClick={this.do_delete_row.bind(this) }
                        style={this.get_row_actions_style() }>
                        <i className="fa fa-trash"></i>
                    </button>;

                return btn;
            }


            load_data(): Q.Promise<any> {
                return this.props.load_data.call(this)
            }


            format_query_results(data: any[]) {

                var index: number = 0;

                var __data = _.map(data, obj => {

                    return _.extend(obj, {
                        DT_RowID: ++index
                    })
                });

                return __data;
            }
            

            createdCell(cell: Node, cellData: any, rowData: any, row: number, col: number) {

            }


            createdRow(row: Node, data: any[] | Object, rowindex: number) {

                $(row).attr('data-rowid', _.result(data, 'ID'));
                
            }


            init_srv_pipeline() {

                $.fn.dataTable.pipeline = (opts: any) => {

                    // Configuration options
                    var conf = $.extend({
                        pages: 5,     // number of pages to cache
                        url: '',      // script url
                        data: null,   // function or object with parameters to send to the server
                        // matching how `ajax.data` works in DataTables
                        method: 'GET' // Ajax HTTP method
                    }, opts);

                    // Private variables for storing the cache
                    var cacheLower = -1;
                    var cacheUpper = null;
                    var cacheLastRequest = null;
                    var cacheLastJson = null;

                    var fn = (request, drawCallback, settings) => {

                        var ajax = false;
                        var requestStart = request.start;
                        var drawStart = request.start;
                        var requestLength = request.length;
                        var requestEnd = requestStart + requestLength;

                        if (settings.clearCache) {
                            // API requested that the cache be cleared
                            ajax = true;
                            settings.clearCache = false;
                        }
                        else if (cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
                            // outside cached data - need to make a request
                            ajax = true;
                        }
                        else if (JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
                            JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
                            JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
                        ) {
                            // properties changed (ordering, columns, searching)
                            ajax = true;
                        }

                        // Store the request for checking next time around
                        cacheLastRequest = $.extend(true, {}, request);

                        if (ajax) {
                            // Need data from the server
                            if (requestStart < cacheLower) {
                                requestStart = requestStart - (requestLength * (conf.pages - 1));

                                if (requestStart < 0) {
                                    requestStart = 0;
                                }
                            }

                            cacheLower = requestStart;
                            cacheUpper = requestStart + (requestLength * conf.pages);

                            request.start = requestStart;
                            request.length = requestLength * conf.pages;

                            // Provide the same `data` options as DataTables.
                            if ($.isFunction(conf.data)) {
                                // As a function it is executed with the data object as an arg
                                // for manipulation. If an object is returned, it is used as the
                                // data object to submit
                                var d = conf.data(request);
                                if (d) {
                                    $.extend(request, d);
                                }
                            }
                            else if ($.isPlainObject(conf.data)) {
                                // As an object, the data given extends the default
                                $.extend(request, conf.data);
                            }

                            settings.jqXHR = $.ajax({
                                "type": conf.method,
                                "url": conf.url,
                                "data": request,
                                "dataType": "json",
                                "cache": false,
                                "success": function (json) {
                                    cacheLastJson = $.extend(true, {}, json);

                                    if (cacheLower != drawStart) {
                                        json.data.splice(0, drawStart - cacheLower);
                                    }
                                    if (requestLength >= -1) {
                                        json.data.splice(requestLength, json.data.length);
                                    }

                                    drawCallback(json);
                                }
                            });
                        }
                        else {

                            var json = $.extend(true, {}, cacheLastJson);
                            json.draw = request.draw; // Update the echo for each response
                            json.data.splice(0, requestStart - cacheLower);
                            json.data.splice(requestLength, json.data.length);

                            drawCallback(json);
                        }

                    }

                    return fn;

                }

                var fn = () => {


                }
            }

        }


        export class XDataList extends DataList {
            
            private __xds: bx.DataSource;
            get ds(): bx.DataSource {

                if (!this.__xds) {
                    this.__xds = new bx.DataSource(this.model);
                }

                return this.__xds;
            }

        }
    }

}


export module pubsub {
    
    export function subscribe(topic: string, callback: (msg?: any, data?: any) => any): number {

        return PubSub.subscribe(topic, callback);
    }


    export function publish(topic: string, data?: any) {
        return PubSub.publish(topic, data);
    }

}


export module local {


    var local: any = $['localStorage'];


    export function set(name: string, obj: any) {
        local.set(name, obj);
    }


    export function get(name: string) {

        function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        var obj: any = local.get(name);

        if (obj) {

            if (isJson(obj)) {

                obj = JSON.parse(obj);
            }
        }

        return obj;
    }


    export function remove(name: string) {
        return local.remove(name);
    }
}


export module url {

    export function get_param(param: string) {

        var url = local.get(constants.router.current_route);

        return (url && url.params) ? url.params[param] : undefined;
        
    }

}


export module metadata {

    var _entities_cache: EntityTypeDefinition[] = []

    export interface PropertyDef {
        type?: breeze.DataTypeSymbol
        isprimary?: boolean,        
    }


    export interface PropertyDefs {
        [name: string]: PropertyDef
    }

    
    export interface EntityDef {
        entityname: string,
        master_key?: string,        
        properties: PropertyDefs,
        relations?: {
            [name: string]: EntityDef
        }        
    }
    
    var DT = breeze.DataType;
    var defaultNameSpace = '';
    
    var Identity = breeze.AutoGeneratedKeyType.Identity;
    var Validator = breeze.Validator;
    var camelCaseConvention: breeze.NamingConvention = breeze.NamingConvention.none;

    // Breeze Labs: breeze.metadata.helper.js
    var helper = new breeze.config['MetadataHelper']();

    // Helper convenience methods
    var addDataService = helper.addDataService.bind(helper);
    var addTypeToStore = helper.addTypeToStore.bind(helper);
    var setDefaultNamespace = helper.setDefaultNamespace.bind(helper);

    var dataNameSpace = 'afrikNetMarket';

    export interface DataProperties {
        [name: string]: DataPropertyDefinition
    }

    export interface DataPropertyDefinition {
        dataType?: breeze.DataTypeSymbol;
        defaultValue?: any;
        isPartOfKey?: boolean;
        isUnmapped?: boolean;
        maxLength?: number;
    }


    export interface Extensions {
        [name: string]: DataPropertyExtension
    }


    export interface DataPropertyExtension {
        description: string
    }


    export interface EntityTypeDefinition {
        namespace?: string;
        shortName?: string;
        defaultResourceName: string,
        autoGeneratedKeyType?: breeze.AutoGeneratedKeyType,
        dataProperties: DataProperties;
        complexProperties?: breeze.DataProperty[];
        unmappedProperties?: breeze.DataProperty[];
        validators?: breeze.Validator[];
        //navigationProperties?: breeze.NavigationProperty[];
        navigationProperties?: any,
        custom?: Extensions
    }

    setDefaultNamespace(dataNameSpace);

    function __addEntityType(store: breeze.MetadataStore, type: EntityTypeDefinition) {

        var _type = _.extend(type, {
            namespace: dataNameSpace,
            shortName: type.defaultResourceName,
            autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
        });

        addTypeToStore(store, _type);
    }


    function __createDataStore(storeName: string): breeze.MetadataStore {

        var store: breeze.MetadataStore = new breeze.MetadataStore({
            namingConvention: camelCaseConvention
        });
        addDataService(store, storeName);

        return store;
    }


    interface Schema {
        srvName: string,
        store: breeze.MetadataStore
    }


    var dbSchema: Schema[] = [];


    function __regsiterSchema(srvName: string, store: breeze.MetadataStore) {

        dbSchema.push({
            srvName: srvName,
            store: store
        });
    }
    
    export var Store: breeze.MetadataStore = new breeze.MetadataStore({ namingConvention: camelCaseConvention });


    //addDataService(Store, 'DataStore');
    //setDefaultNamespace('afriknetMarket');


    export function add_to_Store(type: EntityTypeDefinition) {

        _entities_cache.push(type);

        var _type = _.extend(type, {
            namespace: dataNameSpace,
            shortName: type.defaultResourceName,
            autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
        });

        addTypeToStore(Store, _type);
    }


    export function create_entity_def(source_def: EntityDef, master_src_def?: EntityDef) {

        var target_ent: EntityTypeDefinition = {
            defaultResourceName: source_def.entityname,
            dataProperties: {},
            navigationProperties: {}
        }
        
        
        _.each(Object.keys(source_def.properties) , k => {

            var prop_def = source_def.properties[k];

            target_ent.dataProperties[k] = {
                dataType: prop_def.type ? prop_def.type : DT.String,
                isPartOfKey: prop_def.isprimary ? prop_def.isprimary : false
            }            
        });

        var has_primary = _.find(Object.keys(target_ent.dataProperties), k => {
            return target_ent.dataProperties[k].isPartOfKey
        });

        if (!has_primary) {
            target_ent.dataProperties['id'] = { dataType: DT.String, isPartOfKey : true }
        }

        if (master_src_def) {

            target_ent.navigationProperties[master_src_def.entityname] = {
                type: master_src_def.entityname,
                assoc: 'association_{0}_{1}'.format(master_src_def.entityname, source_def.entityname),
                foreignKeyNames: [source_def.master_key]
            }
        }
        
        if (source_def.relations) {

            _.each(Object.keys(source_def.relations), rel => {

                target_ent.navigationProperties[rel] = {
                    entityTypeName: rel,
                    associationName: 'association_{0}_{1}'.format(target_ent.defaultResourceName, rel),
                    isScalar: false
                }

                add_to_Store(target_ent);

                var rel_ent = source_def.relations[rel];

                create_entity_def(rel_ent);

            });

        } else {

            add_to_Store(target_ent);
        }
    }


    export function register_entity_defs() {

        _.each(_entities_cache, ent => {
            add_to_Store(ent);
        });

    }
}


export module misc {

    export interface LoadingProps extends views.ReactiveViewProps {
        height?: number
    }
    export class Loading extends views.ReactiveView {

        props: LoadingProps;


        render() {

            var __style = _.extend({
                height: 300 // default
            }, this.props);

            var html = <div style={__style} ></div>
                
            return html;
        }


        on_notify(): Q.Promise<any> {

            switch (this.current_event.action) {

                case constants.events.view_initialized: {

                    utils.spin(this.root);

                } break;

            }


            return Q.resolve(true);
        } 

    }
    
}


export module slide {

    export enum SLIDE_DIR { left_out, left_in, right_out, right_in }

    function _internal_slide(classname: string, $frame: JQuery, hide?: boolean) {

        var d = Q.defer();
        
        $frame.addClass(classname).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {

            $frame.removeClass(classname);

            if (!$frame.hasClass('no-hide')) {

                if (hide) {
                    $frame.addClass('hidden');
                }

            }

            
            
            d.resolve(true);
            
        });

        return d.promise;
    }

    function _slide_left_out($frame: JQuery) {
        return _internal_slide('animated fadeOutLeft', $frame, true);
    }

    function _slide_left_in($frame: JQuery) {
        return _internal_slide('animated fadeInLeft', $frame, false);
    }

    function _slide_right_out($frame: JQuery) {
        return _internal_slide('animated fadeOutRight', $frame, true);
    }

    function _slide_right_in($frame: JQuery) {
        return _internal_slide('animated fadeInRight', $frame);
    }


    export function slide_fn(el: JQuery, slide_dir: SLIDE_DIR): Q.Promise<any> {

        var d = Q.defer<any>();


        switch (slide_dir) {

            case SLIDE_DIR.left_out:
                {
                    _slide_left_out(el).then(() => {
                        d.resolve(true);
                    }).done();
                }
                break;

            case SLIDE_DIR.left_in:
                {
                    el.removeClass('hidden');

                    _slide_left_in(el).then(() => {

                        d.resolve(true);
                    }).done();
                }
                break;

            case SLIDE_DIR.right_out:
                {
                    _slide_right_out(el).then(() => {
                        
                        d.resolve(true);
                    }).done();
                }
                break;

            case SLIDE_DIR.right_in:
                {
                    el.removeClass('hidden');

                    _slide_right_in(el).then(() => {
                        d.resolve(true);
                    }).done();
                }
                break;
        }


        return d.promise;
    }


    export function slide_left_out( el: JQuery, cancelling?: boolean): Q.Promise<any> {

        if (cancelling === true) {
            return Q.resolve(false);
        }

        return slide_fn(el, SLIDE_DIR.left_out);
    }

    export function slide_left_in(el: JQuery, cancelling?: boolean): Q.Promise<any> {

        if (cancelling === true) {
            return Q.resolve(false);
        }

        return slide_fn(el, SLIDE_DIR.left_in);
    }

    export function slide_right_in(el: JQuery, cancelling?: boolean): Q.Promise<any> {

        if (cancelling === true) {
            return Q.resolve(false);
        }

        return slide_fn(el, SLIDE_DIR.right_in);
    }

    export function slide_right_out(el: JQuery, cancelling?: boolean): Q.Promise<any> {

        if (cancelling === true) {
            return Q.resolve(false);
        }

        return slide_fn(el, SLIDE_DIR.right_out);
    }

}


export module data {


    export interface CallParams {
        method: string,
        params: any
    }


    export interface DataQuery {
        
        where?: any,

        expand?: string[],

        orderBy?: string[]

        merge?: breeze.MergeStrategySymbol
    }
    

    export class DataSource {

        model: string;


        constructor(model: string) {

            this.model = model;

            if (__app && __app.metadata) {
                this.dm.metadataStore.importMetadata(__app.metadata);
            }
        }


        exec_query(query?: DataQuery): Q.Promise<breeze.Entity[]> {
            return this.fetch_data(query);
        }


        fetch_data(query?: DataQuery | any): Q.Promise<breeze.Entity[]> {

            if (!this.model) {

                toastr.error('model for ReactiveDataView is undefined');

                throw "model for ReactiveDataView is undefined";
            }


            var d = Q.defer<breeze.Entity[]>();
            

            var __qry: any = _.extend({
                from: this.model
            }, query);


            var qry = breeze.EntityQuery.from('data').withParameters({

                cache: false,

                $method: 'POST',

                $encoding: 'JSONP',

                $data: __qry
            });


            if (!query || !qry) {

                if (!qry) {

                }
            }


            if (this.dm.dataService.serviceName != utils.srv_url) {
                this.dm.dataService.serviceName = utils.srv_url;
            }

            var that = this

            this.dm.executeQuery(qry).then(rst => {

                if (rst.results && rst.results.length > 0) {

                    var str_data = (rst.results[0] as any).payload;

                    this.dm.importEntities(str_data, {
                        mergeStrategy: (query && query.merge) ? query.merge : breeze.MergeStrategy.OverwriteChanges
                    });
                }

                var __data = that.dm.getEntities(this.model);

                d.resolve(that.dm.getEntities(this.model));

            }).catch(err => {

                d.reject(JSON.stringify(err));
            });


            return d.promise;
        }
        

        fetch_metadata(): Q.Promise<any> {

            var d = Q.defer();

            this.dm.fetchMetadata().then(() => {
                this.dm.dataService.hasServerMetadata = true;
                d.resolve(true);
            });

            return d.promise;
        }
        

        exec_raw(query: string) {

            var d = Q.defer();
            
            var url = '{0}/raw'.format(utils.srv_url);
            
            $.ajax(url, {
                cache: false,
                method: 'POST',
                jsonp: true,
                data: {
                    service: this.model,
                    sql: query
                },
                success: (data: any, textStatus: string, jqXHR: JQueryXHR) => {
                    d.resolve(data);
                },
                error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                    d.reject(jqXHR.statusText);
                }
            })
            
            return d.promise;

        }


        call(args: CallParams): Q.Promise<any> {

            var d = Q.defer();

            var __url = '{0}/call'.format(utils.srv_url);

            $.ajax({
                url: __url,
                cache: false,
                method: 'POST',
                jsonp: true,
                data: {
                    service: this.model,
                    method: args.method,
                    params: args.params
                },
                success: (data: any, textStatus: string, jqXHR: JQueryXHR) => {
                    
                    d.resolve(data);
                },
                error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                    d.reject(jqXHR.responseText);
                }
            });

            return d.promise;

        }


        saveChanges() {
            return this.saveChangesEx(this.dm.exportEntities());
        }


        saveChangesEx(entities: string) {

            var d = Q.defer();
            
            var __url = '{0}/SaveChanges'.format(utils.srv_url);

            $.ajax({
                url: __url,
                cache: false,
                method: 'POST',
                jsonp: true,
                data: {
                    service: this.model,
                    entities: entities
                },
                success: (data: any, textStatus: string, jqXHR: JQueryXHR) => {

                    this.dm['acceptChanges']();

                    d.resolve(data);
                },
                error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                    d.reject(jqXHR.responseText);
                }
            });

            return d.promise;
        }
        

        private _dm: breeze.EntityManager;
        get dm(): breeze.EntityManager {
            
            if (!this._dm) {
                this._dm = new breeze.EntityManager({
                    dataService: new breeze.DataService({
                        serviceName: '{0}'.format(utils.srv_url),
                        //hasServerMetadata : false             
                        //useJsonp : true
                    }),
                    validationOptions: new breeze.ValidationOptions({
                        validateOnSave: false,
                        validateOnAttach: false,
                        validateOnQuery: true
                    })
                });

            }
            return this._dm;
        }


        get data(): breeze.Entity[] {
            return this.dm.getEntities(this.model);
        }
        
        
        get type(): breeze.EntityType {
            return this.dm.metadataStore.getEntityType(this.model) as any;
        }


        get pKey(): breeze.DataProperty {

            return _.find(this.type.dataProperties, p => {
                return p.isPartOfKey;
            });
        }
        

        findkey(id: string) {
            return _.find(this.data, d => {
                return _.result(d, this.pKey.name) === id;
            });
        }


        find(field: string, value: any) {

            return _.find(this.data, d => {
                return _.result(d, field) === value;
            });
        }


        findall(field: string, value: any) {

            return _.filter(this.data, d => {
                return _.result(d, field) === value;
            });
        }

    }

}


export module bx {

    interface MetaInfo {
        name: string,
        type: any   
    }
    
    export class DataSource extends data.DataSource {


        constructor(model: string) {
            super(model);
        }


        private __dm: breeze.EntityManager;
        get dm(): breeze.EntityManager {

            if (!this.__dm) {
                this.__dm = new breeze.EntityManager({
                    dataService: new breeze.DataService({
                        serviceName: this.model,
                    }),
                    validationOptions: new breeze.ValidationOptions({
                        validateOnSave: false,
                        validateOnAttach: false,
                        validateOnQuery: true
                    })
                });

            }
            return this.__dm;
        }

        

        fetch_data(qry?: Backendless.DataQueryValueI): Q.Promise<breeze.Entity[]> {
            
            if (!datastore.Store.hasMetadataFor(this.model)) {

                return this.fetch_metadata().then(args => {

                    return this.fetch_dataEx(qry);
                });

            } else {
                
                this.dm.metadataStore.importMetadata(datastore.Store.exportMetadata());

                return this.fetch_dataEx(qry);
            }
            
        }


        private fetch_dataEx(qry?: Backendless.DataQueryValueI): Q.Promise<breeze.Entity[]> {

            var d = Q.defer<breeze.Entity[]>();

            var __qry = qry ? qry : new Backendless.DataQuery();
            if (!__qry.options) {
                __qry.options = {}
            }

            var __model: any = this.model;

            if (__model === utils.UsrModel) {
                __model = Backendless.User;
            }


            Backendless.Persistence.of(__model).find(qry, new Backendless.Async((list: any) => {

                _.each(list.data, obj => {

                    this.dm.createEntity(this.model, obj, breeze.EntityState.Unchanged, breeze.MergeStrategy.OverwriteChanges);
                });

                var entities = this.dm.getEntities(this.model);

                d.resolve(entities);

            }, err => {

                d.reject(err);

                }));

            return d.promise;
        }
                

        private set_metadata(model: string, master: datastore.EntityDef, meta: any[]): datastore.EntityDef {

            var src_props = _.filter(meta, p => {
                return !(p.type === 'RELATION_LIST')
            });
            
            var src_navs = _.filter(meta, p => {
                return (p.type === 'RELATION_LIST')
            });
            
            var dest_props: any = {};
        
            _.each(src_props, p => {

                dest_props[p.name] = {
                    isPartOfKey : p.isPrimaryKey
                }
            });
            
            var type: datastore.EntityDef = {
                entityname: model,
                master_key: master ? master.entityname + 'id' : null,
                properties: dest_props,
                relations: {}
            }

            return type;            
        }


        private fetch_and_store_meta(model: string, master: datastore.EntityDef): Q.Promise<any> {
            
            var d = Q.defer<any>();
            
            Backendless.Persistence.describe(model, new Backendless.Async((src_props: any[]) => {

                var relations = _.filter(src_props, p => {
                    return p.type === 'RELATION_LIST';
                });

                var type: datastore.EntityDef = this.set_metadata(model, master, src_props);
                
                if (relations.length > 0) {

                    var array: any = _.map(relations, rel => {

                        return this.fetch_and_store_meta(rel.name, type);

                    });


                    Q.all(array).then((children: any) => {  

                        _.each(children, (child: any) => {
                            type.relations[child.entityname] = child;
                        });
                        
                        d.resolve(type);

                    });
                    
                } else {

                    d.resolve(type);
                    
                }
                
            }, err => {

                d.reject(err);

            }));


            return d.promise;
        }


        fetch_metadata(): Q.Promise<any> {

            var d = Q.defer();

            this.fetch_and_store_meta(this.model, null).then( (type:any) => {

                datastore.create_entity_def(type);

                this.dm.metadataStore.importMetadata(datastore.Store.exportMetadata());

                d.resolve(true);

            }).fail(err => {

                toastr.error(JSON.stringify(err));
            });
               
            
            return d.promise;
        }
        

        delete(id: string) {

            var d = Q.defer();

            var tmp = new DataSource(this.model);

            var ent = this.findkey(id);

            ent.entityAspect.setDeleted();

            var __data = this.__unwrap([ent], this.dm.metadataStore.getEntityType(this.model) as any);
            
            Backendless.Persistence.of(this.model).remove(__data[0], new Backendless.Async(succ => {

                ent.entityAspect.acceptChanges();

                this.dm.importEntities(tmp.dm.exportEntities(), {
                    mergeStrategy: breeze.MergeStrategy.OverwriteChanges
                });

                d.resolve(true);

            }, err => {

                d.reject(err);

            }));

            return d.promise;

        }


        save(ent: breeze.Entity) {

            var d = Q.defer();
            
            var list: any = this.__unwrap([ent], this.dm.metadataStore.getEntityType(this.model) as any);

            Backendless.Persistence.of(this.model).save(list[0], new Backendless.Async(succ => {

                ent.entityAspect.acceptChanges();

                d.resolve(true);

            }, err => {

                d.reject(err);

            }));

            return d.promise;

        }


        saveChanges() {
            
            var tmp = new DataSource(this.model);

            tmp.dm.importEntities(this.dm.exportEntities());

            var _data = tmp.unwrap();

            var d = Q.defer();

            Backendless.Persistence.of(this.model).save(_data[0], new Backendless.Async(succ => {

                this.dm['acceptChanges']();

                d.resolve(true);

            }, err => {

                d.reject(err);

            }));


            return d.promise;
        }


        retrieve_added() {

            var entities = this.dm.getEntities(this.model);

            _.each(entities, ent => {

                switch (ent.entityAspect.entityState) {

                    case breeze.EntityState.Added: {



                    } break;

                    case breeze.EntityState.Modified: {

                    } break;


                    case breeze.EntityState.Deleted: {


                    } break;

                }

            });
            
        }


        unwrap(): any[] {

            var data = this.dm.getEntities(this.model);

            var jsList:any = this.__unwrap(data, this.dm.metadataStore.getEntityType(this.model) as any);

            return jsList;

            //return this.unwrap_type(this.dm.metadataStore.getEntityType(this.model) as any, data);
        }


        private __unwrap(data: breeze.Entity[], type: breeze.EntityType) {

            var array: any[] = [];

            _.each(data, obj => {

                var __obj = ko['mapping'].toJS(obj);

                __obj['___class'] = type.shortName;

                delete __obj._$typeName;
                delete __obj.entityAspect;
                delete __obj.entityType;

                if (obj.entityAspect.entityState.isAdded()) {
                    delete __obj.objectId;
                }

                var navs = _.filter(type.navigationProperties, nav => {
                    return !nav.isScalar;
                });

                var master_rel: any = _.find(type.navigationProperties, nav => {
                    return nav.isScalar
                });

                if (master_rel) {
                    delete __obj[master_rel.name];
                }
                

                array.push(__obj);


                _.each(navs, nav => {

                    var nav_type:any = this.dm.metadataStore.getEntityType(nav.name);

                    var nav_data = __obj[nav.name];

                    __obj[nav.name] = this.__unwrap(nav_data, nav_type);

                });                
            });


            return array;

        }


        private unwrap_type(type: breeze.EntityType, data: breeze.Entity[]) {

            var rst: any[] = [];

            _.each(data, d => {
                
                var json = {
                    __class: type.shortName
                }

                json = ko['mapping'].toJS(d);

                _.each(type.dataProperties, p => {
                    json[p.name] = _.result(d, p.name);
                });

                _.each(type.navigationProperties, (nav: breeze.NavigationProperty) => {

                    if (!nav.isScalar) {

                        var nav_type: any = this.dm.metadataStore.getEntityType(nav.entityType.name);

                        var nav_data: any = d[nav.name]();

                        var nav_json_array = this.unwrap_type(nav_type, nav_data);

                        json[nav.name] = nav_json_array;
                    }
                    

                });

                rst.push(json);

            });           

            return rst;

        }
        
    }


}


export module dx {

    var keyId = 'objectId'
    
    export class DataSource {

        private __model: string;
        get model(): string {
            return this.__model;
        }

        private __items: any[];
        get items(): any[] {
            if (!this.__items) {
                this.__items = [];
            }
            return this.__items;
        }


        constructor(model: string) {
            this.__model = model;
        }


        findkey(id: any) {

            return _.find(this.items, obj => {
                return _.result(obj, keyId) === id;
            });
        }


        find(prop: string, val:any) {

            return _.find(this.items, obj => {
                return _.result(obj, prop) === val;
            });

        }
        

        fetch(where?: string): Q.Promise<any[]> {


            var __qry:any = new Backendless.DataQuery();


            __qry.condition = where;


            var d = Q.defer<any[]>();


            var that = this;


            Backendless.Persistence.of(this.model).find(__qry, new Backendless.Async((rst: any) => {
                
                that.__items = _.map(rst.data, d => {

                    var __ko = ko['mapping'].fromJS(d);

                    var obj = ko['track'](__ko, { depp: true });

                    return obj;
                });
                
                d.resolve(that.__items);

            }, err => {

                d.reject(err);
            }));


            return d.promise;
        }     


        save() {

            var all = Q.defer();
            
            var promises = _.map(this.items,obj => {

                var __ko = ko['untrack'](obj);

                __ko = ko['mapping'].toJS(__ko);

                var d = Q.defer();
                
                Backendless.Persistence.of(this.model).save(__ko, new Backendless.Async(rst => {

                    d.resolve(true);

                }, err => {

                    d.reject(err);

                }));

                return d.promise;

            });


            return Q.all(promises).then(() => {

                return all.resolve(true);

            }).fail(err => {

                return all.reject(err);
            });
        }


        remove(obj: any, update?: boolean) {

            var d = Q.defer();

            var __ko = ko['untrack'](obj);

            __ko = ko['mapping'].toJS(__ko);

            Backendless.Persistence.of(this.model).remove(__ko, new Backendless.Async(rst => {

                if (update) {

                    var index = this.items.indexOf(obj);

                    if (index >= 0) {
                        this.__items = this.__items.slice(index, 1);
                    }
                }

                d.resolve(true);

            }, err => {

                d.reject(err);

            }));

            return d.promise;

        }
    }
}


export module datastore {

    var _entities_cache: EntityTypeDefinition[] = []


    export interface PropertyDef {
        type?: breeze.DataTypeSymbol
        isPartOfKey?: boolean,
    }


    export interface PropertyDefs {
        [name: string]: PropertyDef
    }


    export interface EntityDef {
        entityname: string,
        master_key?: string,
        properties: PropertyDefs,
        relations?: {
            [name: string]: EntityDef
        }
    }


    var DT = breeze.DataType;
    var defaultNameSpace = '';

    var Identity = breeze.AutoGeneratedKeyType.Identity;
    var Validator = breeze.Validator;
    var camelCaseConvention: breeze.NamingConvention = breeze.NamingConvention.none;

    // Breeze Labs: breeze.metadata.helper.js
    var helper = new breeze.config['MetadataHelper']();

    // Helper convenience methods
    var addDataService = helper.addDataService.bind(helper);
    var addTypeToStore = helper.addTypeToStore.bind(helper);
    var setDefaultNamespace = helper.setDefaultNamespace.bind(helper);

    var dataNameSpace = 'StampDev';

    export interface DataProperties {
        [name: string]: DataPropertyDefinition
    }


    export interface DataPropertyDefinition {
        dataType?: breeze.DataTypeSymbol;
        defaultValue?: any;
        isPartOfKey?: boolean;
        isUnmapped?: boolean;
        maxLength?: number;
    }


    export interface Extensions {
        [name: string]: DataPropertyExtension
    }


    export interface DataPropertyExtension {
        description: string
    }


    export interface EntityTypeDefinition {
        namespace?: string;
        shortName?: string;
        defaultResourceName: string,
        autoGeneratedKeyType?: breeze.AutoGeneratedKeyType,
        dataProperties: DataProperties;
        complexProperties?: breeze.DataProperty[];
        unmappedProperties?: breeze.DataProperty[];
        validators?: breeze.Validator[];
        //navigationProperties?: breeze.NavigationProperty[];
        navigationProperties?: any,
        custom?: Extensions
    }


    setDefaultNamespace(dataNameSpace);


    function __addEntityType(store: breeze.MetadataStore, type: EntityTypeDefinition) {

        var _type = _.extend(type, {
            namespace: dataNameSpace,
            shortName: type.defaultResourceName,
            autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
        });

        addTypeToStore(store, _type);
    }


    function __createDataStore(storeName: string): breeze.MetadataStore {

        var store: breeze.MetadataStore = new breeze.MetadataStore({
            namingConvention: camelCaseConvention
        });
        addDataService(store, storeName);

        return store;
    }


    interface Schema {
        srvName: string,
        store: breeze.MetadataStore
    }


    var dbSchema: Schema[] = [];


    function __regsiterSchema(srvName: string, store: breeze.MetadataStore) {

        dbSchema.push({
            srvName: srvName,
            store: store
        });
    }


    export var Store: breeze.MetadataStore = new breeze.MetadataStore({ namingConvention: camelCaseConvention });


    addDataService(Store, 'DataStore');


    export function add_to_Store(type: EntityTypeDefinition) {

        _entities_cache.push(type);

        var _type = _.extend(type, {
            namespace: dataNameSpace,
            shortName: type.defaultResourceName,
            autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
        });

        addDataService(Store, type.shortName);

        addTypeToStore(Store, _type);
    }


    export function create_entity_def(source_def: EntityDef, master_src_def?: EntityDef) {

        var target_ent: EntityTypeDefinition = {
            defaultResourceName: source_def.entityname,
            dataProperties: {},
            navigationProperties: {}
        }

        _.each(Object.keys(source_def.properties), k => {

            var prop_def = source_def.properties[k];

            target_ent.dataProperties[k] = {
                dataType: prop_def.type ? prop_def.type : DT.String,
                nameOnServer: k,
                isPartOfKey: prop_def['isPartOfKey']
            } as any;
        });

        target_ent.dataProperties['created'] = { dataType: breeze.DataType.String }
        target_ent.dataProperties['updated'] = { dataType: breeze.DataType.String }

        var has_primary = _.find(Object.keys(target_ent.dataProperties), k => {
            return target_ent.dataProperties[k].isPartOfKey
        });
        
        if (master_src_def) {

            target_ent.navigationProperties[master_src_def.entityname] = {
                type: master_src_def.entityname,
                assoc: 'association_{0}_{1}'.format(master_src_def.entityname, source_def.entityname),
                foreignKeyNames: [source_def.master_key]
            }
        }

        var rel_count = Object.keys(source_def.relations).length;

        if (rel_count > 0) {

            _.each(Object.keys(source_def.relations), rel => {

                target_ent.navigationProperties[rel] = {
                    entityTypeName: rel,
                    associationName: 'association_{0}_{1}'.format(target_ent.defaultResourceName, rel),
                    isScalar: false
                }

                if (!Store.getEntityType(target_ent.defaultResourceName, true)) {
                    add_to_Store(target_ent);
                }
                
                var rel_ent = source_def.relations[rel];

                create_entity_def(rel_ent, source_def );

            });

        } else {

            add_to_Store(target_ent);
        }
    }


}


