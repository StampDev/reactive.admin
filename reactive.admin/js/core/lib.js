/// <amd-dependency path="url-pattern" />
/// <reference path="../../typings/backendless.d.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", 'react', 'react-dom', 'react-bootstrap', "url-pattern"], function (require, exports, React, ReactDOM, rb) {
    "use strict";
    var b = rb;
    var _urlp = require('url-pattern');
    var __modal_count;
    __modal_count = 0;
    var __settings;
    var __routes;
    var __app;
    var __instance_dir = '../ins';
    breeze.core['config'].initializeAdapterInstance("uriBuilder", "json");
    var ajaxAdapter = breeze.config.getAdapterInstance('ajax');
    ajaxAdapter.defaultSettings = {
        cache: false
    };
    var core_types;
    (function (core_types) {
        (function (Usertype) {
            Usertype[Usertype["admin"] = 0] = "admin";
            Usertype[Usertype["contact"] = 1] = "contact";
            Usertype[Usertype["guest"] = 2] = "guest";
        })(core_types.Usertype || (core_types.Usertype = {}));
        var Usertype = core_types.Usertype;
    })(core_types = exports.core_types || (exports.core_types = {}));
    var constants;
    (function (constants) {
        var data;
        (function (data) {
            (function (USRSTATUS) {
                USRSTATUS[USRSTATUS["Pendning"] = 0] = "Pendning";
                USRSTATUS[USRSTATUS["Active"] = 1] = "Active";
            })(data.USRSTATUS || (data.USRSTATUS = {}));
            var USRSTATUS = data.USRSTATUS;
        })(data = constants.data || (constants.data = {}));
        var pubsub;
        (function (pubsub) {
            pubsub.broadcast = 'broadcast';
            var articles_list;
            (function (articles_list) {
                articles_list.article_selected = 'article_selected';
            })(articles_list = pubsub.articles_list || (pubsub.articles_list = {}));
            var products;
            (function (products) {
                products.current_product_updated = 'current_product_updated';
            })(products = pubsub.products || (pubsub.products = {}));
        })(pubsub = constants.pubsub || (constants.pubsub = {}));
        var app_menus;
        (function (app_menus) {
            app_menus.active_nav_menu = 'active-nav-menu';
        })(app_menus = constants.app_menus || (constants.app_menus = {}));
        var events;
        (function (events) {
            events.view_initialized = 'view_initialized';
            events.view_updated = 'view_updated';
            events.view_data_loaded = 'view_item_loaded';
        })(events = constants.events || (constants.events = {}));
        var article_editview;
        (function (article_editview) {
            article_editview.REALOAD_ITEM_AFTER_SAVE = 'REALOAD_ITEM_AFTER_SAVE';
            article_editview.SINGLE_PRODUCT_LOADED = 'SINGLE_PRODUCT_LOADED';
            article_editview.NEW_AMAZON_ARCTICLE = 'NEW_AMAZON_ARCTICLE';
        })(article_editview = constants.article_editview || (constants.article_editview = {}));
        var article_datalist;
        (function (article_datalist) {
            article_datalist.STORED_ACTIVE_PAGE = 'STORED_ACTIVE_PAGE';
            article_datalist.RESTORED_ACTIVE_PAGE = 'RESTORED_ACTIVE_PAGE';
        })(article_datalist = constants.article_datalist || (constants.article_datalist = {}));
        var app;
        (function (app) {
            app.PREVIOUS_WINDOW_SCROLL_POSITION = 'PREVIOUS_WINDOW_SCROLL_POSITION';
        })(app = constants.app || (constants.app = {}));
        var router;
        (function (router) {
            router.current_route = 'current_route';
        })(router = constants.router || (constants.router = {}));
    })(constants = exports.constants || (exports.constants = {}));
    var views;
    (function (views) {
        var viewcount = 1;
        var ReactView = (function (_super) {
            __extends(ReactView, _super);
            function ReactView(props) {
                _super.call(this, props);
                this.props = props;
                this.state = {};
                if (this.props.start_by_loading) {
                    this.state.loading = true;
                }
            }
            Object.defineProperty(ReactView.prototype, "app", {
                get: function () {
                    return __app;
                },
                enumerable: true,
                configurable: true
            });
            ReactView.prototype.initalize_state = function () {
                return {};
            };
            Object.defineProperty(ReactView.prototype, "root", {
                get: function () {
                    return $(ReactDOM.findDOMNode(this));
                },
                enumerable: true,
                configurable: true
            });
            ReactView.prototype.jget = function (sel) {
                return this.root.find(sel);
            };
            ReactView.prototype.componentWillReceiveProps = function (nextProps) {
            };
            ReactView.prototype.componentWillMount = function () {
            };
            ReactView.prototype.componentDidUpdate = function () {
            };
            ReactView.prototype.componentWillUnmount = function () {
            };
            ReactView.prototype.componentDidMount = function () {
            };
            ReactView.prototype.componentWillUpdate = function () {
            };
            ReactView.prototype.newState = function (new_state, done) {
                this.setState(_.extend(this.state, new_state), function () {
                    if (done) {
                        done();
                    }
                });
            };
            ReactView.prototype.updateState = function (state, done) {
                this.newState(state, done);
            };
            ReactView.prototype.error = function (err) {
                toastr.error(JSON.stringify(err));
            };
            return ReactView;
        }(React.Component));
        views.ReactView = ReactView;
        var ReactiveView = (function (_super) {
            __extends(ReactiveView, _super);
            function ReactiveView(props) {
                var _this = this;
                _super.call(this, props);
                this.notify_handler = pubsub.subscribe(this.viewid, function (msg, data) {
                    _this.on_notification_received(data);
                });
                this.get_view_handler = pubsub.subscribe('get-' + this.viewid, function (msg, data) {
                    return data(_this);
                });
                this.broadcast_handler = pubsub.subscribe(constants.pubsub.broadcast, function (msg, data) {
                    _this.on_broadcast_received(data);
                });
            }
            ReactiveView.prototype.get_uiSchema = function () {
                return null;
            };
            Object.defineProperty(ReactiveView.prototype, "viewid", {
                get: function () {
                    if (!this._viewid) {
                        this._viewid = 'view-' + viewcount++;
                    }
                    return this._viewid;
                },
                enumerable: true,
                configurable: true
            });
            ReactiveView.prototype.componentDidMount = function () {
                _super.prototype.componentDidMount.call(this);
                if (this.root && this.root.length > 0) {
                    this.root.attr('data-reactive-view', this.viewid);
                }
                this.notify({
                    action: constants.events.view_initialized,
                });
            };
            ReactiveView.prototype.componentDidUpdate = function () {
                if (this.root && this.root.length > 0) {
                    this.root.attr('data-reactive-view', this.viewid);
                }
                _super.prototype.componentDidUpdate.call(this);
            };
            ReactiveView.prototype.componentWillUnmount = function () {
                _super.prototype.componentWillUnmount.call(this);
                PubSub.unsubscribe(this.broadcast_handler);
                PubSub.unsubscribe(this.notify_handler);
                PubSub.unsubscribe(this.get_view_handler);
            };
            ReactiveView.prototype.componentWillReceiveProps = function (nextProps) {
                _super.prototype.componentWillReceiveProps.call(this, nextProps);
            };
            ReactiveView.prototype.notify = function (event) {
                pubsub.publish(this.viewid, event);
            };
            ReactiveView.prototype.get_view = function (viewid, callback) {
                return PubSub.publishSync('get-' + viewid, callback);
            };
            ReactiveView.prototype.can_process_notification = function (new_event) {
                return Q.resolve(true);
            };
            ReactiveView.prototype.on_notification_received = function (new_event) {
                var _this = this;
                return this.can_process_notification(new_event).then(function () {
                    _this.previous_event = _this.current_event;
                    _this.current_event = new_event;
                    return _this.on_notify().then(function (args) {
                        if (_this.current_event.done) {
                            _this.current_event.done(args);
                        }
                        return args;
                    });
                }).done();
            };
            ReactiveView.prototype.setState = function (state, done) {
                _super.prototype.setState.call(this, state, done);
            };
            ReactiveView.prototype.on_notify = function () {
                return Q.resolve(true);
            };
            ReactiveView.prototype.broadcast = function (event) {
                pubsub.publish(constants.pubsub.broadcast, event);
            };
            ReactiveView.prototype.on_broadcast_received = function (broadcast) {
                this.notify(broadcast);
            };
            return ReactiveView;
        }(ReactView));
        views.ReactiveView = ReactiveView;
        var ReactiveDataView = (function (_super) {
            __extends(ReactiveDataView, _super);
            function ReactiveDataView(props) {
                _super.call(this, props);
                this.state.loading = true;
            }
            Object.defineProperty(ReactiveDataView.prototype, "ds", {
                get: function () {
                    if (!this._ds) {
                        this._ds = new data.DataSource(this.get_model());
                    }
                    return this._ds;
                },
                enumerable: true,
                configurable: true
            });
            ReactiveDataView.prototype.get_model = function () {
                return this.props.model;
            };
            ReactiveDataView.prototype.load_data = function (qry) {
                return this.ds.exec_query(qry);
            };
            ReactiveDataView.prototype.on_notify = function () {
                var _this = this;
                switch (this.current_event.action) {
                    case constants.events.view_initialized:
                        {
                            if (this.state.loading) {
                                this.load_data().then(function () {
                                    _this.setState({
                                        loading: false
                                    });
                                });
                            }
                        }
                        break;
                }
                return _super.prototype.on_notify.call(this);
            };
            return ReactiveDataView;
        }(ReactiveView));
        views.ReactiveDataView = ReactiveDataView;
        var ReactiveEditDataView = (function (_super) {
            __extends(ReactiveEditDataView, _super);
            function ReactiveEditDataView(props) {
                _super.call(this, props);
                if (this.props.autoinsert === undefined) {
                    this.state.autoinsert = true;
                }
                else {
                    this.state.autoinsert = this.props.autoinsert;
                }
            }
            Object.defineProperty(ReactiveEditDataView.prototype, "is_new", {
                get: function () {
                    if (this.item) {
                        return this.item.entityAspect.entityState == breeze.EntityState.Added;
                    }
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReactiveEditDataView.prototype, "item", {
                get: function () {
                    if (!this._item) {
                        this._item = this.init_item();
                    }
                    return this._item;
                },
                enumerable: true,
                configurable: true
            });
            ReactiveEditDataView.prototype.init_item = function () {
                var _this = this;
                var type = this.ds.dm.metadataStore.getEntityType(this.get_model());
                var pk = type.dataProperties.filter(function (prop) {
                    return prop.isPartOfKey;
                })[0];
                if (this.props.id) {
                    return _.find(this.ds.dm.getEntities(this.get_model()), function (d) {
                        return _.result(d, pk.name) === _this.props.id;
                    });
                }
                else {
                    if (this.props.autoinsert) {
                        var values = _.extend((_a = {},
                            _a[pk.name] = utils.guid(),
                            _a
                        ), this.get_initial_values());
                        var ent = this.ds.dm.createEntity(this.get_model(), values);
                        this.ds.dm.addEntity(ent);
                        return ent;
                    }
                }
                return null;
                var _a;
            };
            ReactiveEditDataView.prototype.get_initial_values = function () {
                return {};
            };
            ReactiveEditDataView.prototype.save_data = function () {
                return this.ds.saveChanges();
            };
            ReactiveEditDataView.prototype.cancel_data = function () {
                if (this.ds.dm.hasChanges()) {
                    this.ds.dm.rejectChanges();
                }
            };
            ReactiveEditDataView.prototype.on_notify = function () {
                var _this = this;
                switch (this.current_event.action) {
                    case constants.events.view_initialized:
                        {
                            if (this.state.loading) {
                                if (!this.is_new) {
                                    var type = this.ds.dm.metadataStore.getEntityType(this.get_model());
                                    var pk = type.dataProperties.filter(function (prop) {
                                        return prop.isPartOfKey;
                                    })[0];
                                    var qry = {
                                        where: (_a = {}, _a[pk.name] = { eq: this.props.id }, _a)
                                    };
                                    this.load_data(qry).then(function () {
                                        _this.setState({
                                            loading: false
                                        }, function () {
                                            _this.notify({
                                                action: constants.events.view_data_loaded
                                            });
                                        });
                                    });
                                }
                                else {
                                    this.notify({
                                        action: constants.events.view_data_loaded
                                    });
                                }
                            }
                        }
                        break;
                }
                return _super.prototype.on_notify.call(this);
                var _a;
            };
            return ReactiveEditDataView;
        }(ReactiveDataView));
        views.ReactiveEditDataView = ReactiveEditDataView;
        var BaseMasterPage = (function (_super) {
            __extends(BaseMasterPage, _super);
            function BaseMasterPage() {
                _super.apply(this, arguments);
            }
            return BaseMasterPage;
        }(ReactView));
        views.BaseMasterPage = BaseMasterPage;
        var BaseLoginView = (function (_super) {
            __extends(BaseLoginView, _super);
            function BaseLoginView() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(BaseLoginView.prototype, "ctrl_email", {
                get: function () {
                    return this.root.find('.ctrl_email');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseLoginView.prototype, "ctrl_password", {
                get: function () {
                    return this.root.find('.ctrl_password');
                },
                enumerable: true,
                configurable: true
            });
            BaseLoginView.prototype.componentDidMount = function () {
                _super.prototype.componentDidMount.call(this);
                this.root.find('.form-login').validate({
                    rules: {}
                });
            };
            return BaseLoginView;
        }(ReactView));
        views.BaseLoginView = BaseLoginView;
        var LoaderView = (function (_super) {
            __extends(LoaderView, _super);
            function LoaderView() {
                _super.apply(this, arguments);
            }
            LoaderView.prototype.render = function () {
                var style = {};
                var _height = this.props.height;
                if (!_height) {
                    _height = 350;
                }
                var html = React.createElement("div", {style: { minHeight: _height }});
                return html;
            };
            LoaderView.prototype.on_notify = function () {
                switch (this.current_event.action) {
                    case constants.events.view_initialized:
                        {
                            utils.spin(this.root);
                        }
                        break;
                }
                return _super.prototype.on_notify.call(this);
            };
            return LoaderView;
        }(views.ReactiveView));
        views.LoaderView = LoaderView;
        var TabControl = (function (_super) {
            __extends(TabControl, _super);
            function TabControl() {
                _super.apply(this, arguments);
            }
            TabControl.prototype.render = function () {
                var html = React.createElement("div", null, this.props.children);
                return html;
            };
            TabControl.prototype.on_notify = function () {
                switch (this.current_event.action) {
                    case constants.events.view_initialized:
                        {
                            this.fix_tabs_urls();
                        }
                        break;
                }
                return _super.prototype.on_notify.call(this);
            };
            TabControl.prototype.fix_tabs_urls = function () {
                _.each(this.root.find('li[role="presentation"]'), function (li) {
                    var a = $(li).find('a');
                    var url = a.attr('aria-controls');
                    $(a).attr('href', '#{0}'.format(url));
                    $(a).off('click');
                    $(a).click(function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        $(e.currentTarget).tab('show');
                        return false;
                    });
                });
            };
            return TabControl;
        }(views.ReactiveView));
        views.TabControl = TabControl;
        var IBox = (function (_super) {
            __extends(IBox, _super);
            function IBox() {
                _super.apply(this, arguments);
            }
            IBox.prototype.render = function () {
                var html = React.createElement("div", {className: "ibox ibox-view"}, React.createElement("div", {className: "ibox-content"}, this.props.children));
                return html;
            };
            return IBox;
        }(views.ReactiveView));
        views.IBox = IBox;
    })(views = exports.views || (exports.views = {}));
    var system;
    (function (system) {
        function load_config() {
            var d = Q.defer();
            var __config_path = __instance_dir + '/config';
            require([__config_path], function (obj) {
                __settings = obj.config;
                d.resolve(__settings);
            });
            return d.promise;
        }
        system.load_config = load_config;
        function load_routes() {
            var d = Q.defer();
            var __routes_path = __instance_dir + '/routes';
            require([__routes_path], function (obj) {
                __routes = obj.routes;
                d.resolve(__routes);
            });
            return d.promise;
        }
        system.load_routes = load_routes;
        function load_application() {
            var d = Q.defer();
            if (!__settings.application_path) {
                return Q.reject(false);
            }
            var __app_path = __instance_dir + __settings.application_path;
            require([__app_path], function (obj) {
                __app = new obj['InsApp']();
                d.resolve(__app);
            });
            return d.promise;
        }
        system.load_application = load_application;
        function start() {
            function init_backendless() {
                Backendless.initApp(__settings.BACKENDLESS_APPID, __settings.BACKENDLESS_KEYID, __settings.BACKENDLESS_VERID);
            }
            Q.all([
                load_config(),
                load_routes()
            ]).then(function () {
                init_backendless();
                // dummy call to initialize remote database
                var ds = new data.DataSource('occp');
                var qry = {
                    take: 50
                };
                ds.fetch_data(qry)
                    .then(function () {
                    var metadata = ds.dm.metadataStore.exportMetadata();
                    __app.metadata = metadata;
                })
                    .fail(function (err) {
                    toastr.error('Database initialization failed: ' + JSON.stringify(err));
                });
                load_application().finally(function () {
                    __app.start_routing();
                });
            });
        }
        system.start = start;
        function check_user_logged() {
            if (!Backendless.UserService.isValidLogin()) {
                page('/login');
                return false;
            }
            return true;
        }
        system.check_user_logged = check_user_logged;
    })(system = exports.system || (exports.system = {}));
    var app;
    (function (app_1) {
        var router = (function () {
            function router(app) {
                this.app = app;
                this.flatten_menus = [];
            }
            router.prototype.start_routing = function () {
                var _this = this;
                var __menus = this.app.get_menus();
                this.flatten_menus = this.flatten(__menus);
                _.each(this.flatten_menus, function (menu) {
                    page(menu.url, function (ctx) {
                        _this.execute_menu(ctx.path, ctx);
                    });
                });
                page.start();
            };
            router.prototype.flatten = function (list, parent_url) {
                var sub_arrays = ['submenus'];
                var destlist = [];
                for (var i in list) {
                    var src = list[i];
                    var dest_obj = {};
                    var has_children = false;
                    for (var k in src) {
                        if (!src['hasOwnProperty'](k)) {
                            continue;
                        }
                        var is_array = _.filter(sub_arrays, function (p) {
                            return p === k;
                        }).length > 0;
                        if (!is_array) {
                            dest_obj[k] = src[k];
                        }
                        else {
                            has_children = true;
                            var __list = this.flatten(src[k], src.url);
                            _.each(__list, function (obj) {
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
            };
            router.prototype.find_menu_by_name = function (name) {
                var menu = _.find(this.flatten_menus, function (mn) {
                    return mn.name === name;
                });
                return menu;
            };
            router.prototype.find_matching_menu = function (url, match) {
                if (match) {
                    var pattern = new _urlp(match);
                    return (url === match) || pattern.match(url);
                }
                else {
                    var menu = _.find(this.flatten_menus, function (mn) {
                        var pattern = new _urlp(mn.url);
                        var matching = (mn.url === url)
                            || pattern.match(url);
                        return matching;
                    });
                    return menu;
                }
            };
            router.prototype.matching_url = function (url, match) {
                var menu = this.find_matching_menu(url, match);
                return (menu != undefined) && (menu != null);
            };
            router.prototype.execute_menu = function (url, ctx) {
                //##
                if (window.location.href && window.location.href['endsWith']('##')) {
                    url = url.replace('##', '');
                }
                else {
                }
                local.set(constants.router.current_route, {
                    params: ctx ? ctx.params : {},
                    path: url
                });
                var menu = this.find_matching_menu(url);
                if (!menu) {
                }
                if (url != '/login' && url != '/register') {
                    if (!system.check_user_logged()) {
                        return;
                    }
                }
                var path = __instance_dir + menu.path;
                require([path], function (obj) {
                    var view = obj[Object.keys(obj)[0]];
                    ReactDOM.unmountComponentAtNode($(__settings.page_root)[0]);
                    ReactDOM.render(React.createElement(view), $(__settings.page_root)[0]);
                });
            };
            router.prototype.navigate = function (urlpath) {
                return page(urlpath);
            };
            router.prototype.start = function () {
                this.start_routing();
            };
            return router;
        }());
        app_1.router = router;
        var Application = (function () {
            function Application() {
            }
            Object.defineProperty(Application.prototype, "router", {
                get: function () {
                    if (!this.__router) {
                        this.__router = new router(this);
                    }
                    return this.__router;
                },
                enumerable: true,
                configurable: true
            });
            Application.prototype.start_routing = function () {
                this.router.start();
            };
            Object.defineProperty(Application.prototype, "currentUser", {
                get: function () {
                    return Backendless.UserService.getCurrentUser();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "CompId", {
                get: function () {
                    return _.result(this.currentUser, 'compid');
                },
                enumerable: true,
                configurable: true
            });
            Application.prototype.login = function (email, password) {
                var d = Q.defer();
                Backendless.UserService.login(email, password, true, new Backendless.Async(function (data) {
                    d.resolve(true);
                }, function (err) {
                    d.reject(err);
                }));
                return d.promise;
            };
            Application.prototype.logout = function () {
                Backendless.UserService.logout(new Backendless.Async(function (data) {
                }, function (err) {
                    alert(err);
                }));
            };
            Application.prototype.get_menus = function () {
                return [];
            };
            Application.prototype.add_corporate_account = function (args) {
                var user = _.extend(new Backendless.User(), {
                    name: args.usrname,
                    surname: args.usrsurname,
                    email: args.usremail,
                    password: args.usrpassword
                });
                Backendless.UserService.register(user, new Backendless.Async(function (rst) {
                }, function (err) {
                }));
            };
            return Application;
        }());
        app_1.Application = Application;
    })(app = exports.app || (exports.app = {}));
    var modal;
    (function (modal_1) {
        var Modal = (function (_super) {
            __extends(Modal, _super);
            function Modal(props) {
                _super.call(this, props);
                this.state.show = false;
                if (this.props.showModal != undefined) {
                    this.state.show = this.props.showModal;
                }
                if (this.props.content) {
                    this.state.content = this.props.content(this);
                }
            }
            Object.defineProperty(Modal.prototype, "modal_count", {
                get: function () {
                    if (!this.__modal_count) {
                        this.__modal_count = ++__modal_count;
                    }
                    return this.__modal_count;
                },
                enumerable: true,
                configurable: true
            });
            Modal.prototype.show = function (content, title) {
                var that = this;
                this.setState({ show: true, content: content }, function () {
                    if (title) {
                        $('.modal-title').html(title);
                    }
                });
            };
            Modal.prototype.close = function () {
                this.setState({ show: false });
            };
            Modal.prototype.render = function () {
                var that = this;
                var props = {
                    show: this.state.show,
                    onHide: function () {
                        that.close();
                    }
                };
                if (this.props.bsSize) {
                    props.bsSize = this.props.bsSize;
                }
                var should_hide_footer = this.props.hide_footer ? 'hidden' : null;
                var action = this.props.action ? this.props.action : 'Save';
                var row_body = !this.props.inmodal ? 'row' : '';
                var inmodal = this.props.inmodal ? 'inmodal' : '';
                var html = React.createElement(b.Modal, __assign({}, props, {"data-dismiss": "modal", className: "modal-count-{0} {1} {2}".format(this.modal_count, this.props.classlist, inmodal)}), React.createElement(b.Modal.Header, {closeButton: true}, this.props.icon, React.createElement(b.Modal.Title, {class: "header-title"}, this.props.title)), React.createElement(b.Modal.Body, {className: row_body}, this.state.content), React.createElement(b.Modal.Footer, {className: should_hide_footer}, React.createElement(b.Button, {style: { padding: 10 }, onClick: function () { that.save(); }, className: 'btn-save', bsStyle: "primary"}, action)));
                return html;
            };
            Modal.prototype.save = function () {
                var _this = this;
                if (this.props.onFinish) {
                    this.props.onFinish().then(function () {
                        _this.close();
                    });
                }
            };
            return Modal;
        }(views.ReactView));
        modal_1.Modal = Modal;
        function Show(props) {
            var $container = $('body > .modal-container');
            if ($container.length === 0) {
                $container = $('<div class="modal-container"></div>').appendTo($('body'));
            }
            else {
                ReactDOM.unmountComponentAtNode($container[0]);
            }
            props.showModal = true;
            ReactDOM.render(React.createElement(Modal, __assign({}, props)), $container[0]);
        }
        modal_1.Show = Show;
    })(modal = exports.modal || (exports.modal = {}));
    var controls;
    (function (controls) {
        var Constants = (function () {
            function Constants() {
            }
            Constants.VALUE_CHANGED = 'VALUE_CHANGED';
            return Constants;
        }());
        controls.Constants = Constants;
        var BindableControl = (function (_super) {
            __extends(BindableControl, _super);
            function BindableControl(props) {
                _super.call(this, props);
                this.state.item = this.props.entity;
            }
            BindableControl.prototype.get_val = function () {
                return null;
            };
            BindableControl.prototype.onchange = function () {
                if (this.props.onChange) {
                    this.props.onChange();
                }
                else {
                    if (this.state.item && this.props.entity) {
                        var val = this.get_val();
                        if ($.isFunction(this.state.item[this.props.property])) {
                            this.state.item[this.props.property](val);
                        }
                        else {
                            this.state.item[this.props.property] = val;
                        }
                    }
                }
            };
            BindableControl.prototype.componentWillReceiveProps = function (nextProps) {
                if (nextProps && nextProps.entity) {
                    this.state.item = nextProps.entity;
                }
            };
            return BindableControl;
        }(views.ReactiveView));
        controls.BindableControl = BindableControl;
        var Textarea = (function (_super) {
            __extends(Textarea, _super);
            function Textarea() {
                _super.apply(this, arguments);
            }
            Textarea.prototype.render = function () {
                var attrs = _.extend({
                    rows: 4
                }, this.props.attrs);
                var html = React.createElement("textarea", __assign({}, attrs, {className: "form-control", onChange: this.onchange.bind(this)}), _.result(this.state.item, this.props.property));
                return html;
            };
            Textarea.prototype.get_val = function () {
                return this.root.val();
            };
            return Textarea;
        }(BindableControl));
        controls.Textarea = Textarea;
        var TogglableTextarea = (function (_super) {
            __extends(TogglableTextarea, _super);
            function TogglableTextarea(props) {
                _super.call(this, props);
                this.state.readonly = this.props.attrs && this.props.attrs.readOnly;
            }
            TogglableTextarea.prototype.componentWillReceiveProps = function (nextProps) {
                this.state.readonly = nextProps.attrs && nextProps.attrs.readOnly;
            };
            TogglableTextarea.prototype.render = function () {
                var html = _super.prototype.render.call(this);
                if (this.state.readonly) {
                    html = React.createElement("p", __assign({}, this.props.attrs), null);
                }
                return html;
            };
            return TogglableTextarea;
        }(Textarea));
        controls.TogglableTextarea = TogglableTextarea;
        var TextNumeric = (function (_super) {
            __extends(TextNumeric, _super);
            function TextNumeric() {
                _super.apply(this, arguments);
            }
            TextNumeric.prototype.componentWillMount = function () {
                _super.prototype.componentWillMount.call(this);
                if (this.props.ctx && this.props.property) {
                    this.state.value = _.result(this.props.ctx, this.props.property);
                }
            };
            TextNumeric.prototype.render = function () {
                if (this.props.readonly) {
                    return React.createElement("span", {className: "ctrl-numeric", style: { fontSize: 20 }}, this.state.value);
                }
                return React.createElement("input", {type: "text", className: "form-control ctrl-numeric input-lg text-danger", defaultValue: this.state.value, style: { fontSize: 20 }});
            };
            TextNumeric.prototype.componentDidMount = function () {
                _super.prototype.componentDidMount.call(this);
                this.init_numeric();
            };
            TextNumeric.prototype.componentDidUpdate = function () {
                _super.prototype.componentDidUpdate.call(this);
                this.init_numeric();
            };
            TextNumeric.prototype.init_numeric = function () {
                var _this = this;
                this.root.autoNumeric('init', { 'aSign': '€ ' });
                if (!this.props.readonly) {
                    var that = this;
                    this.root.on('change', function (e) {
                        var __value = $(e.currentTarget).autoNumeric('get');
                        if (that.props.ctx && _this.props.property) {
                            if ($.isFunction(that.props.ctx[that.props.property])) {
                                that.props.ctx[that.props.property](__value);
                            }
                            else {
                                that.props.ctx[that.props.property] = __value;
                            }
                        }
                    });
                }
            };
            return TextNumeric;
        }(views.ReactView));
        controls.TextNumeric = TextNumeric;
        var TextInput = (function (_super) {
            __extends(TextInput, _super);
            function TextInput(props) {
                _super.call(this, props);
                this.state.item = this.props.entity;
            }
            TextInput.prototype.render = function () {
                var default_value = null;
                if (this.state.item && this.props.property) {
                    default_value = _.result(this.state.item, this.props.property);
                }
                var html = React.createElement("input", __assign({type: "text"}, this.props.attrs, {className: "form-control input-lg", name: this.props.property, placeholder: this.props.placeholder, onChange: this.onchange.bind(this), defaultValue: default_value}));
                return html;
            };
            TextInput.prototype.get_val = function () {
                return this.root.val();
            };
            return TextInput;
        }(BindableControl));
        controls.TextInput = TextInput;
        var QuillEditor = (function (_super) {
            __extends(QuillEditor, _super);
            function QuillEditor(props) {
                _super.call(this, props);
                this.state.item = this.props.entity;
            }
            QuillEditor.prototype.render = function () {
                var html = React.createElement("div", {className: "root-quill"});
                return html;
            };
            QuillEditor.prototype.get_val = function () {
                return this.quill['getText']();
            };
            QuillEditor.prototype.on_notify = function () {
                var that = this;
                switch (this.current_event.action) {
                    case constants.events.view_initialized:
                        {
                            this.init_quill();
                        }
                        break;
                }
                return _super.prototype.on_notify.call(this);
            };
            QuillEditor.prototype.componentDidUpdate = function () {
                _super.prototype.componentDidUpdate.call(this);
                this.init_quill();
            };
            QuillEditor.prototype.init_quill = function () {
                var _this = this;
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
                this.quill.on('text-change', function (delta, source) {
                    _this.onchange();
                });
            };
            return QuillEditor;
        }(BindableControl));
        controls.QuillEditor = QuillEditor;
        var CheckBox = (function (_super) {
            __extends(CheckBox, _super);
            function CheckBox(props) {
                _super.call(this, props);
            }
            CheckBox.prototype.render = function () {
                var html = React.createElement("label", null, this.props.title, React.createElement("input", {type: "checkbox"}));
                return html;
            };
            CheckBox.prototype.on_notify = function () {
                switch (this.current_event.action) {
                    case constants.events.view_initialized:
                        {
                            this.initialize_checkbox();
                        }
                        break;
                }
                return _super.prototype.on_notify.call(this);
            };
            CheckBox.prototype.initialize_checkbox = function () {
                var _this = this;
                this.root.find('input')['iCheck']({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green',
                    unposition: this.props.unposition
                });
                this.root.find('input').on('ifChecked', function (event) {
                    _this.set_value(true);
                    if (_this.props.on_check) {
                        _this.props.on_check(event);
                    }
                });
                this.root.find('input').on('ifUnchecked', function (event) {
                    _this.set_value(false);
                    if (_this.props.on_uncheck) {
                        _this.props.on_uncheck(event);
                    }
                });
                var default_value = null;
                if (this.state.item && this.props.property) {
                    default_value = _.result(this.state.item, this.props.property);
                }
                if (default_value === true || default_value === 1) {
                    this.root.find('input')['iCheck']('check');
                }
            };
            CheckBox.prototype.set_value = function (checked) {
                if (this.state.item && this.props.property) {
                    if ($.isFunction(this.state.item[this.props.property])) {
                        this.state.item[this.props.property](checked);
                    }
                    else {
                        this.state.item[this.props.property] = checked;
                    }
                }
            };
            CheckBox.prototype.get_val = function () {
                return this.root.find('input').prop("checked", true);
            };
            return CheckBox;
        }(BindableControl));
        controls.CheckBox = CheckBox;
        var IconCheckBox = (function (_super) {
            __extends(IconCheckBox, _super);
            function IconCheckBox(props) {
                _super.call(this, props);
                this['id'] = utils.guid();
                this.state.is_checked = this.props.is_checked;
                this.state.is_enabled = this.props.is_enabled === undefined ? true : this.props.is_enabled;
            }
            IconCheckBox.prototype.componentWillReceiveProps = function (next) {
                this.state.is_checked = next.is_checked;
                this.state.is_enabled = next.is_enabled;
            };
            IconCheckBox.prototype.render = function () {
                var view = null;
                var _style = {
                    verticalAlign: 'middle',
                    opacity: this.state.is_enabled ? 0.7 : 0.1
                };
                if (this.state.is_checked) {
                    view = React.createElement("i", {className: "fa fa-check-square-o fa-2x", style: _style});
                }
                else {
                    view = React.createElement("i", {className: "fa fa-square-o fa-2x", style: _style});
                }
                var html = React.createElement("div", {onClick: this.do_check.bind(this), style: { display: 'inline-block' }}, view, React.createElement("span", null, this.props.title));
                return html;
            };
            IconCheckBox.prototype.do_check = function () {
                var _this = this;
                if (!this.state.is_enabled) {
                    return;
                }
                this.newState({
                    is_checked: !this.state.is_checked
                }, function () {
                    if (_this.state.is_checked) {
                        _this.root.addClass('checkbox-selected');
                    }
                    else {
                        _this.root.removeClass('checkbox-selected');
                    }
                    if (_this.props.onChecked) {
                        _this.props.onChecked(_this);
                    }
                });
            };
            Object.defineProperty(IconCheckBox.prototype, "is_checked", {
                get: function () {
                    return this.state.is_checked;
                },
                enumerable: true,
                configurable: true
            });
            return IconCheckBox;
        }(BindableControl));
        controls.IconCheckBox = IconCheckBox;
        var Box = (function (_super) {
            __extends(Box, _super);
            function Box(props) {
                _super.call(this, props);
            }
            Box.prototype.render = function () {
                var props = _.extend({}, this.props);
                var toolbox = !this.props.toolbox ? 'hidden' : null;
                var html = React.createElement("div", __assign({className: "ibox"}, props), React.createElement("div", {className: "ibox-title hidden"}, React.createElement("h5", {className: "title"}, this.props.title), React.createElement("div", {className: "ibox-tools {0}".format(toolbox)}, React.createElement("a", {className: "collapse-link"}, React.createElement("i", {className: "fa fa-chevron-up"})), React.createElement("a", {className: "dropdown-toggle", "data-toggle": "dropdown", href: "#"}, React.createElement("i", {className: "fa fa-wrench"})), React.createElement("ul", {className: "dropdown-menu dropdown-user"}, React.createElement("li", null, React.createElement("a", {href: "#"}, "Config option 1")), React.createElement("li", null, React.createElement("a", {href: "#"}, "Config option 2"))), React.createElement("a", {className: "close-link"}, React.createElement("i", {className: "fa fa-times"})))), React.createElement("div", {className: "ibox-content col-lg-12"}, this.props.children), React.createElement("div", {className: "ibox-footer hidden"}));
                return html;
            };
            Box.prototype.componentDidMount = function () {
                this.init_toolbox();
            };
            Box.prototype.init_toolbox = function () {
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
                    this.jget('.ibox-footer').removeClass('hidden');
                    this.props.onfooter(this, this.jget('.ibox-footer'));
                }
            };
            return Box;
        }(views.ReactView));
        controls.Box = Box;
        var TextIcon = (function (_super) {
            __extends(TextIcon, _super);
            function TextIcon() {
                _super.apply(this, arguments);
            }
            TextIcon.prototype.render = function () {
                var binding = this.props.property ? 'textInput:{0}'.format(this.props.property) : '';
                var html = React.createElement("div", null, React.createElement("h2", null, React.createElement("span", null, this.props.label)), React.createElement(b.FormGroup, null, React.createElement(b.InputGroup, null, React.createElement(b.InputGroup.Addon, null, React.createElement("i", {className: "fa {0}".format(this.props.icon)})), React.createElement(b.FormControl, {type: "text", name: this.props.property, required: true, placeholder: this.props.placeholder, "data-bind": binding})), React.createElement("span", {className: "error-tag"})));
                return html;
            };
            return TextIcon;
        }(views.ReactiveView));
        controls.TextIcon = TextIcon;
    })(controls = exports.controls || (exports.controls = {}));
    var forms;
    (function (forms) {
        var actions;
        (function (actions) {
            actions.EDIT_ROW = 'EDIT_ROW';
            actions.DELETE_ROW = 'DELETE_ROW';
            actions.INIT_SCROLLBAR = 'INIT_SCROLLBAR';
            actions.DATA_LOADED = 'DATA_LOADED';
        })(actions = forms.actions || (forms.actions = {}));
        var defs;
        (function (defs) {
            (function (RowType) {
                RowType[RowType["simple"] = 0] = "simple";
                RowType[RowType["tabs"] = 1] = "tabs";
            })(defs.RowType || (defs.RowType = {}));
            var RowType = defs.RowType;
            (function (Controltypes) {
                Controltypes[Controltypes["text"] = 0] = "text";
                Controltypes[Controltypes["bool"] = 1] = "bool";
                Controltypes[Controltypes["numeric"] = 2] = "numeric";
                Controltypes[Controltypes["currency"] = 3] = "currency";
                Controltypes[Controltypes["enum"] = 4] = "enum";
                Controltypes[Controltypes["lookup"] = 5] = "lookup";
                Controltypes[Controltypes["label"] = 6] = "label";
            })(defs.Controltypes || (defs.Controltypes = {}));
            var Controltypes = defs.Controltypes;
        })(defs = forms.defs || (forms.defs = {}));
        var ui;
        (function (ui) {
            var SearchState;
            (function (SearchState) {
                SearchState[SearchState["idle"] = 0] = "idle";
                SearchState[SearchState["started"] = 1] = "started";
                SearchState[SearchState["running"] = 2] = "running";
            })(SearchState || (SearchState = {}));
            var DataList = (function (_super) {
                __extends(DataList, _super);
                function DataList(props) {
                    _super.call(this, props);
                    this.state.loading = true;
                    this.searchState = SearchState.idle;
                    this.state.scroll_height = this.props.scroll_height;
                    if (!this.state.scroll_height) {
                        this.state.scroll_height = 670;
                    }
                }
                Object.defineProperty(DataList.prototype, "ds", {
                    get: function () {
                        if (!this.__ds) {
                            this.__ds = new data.DataSource(this.model);
                        }
                        return this.__ds;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DataList.prototype, "tbl_settings", {
                    get: function () {
                        return this.props.settings;
                    },
                    enumerable: true,
                    configurable: true
                });
                DataList.prototype.render = function () {
                    if (this.state.loading) {
                        return React.createElement(views.LoaderView, null);
                    }
                    var html = React.createElement("div", {className: "datalist"}, React.createElement("table", {className: "table table-striped table-hover datalist-table", style: { width: '100%' }}));
                    return html;
                };
                DataList.prototype.get_model = function () {
                    return this.props.model;
                };
                Object.defineProperty(DataList.prototype, "model", {
                    get: function () {
                        return this.get_model();
                    },
                    enumerable: true,
                    configurable: true
                });
                DataList.prototype.on_notify = function () {
                    switch (this.current_event.action) {
                        case constants.events.view_initialized:
                            {
                                this.local_load_data();
                            }
                            break;
                    }
                    return _super.prototype.on_notify.call(this);
                };
                DataList.prototype.local_load_data = function () {
                    var _this = this;
                    var d = Q.defer();
                    this.newState({
                        loading: true
                    }, function () {
                        _this.load_data()
                            .then(function (data) {
                            if (_this.props.owner) {
                                _this.props.owner.notify({
                                    action: actions.INIT_SCROLLBAR
                                });
                            }
                            _this.newState({
                                loading: false,
                                data: data
                            }, function () {
                                _this.init_datatable();
                                d.resolve(true);
                            });
                        }).fail(function (err) {
                            d.reject(err);
                        });
                    });
                    return d.promise;
                };
                DataList.prototype.init_datatable = function () {
                    if (this.datatable) {
                        this.datatable.destroy();
                    }
                    this.init_database_events();
                    var __options = this.init_datatable_settings();
                    this.datatable = this.root.find('table')['dataTable'](__options);
                    if (local.get(constants.article_datalist.STORED_ACTIVE_PAGE)) {
                        this.datatable.page(local.get(constants.article_datalist.STORED_ACTIVE_PAGE))['draw']('page');
                        local.remove(constants.article_datalist.STORED_ACTIVE_PAGE);
                    }
                    if (local.get(constants.app.PREVIOUS_WINDOW_SCROLL_POSITION)) {
                        $(window).scrollTop(local.get(constants.app.PREVIOUS_WINDOW_SCROLL_POSITION));
                        local.remove(constants.app.PREVIOUS_WINDOW_SCROLL_POSITION);
                    }
                };
                DataList.prototype.init_datatable_settings = function () {
                    var _this = this;
                    var _row_fn = this.tbl_settings.createdRow;
                    var setts = _.extend({
                        ordering: false,
                        createdRow: function (row, data, dataIndex) {
                            _this.createdRow(row, data, dataIndex);
                            if (_row_fn) {
                                _row_fn.call(_this, row, data, dataIndex);
                            }
                        }
                    }, this.tbl_settings);
                    setts.destroy = true;
                    setts.data = this.state.data;
                    setts.columns = this.init_columns(setts.columns);
                    return setts;
                };
                DataList.prototype.init_database_events = function () {
                    var _this = this;
                    this.root.off('preInit.dt');
                    this.root.on('preInit.dt', function (e, settings) {
                        _this.api = new $.fn.dataTable.Api(settings);
                    });
                    this.root.find('table').off('draw.dt');
                    this.root.find('table').on('draw.dt', function () {
                        var apply_scrollheight = _this.props.apply_scrollheight;
                        if (apply_scrollheight === undefined) {
                            apply_scrollheight = true;
                        }
                        if (apply_scrollheight) {
                            _this.root['slimScroll']({
                                'height': '{0}px'.format(_this.state.scroll_height)
                            });
                        }
                        _this.root.find('ins').css('position', 'relative!important');
                        var search = _this.api.settings().search();
                        if (search) {
                            _this.root.find('.datalist-table')['highlight'](search);
                        }
                        else {
                            _this.root.find('.datalist-table')['unhighlight']();
                        }
                    });
                    this.root.find('table').off('init.dt');
                    this.root.find('table').on('init.dt', function () {
                        _this.init_search();
                    });
                };
                DataList.prototype.init_columns = function (_columns) {
                    var _this = this;
                    var columns = deepcopy(_columns);
                    _.each(columns, function (col) {
                        var _fn = col.createdCell;
                        col.createdCell = function (cell, cellData, rowData, row, col) {
                            _this.createdCell(cell, cellData, rowData, row, col);
                            if (_fn) {
                                _fn.call(_this, cell, cellData, rowData, row, col);
                            }
                        };
                    });
                    if (this.props.row_count) {
                        this.add_row_counter(columns);
                    }
                    this.add_row_actions(columns);
                    return columns;
                };
                DataList.prototype.init_search = function () {
                    var that = this;
                    this.root.find('.dataTables_filter input')
                        .unbind('input keydown keypress keyup')
                        .bind("input", function (e) {
                        var fn = this;
                        if (that.searchState === SearchState.idle) {
                            that.searchState = SearchState.started;
                        }
                        else {
                            if (that.searchState === SearchState.running) {
                                clearTimeout(that.searchTimeOut);
                                that.searchState = SearchState.started;
                            }
                        }
                        if (that.searchState === SearchState.started) {
                            that.searchState = SearchState.running;
                            var timeout = that.tbl_settings.serverSide ? 2000 : 500;
                            that.searchTimeOut = setTimeout(function () {
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
                };
                DataList.prototype.add_row_counter = function (columns) {
                    var counter = 1;
                    var that = this;
                    columns.unshift({
                        title: '',
                        data: null,
                        width: '5%',
                        createdCell: function (cell, cellData, rowData, row, col) {
                            var api = this['api']();
                            var info = api.page.info();
                            var rowindex = (info.length * info.page) + row + 1;
                            $(cell).empty();
                            $(cell).append($('<div class="row-counter" data-rowcount={0}>{0}.</div>'.format(rowindex)));
                            $(cell).css('width', '5%');
                        }
                    });
                };
                DataList.prototype.add_row_actions = function (columns) {
                    var add_actions = this.props.allow_delete_row || this.props.allow_edit_row;
                    if (add_actions) {
                        var td_actions = [];
                        if (this.props.allow_edit_row) {
                            td_actions.push(React.createElement("td", null, this.add_edit_row_btn(this.props.allow_delete_row)));
                        }
                        if (this.props.allow_delete_row) {
                            td_actions.push(React.createElement("td", null, this.add_delete_row_btn()));
                        }
                        var tbl_actions = React.createElement("table", {className: "pull-right"}, React.createElement("tbody", null, React.createElement("tr", null, td_actions)));
                        columns.push({
                            title: '',
                            data: null,
                            createdCell: function (cell, cellData, rowData) {
                                $(cell).empty();
                                ReactDOM.render(tbl_actions, $(cell)[0]);
                                $(cell).closest('tr').hover(function () {
                                    $(cell).closest('tr').find('.btn-row-actions').css('opacity', '1');
                                }, function () {
                                    $(cell).closest('tr').find('.btn-row-actions').css('opacity', '0.2');
                                });
                            }
                        });
                    }
                };
                DataList.prototype.get_row_actions_style = function (margin) {
                    var _style = {
                        opacity: 0.3
                    };
                    if (margin) {
                        _style.marginRight = 10;
                    }
                    return _style;
                };
                DataList.prototype.add_edit_row_btn = function (margin) {
                    var _styles = {};
                    if (margin) {
                        _styles = {
                            marginRight: 10
                        };
                    }
                    var btn = React.createElement("button", {className: "btn btn-sm btn-info btn-outline btn-row-actions btn-row-edit", onClick: this.do_edit_row.bind(this), style: this.get_row_actions_style(margin)}, React.createElement("i", {className: "fa fa-edit"}));
                    return btn;
                };
                DataList.prototype.do_edit_row = function (e) {
                    e.preventDefault();
                    if (this.props.owner) {
                        var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');
                        this.props.owner.notify({
                            action: actions.EDIT_ROW,
                            data: id
                        });
                    }
                };
                DataList.prototype.do_delete_row = function (e) {
                    e.preventDefault();
                    if (this.props.owner) {
                        var id = $(e.currentTarget).closest('[data-rowid]').attr('data-rowid');
                        this.props.owner.notify({
                            action: actions.DELETE_ROW,
                            data: id
                        });
                    }
                };
                DataList.prototype.add_delete_row_btn = function () {
                    var btn = React.createElement("button", {className: "btn btn-sm btn-warning btn-outline btn-row-actions btn-row-delete", onClick: this.do_delete_row.bind(this), style: this.get_row_actions_style()}, React.createElement("i", {className: "fa fa-trash"}));
                    return btn;
                };
                DataList.prototype.load_data = function () {
                    return this.props.load_data.call(this);
                };
                DataList.prototype.format_query_results = function (data) {
                    var index = 0;
                    var __data = _.map(data, function (obj) {
                        return _.extend(obj, {
                            DT_RowID: ++index
                        });
                    });
                    return __data;
                };
                DataList.prototype.createdCell = function (cell, cellData, rowData, row, col) {
                };
                DataList.prototype.createdRow = function (row, data, rowindex) {
                    $(row).attr('data-rowid', _.result(data, 'ID'));
                };
                DataList.prototype.init_srv_pipeline = function () {
                    $.fn.dataTable.pipeline = function (opts) {
                        // Configuration options
                        var conf = $.extend({
                            pages: 5,
                            url: '',
                            data: null,
                            // matching how `ajax.data` works in DataTables
                            method: 'GET' // Ajax HTTP method
                        }, opts);
                        // Private variables for storing the cache
                        var cacheLower = -1;
                        var cacheUpper = null;
                        var cacheLastRequest = null;
                        var cacheLastJson = null;
                        var fn = function (request, drawCallback, settings) {
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
                                JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)) {
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
                        };
                        return fn;
                    };
                    var fn = function () {
                    };
                };
                return DataList;
            }(views.ReactiveView));
            ui.DataList = DataList;
            var XDataList = (function (_super) {
                __extends(XDataList, _super);
                function XDataList() {
                    _super.apply(this, arguments);
                }
                Object.defineProperty(XDataList.prototype, "ds", {
                    get: function () {
                        if (!this.__xds) {
                            this.__xds = new bx.DataSource(this.model);
                        }
                        return this.__xds;
                    },
                    enumerable: true,
                    configurable: true
                });
                return XDataList;
            }(DataList));
            ui.XDataList = XDataList;
        })(ui = forms.ui || (forms.ui = {}));
    })(forms = exports.forms || (exports.forms = {}));
    var pubsub;
    (function (pubsub) {
        function subscribe(topic, callback) {
            return PubSub.subscribe(topic, callback);
        }
        pubsub.subscribe = subscribe;
        function publish(topic, data) {
            return PubSub.publish(topic, data);
        }
        pubsub.publish = publish;
    })(pubsub = exports.pubsub || (exports.pubsub = {}));
    var local;
    (function (local_1) {
        var local = $['localStorage'];
        function set(name, obj) {
            local.set(name, obj);
        }
        local_1.set = set;
        function get(name) {
            function isJson(str) {
                try {
                    JSON.parse(str);
                }
                catch (e) {
                    return false;
                }
                return true;
            }
            var obj = local.get(name);
            if (obj) {
                if (isJson(obj)) {
                    obj = JSON.parse(obj);
                }
            }
            return obj;
        }
        local_1.get = get;
        function remove(name) {
            return local.remove(name);
        }
        local_1.remove = remove;
    })(local = exports.local || (exports.local = {}));
    var url;
    (function (url_1) {
        function get_param(param) {
            var url = local.get(constants.router.current_route);
            return (url && url.params) ? url.params[param] : undefined;
        }
        url_1.get_param = get_param;
    })(url = exports.url || (exports.url = {}));
    var metadata;
    (function (metadata) {
        var _entities_cache = [];
        var DT = breeze.DataType;
        var defaultNameSpace = '';
        var Identity = breeze.AutoGeneratedKeyType.Identity;
        var Validator = breeze.Validator;
        var camelCaseConvention = breeze.NamingConvention.none;
        // Breeze Labs: breeze.metadata.helper.js
        var helper = new breeze.config['MetadataHelper']();
        // Helper convenience methods
        var addDataService = helper.addDataService.bind(helper);
        var addTypeToStore = helper.addTypeToStore.bind(helper);
        var setDefaultNamespace = helper.setDefaultNamespace.bind(helper);
        var dataNameSpace = 'afrikNetMarket';
        setDefaultNamespace(dataNameSpace);
        function __addEntityType(store, type) {
            var _type = _.extend(type, {
                namespace: dataNameSpace,
                shortName: type.defaultResourceName,
                autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
            });
            addTypeToStore(store, _type);
        }
        function __createDataStore(storeName) {
            var store = new breeze.MetadataStore({
                namingConvention: camelCaseConvention
            });
            addDataService(store, storeName);
            return store;
        }
        var dbSchema = [];
        function __regsiterSchema(srvName, store) {
            dbSchema.push({
                srvName: srvName,
                store: store
            });
        }
        metadata.Store = new breeze.MetadataStore({ namingConvention: camelCaseConvention });
        //addDataService(Store, 'DataStore');
        //setDefaultNamespace('afriknetMarket');
        function add_to_Store(type) {
            _entities_cache.push(type);
            var _type = _.extend(type, {
                namespace: dataNameSpace,
                shortName: type.defaultResourceName,
                autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
            });
            addTypeToStore(metadata.Store, _type);
        }
        metadata.add_to_Store = add_to_Store;
        function create_entity_def(source_def, master_src_def) {
            var target_ent = {
                defaultResourceName: source_def.entityname,
                dataProperties: {},
                navigationProperties: {}
            };
            _.each(Object.keys(source_def.properties), function (k) {
                var prop_def = source_def.properties[k];
                target_ent.dataProperties[k] = {
                    dataType: prop_def.type ? prop_def.type : DT.String,
                    isPartOfKey: prop_def.isprimary ? prop_def.isprimary : false
                };
            });
            var has_primary = _.find(Object.keys(target_ent.dataProperties), function (k) {
                return target_ent.dataProperties[k].isPartOfKey;
            });
            if (!has_primary) {
                target_ent.dataProperties['id'] = { dataType: DT.String, isPartOfKey: true };
            }
            if (master_src_def) {
                target_ent.navigationProperties[master_src_def.entityname] = {
                    type: master_src_def.entityname,
                    assoc: 'association_{0}_{1}'.format(master_src_def.entityname, source_def.entityname),
                    foreignKeyNames: [source_def.master_key]
                };
            }
            if (source_def.relations) {
                _.each(Object.keys(source_def.relations), function (rel) {
                    target_ent.navigationProperties[rel] = {
                        entityTypeName: rel,
                        associationName: 'association_{0}_{1}'.format(target_ent.defaultResourceName, rel),
                        isScalar: false
                    };
                    add_to_Store(target_ent);
                    var rel_ent = source_def.relations[rel];
                    create_entity_def(rel_ent);
                });
            }
            else {
                add_to_Store(target_ent);
            }
        }
        metadata.create_entity_def = create_entity_def;
        function register_entity_defs() {
            _.each(_entities_cache, function (ent) {
                add_to_Store(ent);
            });
        }
        metadata.register_entity_defs = register_entity_defs;
    })(metadata = exports.metadata || (exports.metadata = {}));
    var misc;
    (function (misc) {
        var Loading = (function (_super) {
            __extends(Loading, _super);
            function Loading() {
                _super.apply(this, arguments);
            }
            Loading.prototype.render = function () {
                var __style = _.extend({
                    height: 300 // default
                }, this.props);
                var html = React.createElement("div", {style: __style});
                return html;
            };
            Loading.prototype.on_notify = function () {
                switch (this.current_event.action) {
                    case constants.events.view_initialized:
                        {
                            utils.spin(this.root);
                        }
                        break;
                }
                return Q.resolve(true);
            };
            return Loading;
        }(views.ReactiveView));
        misc.Loading = Loading;
    })(misc = exports.misc || (exports.misc = {}));
    var slide;
    (function (slide) {
        (function (SLIDE_DIR) {
            SLIDE_DIR[SLIDE_DIR["left_out"] = 0] = "left_out";
            SLIDE_DIR[SLIDE_DIR["left_in"] = 1] = "left_in";
            SLIDE_DIR[SLIDE_DIR["right_out"] = 2] = "right_out";
            SLIDE_DIR[SLIDE_DIR["right_in"] = 3] = "right_in";
        })(slide.SLIDE_DIR || (slide.SLIDE_DIR = {}));
        var SLIDE_DIR = slide.SLIDE_DIR;
        function _internal_slide(classname, $frame, hide) {
            var d = Q.defer();
            $frame.addClass(classname).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
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
        function _slide_left_out($frame) {
            return _internal_slide('animated fadeOutLeft', $frame, true);
        }
        function _slide_left_in($frame) {
            return _internal_slide('animated fadeInLeft', $frame, false);
        }
        function _slide_right_out($frame) {
            return _internal_slide('animated fadeOutRight', $frame, true);
        }
        function _slide_right_in($frame) {
            return _internal_slide('animated fadeInRight', $frame);
        }
        function slide_fn(el, slide_dir) {
            var d = Q.defer();
            switch (slide_dir) {
                case SLIDE_DIR.left_out:
                    {
                        _slide_left_out(el).then(function () {
                            d.resolve(true);
                        }).done();
                    }
                    break;
                case SLIDE_DIR.left_in:
                    {
                        el.removeClass('hidden');
                        _slide_left_in(el).then(function () {
                            d.resolve(true);
                        }).done();
                    }
                    break;
                case SLIDE_DIR.right_out:
                    {
                        _slide_right_out(el).then(function () {
                            d.resolve(true);
                        }).done();
                    }
                    break;
                case SLIDE_DIR.right_in:
                    {
                        el.removeClass('hidden');
                        _slide_right_in(el).then(function () {
                            d.resolve(true);
                        }).done();
                    }
                    break;
            }
            return d.promise;
        }
        slide.slide_fn = slide_fn;
        function slide_left_out(el, cancelling) {
            if (cancelling === true) {
                return Q.resolve(false);
            }
            return slide_fn(el, SLIDE_DIR.left_out);
        }
        slide.slide_left_out = slide_left_out;
        function slide_left_in(el, cancelling) {
            if (cancelling === true) {
                return Q.resolve(false);
            }
            return slide_fn(el, SLIDE_DIR.left_in);
        }
        slide.slide_left_in = slide_left_in;
        function slide_right_in(el, cancelling) {
            if (cancelling === true) {
                return Q.resolve(false);
            }
            return slide_fn(el, SLIDE_DIR.right_in);
        }
        slide.slide_right_in = slide_right_in;
        function slide_right_out(el, cancelling) {
            if (cancelling === true) {
                return Q.resolve(false);
            }
            return slide_fn(el, SLIDE_DIR.right_out);
        }
        slide.slide_right_out = slide_right_out;
    })(slide = exports.slide || (exports.slide = {}));
    var data;
    (function (data_1) {
        var DataSource = (function () {
            function DataSource(model) {
                this.model = model;
                if (__app && __app.metadata) {
                    this.dm.metadataStore.importMetadata(__app.metadata);
                }
            }
            DataSource.prototype.exec_query = function (query) {
                return this.fetch_data(query);
            };
            DataSource.prototype.fetch_data = function (query) {
                var _this = this;
                if (!this.model) {
                    toastr.error('model for ReactiveDataView is undefined');
                    throw "model for ReactiveDataView is undefined";
                }
                var d = Q.defer();
                var __qry = _.extend({
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
                var that = this;
                this.dm.executeQuery(qry).then(function (rst) {
                    if (rst.results && rst.results.length > 0) {
                        var str_data = rst.results[0].payload;
                        _this.dm.importEntities(str_data, {
                            mergeStrategy: (query && query.merge) ? query.merge : breeze.MergeStrategy.OverwriteChanges
                        });
                    }
                    var __data = that.dm.getEntities(_this.model);
                    d.resolve(that.dm.getEntities(_this.model));
                }).catch(function (err) {
                    d.reject(JSON.stringify(err));
                });
                return d.promise;
            };
            DataSource.prototype.fetch_metadata = function () {
                var _this = this;
                var d = Q.defer();
                this.dm.fetchMetadata().then(function () {
                    _this.dm.dataService.hasServerMetadata = true;
                    d.resolve(true);
                });
                return d.promise;
            };
            DataSource.prototype.exec_raw = function (query) {
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
                    success: function (data, textStatus, jqXHR) {
                        d.resolve(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR.statusText);
                    }
                });
                return d.promise;
            };
            DataSource.prototype.call = function (args) {
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
                    success: function (data, textStatus, jqXHR) {
                        d.resolve(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR.responseText);
                    }
                });
                return d.promise;
            };
            DataSource.prototype.saveChanges = function () {
                return this.saveChangesEx(this.dm.exportEntities());
            };
            DataSource.prototype.saveChangesEx = function (entities) {
                var _this = this;
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
                    success: function (data, textStatus, jqXHR) {
                        _this.dm['acceptChanges']();
                        d.resolve(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        d.reject(jqXHR.responseText);
                    }
                });
                return d.promise;
            };
            Object.defineProperty(DataSource.prototype, "dm", {
                get: function () {
                    if (!this._dm) {
                        this._dm = new breeze.EntityManager({
                            dataService: new breeze.DataService({
                                serviceName: '{0}'.format(utils.srv_url),
                            }),
                            validationOptions: new breeze.ValidationOptions({
                                validateOnSave: false,
                                validateOnAttach: false,
                                validateOnQuery: true
                            })
                        });
                    }
                    return this._dm;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataSource.prototype, "data", {
                get: function () {
                    return this.dm.getEntities(this.model);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataSource.prototype, "type", {
                get: function () {
                    return this.dm.metadataStore.getEntityType(this.model);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataSource.prototype, "pKey", {
                get: function () {
                    return _.find(this.type.dataProperties, function (p) {
                        return p.isPartOfKey;
                    });
                },
                enumerable: true,
                configurable: true
            });
            DataSource.prototype.findkey = function (id) {
                var _this = this;
                return _.find(this.data, function (d) {
                    return _.result(d, _this.pKey.name) === id;
                });
            };
            DataSource.prototype.find = function (field, value) {
                return _.find(this.data, function (d) {
                    return _.result(d, field) === value;
                });
            };
            DataSource.prototype.findall = function (field, value) {
                return _.filter(this.data, function (d) {
                    return _.result(d, field) === value;
                });
            };
            return DataSource;
        }());
        data_1.DataSource = DataSource;
    })(data = exports.data || (exports.data = {}));
    var bx;
    (function (bx) {
        var DataSource = (function (_super) {
            __extends(DataSource, _super);
            function DataSource(model) {
                _super.call(this, model);
            }
            Object.defineProperty(DataSource.prototype, "dm", {
                get: function () {
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
                },
                enumerable: true,
                configurable: true
            });
            DataSource.prototype.fetch_data = function (qry) {
                var _this = this;
                if (!datastore.Store.hasMetadataFor(this.model)) {
                    return this.fetch_metadata().then(function (args) {
                        return _this.fetch_dataEx(qry);
                    });
                }
                else {
                    this.dm.metadataStore.importMetadata(datastore.Store.exportMetadata());
                    return this.fetch_dataEx(qry);
                }
            };
            DataSource.prototype.fetch_dataEx = function (qry) {
                var _this = this;
                var d = Q.defer();
                var __qry = qry ? qry : new Backendless.DataQuery();
                if (!__qry.options) {
                    __qry.options = {};
                }
                //__qry.options['relationsDepth'] = 2;
                Backendless.Persistence.of(this.model).find(qry, new Backendless.Async(function (list) {
                    _.each(list.data, function (obj) {
                        _this.dm.createEntity(_this.model, obj, breeze.EntityState.Unchanged, breeze.MergeStrategy.OverwriteChanges);
                    });
                    var entities = _this.dm.getEntities(_this.model);
                    d.resolve(entities);
                }, function (err) {
                    d.reject(err);
                }));
                return d.promise;
            };
            DataSource.prototype.set_metadata = function (model, master, meta) {
                var src_props = _.filter(meta, function (p) {
                    return !(p.type === 'RELATION_LIST');
                });
                var src_navs = _.filter(meta, function (p) {
                    return (p.type === 'RELATION_LIST');
                });
                var dest_props = {};
                _.each(src_props, function (p) {
                    dest_props[p.name] = {
                        isPartOfKey: p.isPrimaryKey
                    };
                });
                var type = {
                    entityname: model,
                    master_key: master ? master.entityname + 'id' : null,
                    properties: dest_props,
                    relations: {}
                };
                return type;
            };
            DataSource.prototype.fetch_and_store_meta = function (model, master) {
                var _this = this;
                var d = Q.defer();
                Backendless.Persistence.describe(model, new Backendless.Async(function (src_props) {
                    var relations = _.filter(src_props, function (p) {
                        return p.type === 'RELATION_LIST';
                    });
                    var type = _this.set_metadata(model, master, src_props);
                    if (relations.length > 0) {
                        var array = _.map(relations, function (rel) {
                            return _this.fetch_and_store_meta(rel.name, type);
                        });
                        Q.all(array).then(function (children) {
                            _.each(children, function (child) {
                                type.relations[child.entityname] = child;
                            });
                            d.resolve(type);
                        });
                    }
                    else {
                        d.resolve(type);
                    }
                }, function (err) {
                    d.reject(err);
                }));
                return d.promise;
            };
            DataSource.prototype.fetch_metadata = function () {
                var _this = this;
                var d = Q.defer();
                this.fetch_and_store_meta(this.model, null).then(function (type) {
                    datastore.create_entity_def(type);
                    _this.dm.metadataStore.importMetadata(datastore.Store.exportMetadata());
                    d.resolve(true);
                }).fail(function (err) {
                    toastr.error(JSON.stringify(err));
                });
                return d.promise;
            };
            DataSource.prototype.delete = function (id) {
                var _this = this;
                var d = Q.defer();
                var tmp = new DataSource(this.model);
                var ent = this.findkey(id);
                ent.entityAspect.setDeleted();
                var __data = this.__unwrap([ent], this.dm.metadataStore.getEntityType(this.model));
                Backendless.Persistence.of(this.model).remove(__data[0], new Backendless.Async(function (succ) {
                    ent.entityAspect.acceptChanges();
                    _this.dm.importEntities(tmp.dm.exportEntities(), {
                        mergeStrategy: breeze.MergeStrategy.OverwriteChanges
                    });
                    d.resolve(true);
                }, function (err) {
                    d.reject(err);
                }));
                return d.promise;
            };
            DataSource.prototype.save = function (ent) {
                var d = Q.defer();
                var list = this.__unwrap([ent], this.dm.metadataStore.getEntityType(this.model));
                Backendless.Persistence.of(this.model).save(list[0], new Backendless.Async(function (succ) {
                    ent.entityAspect.acceptChanges();
                    d.resolve(true);
                }, function (err) {
                    d.reject(err);
                }));
                return d.promise;
            };
            DataSource.prototype.saveChanges = function () {
                var _this = this;
                var tmp = new DataSource(this.model);
                tmp.dm.importEntities(this.dm.exportEntities());
                var _data = tmp.unwrap();
                var d = Q.defer();
                Backendless.Persistence.of(this.model).save(_data[0], new Backendless.Async(function (succ) {
                    _this.dm['acceptChanges']();
                    d.resolve(true);
                }, function (err) {
                    d.reject(err);
                }));
                return d.promise;
            };
            DataSource.prototype.retrieve_added = function () {
                var entities = this.dm.getEntities(this.model);
                _.each(entities, function (ent) {
                    switch (ent.entityAspect.entityState) {
                        case breeze.EntityState.Added:
                            {
                            }
                            break;
                        case breeze.EntityState.Modified:
                            {
                            }
                            break;
                        case breeze.EntityState.Deleted:
                            {
                            }
                            break;
                    }
                });
            };
            DataSource.prototype.unwrap = function () {
                var data = this.dm.getEntities(this.model);
                var jsList = this.__unwrap(data, this.dm.metadataStore.getEntityType(this.model));
                return jsList;
                //return this.unwrap_type(this.dm.metadataStore.getEntityType(this.model) as any, data);
            };
            DataSource.prototype.__unwrap = function (data, type) {
                var _this = this;
                var array = [];
                _.each(data, function (obj) {
                    var __obj = ko['mapping'].toJS(obj);
                    __obj['___class'] = type.shortName;
                    delete __obj._$typeName;
                    delete __obj.entityAspect;
                    delete __obj.entityType;
                    if (obj.entityAspect.entityState.isAdded()) {
                        delete __obj.objectId;
                    }
                    var navs = _.filter(type.navigationProperties, function (nav) {
                        return !nav.isScalar;
                    });
                    var master_rel = _.find(type.navigationProperties, function (nav) {
                        return nav.isScalar;
                    });
                    if (master_rel) {
                        delete __obj[master_rel.name];
                    }
                    array.push(__obj);
                    _.each(navs, function (nav) {
                        var nav_type = _this.dm.metadataStore.getEntityType(nav.name);
                        var nav_data = __obj[nav.name];
                        __obj[nav.name] = _this.__unwrap(nav_data, nav_type);
                    });
                });
                return array;
            };
            DataSource.prototype.unwrap_type = function (type, data) {
                var _this = this;
                var rst = [];
                _.each(data, function (d) {
                    var json = {
                        __class: type.shortName
                    };
                    json = ko['mapping'].toJS(d);
                    _.each(type.dataProperties, function (p) {
                        json[p.name] = _.result(d, p.name);
                    });
                    _.each(type.navigationProperties, function (nav) {
                        if (!nav.isScalar) {
                            var nav_type = _this.dm.metadataStore.getEntityType(nav.entityType.name);
                            var nav_data = d[nav.name]();
                            var nav_json_array = _this.unwrap_type(nav_type, nav_data);
                            json[nav.name] = nav_json_array;
                        }
                    });
                    rst.push(json);
                });
                return rst;
            };
            return DataSource;
        }(data.DataSource));
        bx.DataSource = DataSource;
    })(bx = exports.bx || (exports.bx = {}));
    var dx;
    (function (dx) {
        var keyId = 'objectId';
        var DataSource = (function () {
            function DataSource(model) {
                this.__model = model;
            }
            Object.defineProperty(DataSource.prototype, "model", {
                get: function () {
                    return this.__model;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataSource.prototype, "items", {
                get: function () {
                    if (!this.__items) {
                        this.__items = [];
                    }
                    return this.__items;
                },
                enumerable: true,
                configurable: true
            });
            DataSource.prototype.findkey = function (id) {
                return _.find(this.items, function (obj) {
                    return _.result(obj, keyId) === id;
                });
            };
            DataSource.prototype.find = function (prop, val) {
                return _.find(this.items, function (obj) {
                    return _.result(obj, prop) === val;
                });
            };
            DataSource.prototype.fetch = function (where) {
                var __qry = new Backendless.DataQuery();
                __qry.condition = where;
                var d = Q.defer();
                var that = this;
                Backendless.Persistence.of(this.model).find(__qry, new Backendless.Async(function (rst) {
                    that.__items = _.map(rst.data, function (d) {
                        var __ko = ko['mapping'].fromJS(d);
                        var obj = ko['track'](__ko, { depp: true });
                        return obj;
                    });
                    d.resolve(that.__items);
                }, function (err) {
                    d.reject(err);
                }));
                return d.promise;
            };
            DataSource.prototype.save = function () {
                var _this = this;
                var all = Q.defer();
                var promises = _.map(this.items, function (obj) {
                    var __ko = ko['untrack'](obj);
                    __ko = ko['mapping'].toJS(__ko);
                    var d = Q.defer();
                    Backendless.Persistence.of(_this.model).save(__ko, new Backendless.Async(function (rst) {
                        d.resolve(true);
                    }, function (err) {
                        d.reject(err);
                    }));
                    return d.promise;
                });
                return Q.all(promises).then(function () {
                    return all.resolve(true);
                }).fail(function (err) {
                    return all.reject(err);
                });
            };
            DataSource.prototype.remove = function (obj, update) {
                var _this = this;
                var d = Q.defer();
                var __ko = ko['untrack'](obj);
                __ko = ko['mapping'].toJS(__ko);
                Backendless.Persistence.of(this.model).remove(__ko, new Backendless.Async(function (rst) {
                    if (update) {
                        var index = _this.items.indexOf(obj);
                        if (index >= 0) {
                            _this.__items = _this.__items.slice(index, 1);
                        }
                    }
                    d.resolve(true);
                }, function (err) {
                    d.reject(err);
                }));
                return d.promise;
            };
            return DataSource;
        }());
        dx.DataSource = DataSource;
    })(dx = exports.dx || (exports.dx = {}));
    var datastore;
    (function (datastore) {
        var _entities_cache = [];
        var DT = breeze.DataType;
        var defaultNameSpace = '';
        var Identity = breeze.AutoGeneratedKeyType.Identity;
        var Validator = breeze.Validator;
        var camelCaseConvention = breeze.NamingConvention.none;
        // Breeze Labs: breeze.metadata.helper.js
        var helper = new breeze.config['MetadataHelper']();
        // Helper convenience methods
        var addDataService = helper.addDataService.bind(helper);
        var addTypeToStore = helper.addTypeToStore.bind(helper);
        var setDefaultNamespace = helper.setDefaultNamespace.bind(helper);
        var dataNameSpace = 'StampDev';
        setDefaultNamespace(dataNameSpace);
        function __addEntityType(store, type) {
            var _type = _.extend(type, {
                namespace: dataNameSpace,
                shortName: type.defaultResourceName,
                autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
            });
            addTypeToStore(store, _type);
        }
        function __createDataStore(storeName) {
            var store = new breeze.MetadataStore({
                namingConvention: camelCaseConvention
            });
            addDataService(store, storeName);
            return store;
        }
        var dbSchema = [];
        function __regsiterSchema(srvName, store) {
            dbSchema.push({
                srvName: srvName,
                store: store
            });
        }
        datastore.Store = new breeze.MetadataStore({ namingConvention: camelCaseConvention });
        addDataService(datastore.Store, 'DataStore');
        function add_to_Store(type) {
            _entities_cache.push(type);
            var _type = _.extend(type, {
                namespace: dataNameSpace,
                shortName: type.defaultResourceName,
                autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
            });
            addDataService(datastore.Store, type.shortName);
            addTypeToStore(datastore.Store, _type);
        }
        datastore.add_to_Store = add_to_Store;
        function create_entity_def(source_def, master_src_def) {
            var target_ent = {
                defaultResourceName: source_def.entityname,
                dataProperties: {},
                navigationProperties: {}
            };
            _.each(Object.keys(source_def.properties), function (k) {
                var prop_def = source_def.properties[k];
                target_ent.dataProperties[k] = {
                    dataType: prop_def.type ? prop_def.type : DT.String,
                    nameOnServer: k,
                    isPartOfKey: prop_def['isPartOfKey']
                };
            });
            target_ent.dataProperties['created'] = { dataType: breeze.DataType.String };
            target_ent.dataProperties['updated'] = { dataType: breeze.DataType.String };
            var has_primary = _.find(Object.keys(target_ent.dataProperties), function (k) {
                return target_ent.dataProperties[k].isPartOfKey;
            });
            if (master_src_def) {
                target_ent.navigationProperties[master_src_def.entityname] = {
                    type: master_src_def.entityname,
                    assoc: 'association_{0}_{1}'.format(master_src_def.entityname, source_def.entityname),
                    foreignKeyNames: [source_def.master_key]
                };
            }
            var rel_count = Object.keys(source_def.relations).length;
            if (rel_count > 0) {
                _.each(Object.keys(source_def.relations), function (rel) {
                    target_ent.navigationProperties[rel] = {
                        entityTypeName: rel,
                        associationName: 'association_{0}_{1}'.format(target_ent.defaultResourceName, rel),
                        isScalar: false
                    };
                    if (!datastore.Store.getEntityType(target_ent.defaultResourceName, true)) {
                        add_to_Store(target_ent);
                    }
                    var rel_ent = source_def.relations[rel];
                    create_entity_def(rel_ent, source_def);
                });
            }
            else {
                add_to_Store(target_ent);
            }
        }
        datastore.create_entity_def = create_entity_def;
    })(datastore = exports.datastore || (exports.datastore = {}));
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/core/lib.js.map