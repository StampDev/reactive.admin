/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/underscore/underscore.d.ts" />
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
define(["require", "exports", 'react', 'react-dom'], function (require, exports, React, ReactDOM) {
    "use strict";
    var __settings;
    var __routes;
    var __app;
    var __instance_dir = '../ins';
    breeze.core['config'].initializeAdapterInstance("uriBuilder", "json");
    var ajaxAdapter = breeze.config.getAdapterInstance('ajax');
    ajaxAdapter.defaultSettings = {
        cache: false
    };
    var constants;
    (function (constants) {
        var router;
        (function (router) {
            router.current_route = 'current_route';
        })(router = constants.router || (constants.router = {}));
        var events;
        (function (events) {
            events.view_initialized = 'view_initialized';
        })(events = constants.events || (constants.events = {}));
    })(constants = exports.constants || (exports.constants = {}));
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
            Q.all([
                load_config(),
                load_routes()
            ]).then(function () {
                Backendless.initApp('5F76BFFF-B6EE-F6AB-FFE2-5051554CA500', '06A5D87B-83D9-0A58-FF6A-11ABA901C100', 'v1');
                load_application().fail(function () {
                    __app = new app.Application();
                }).finally(function () {
                    __app.start_routing();
                });
            });
        }
        system.start = start;
    })(system = exports.system || (exports.system = {}));
    var app;
    (function (app_1) {
        var router = (function () {
            function router(app) {
                this.app = app;
            }
            router.prototype.start_routing = function () {
                var keys = Object.keys(__routes);
                _.each(keys, function (key) {
                    var route = __routes[key];
                    page(key, function (ctx) {
                        storage.set(constants.router.current_route, {
                            params: ctx.params,
                            path: ctx.path
                        });
                        var _key = _.find(Object.keys(__routes), function (_i) {
                            return _i === ctx.path;
                        });
                        var path = '';
                        if (!_key) {
                            path = __instance_dir + '/views/page404';
                        }
                        else {
                            path = __instance_dir + __routes[_key].view;
                        }
                        require([path], function (obj) {
                            var view = obj[Object.keys(obj)[0]];
                            ReactDOM.unmountComponentAtNode($(__settings.page_root)[0]);
                            ReactDOM.render(React.createElement(view), $(__settings.page_root)[0]);
                        });
                    });
                });
                page.start();
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
            return Application;
        }());
        app_1.Application = Application;
    })(app = exports.app || (exports.app = {}));
    var pubsub;
    (function (pubsub) {
        function subscribe(topic, callback) {
            return PubSub.subscribe(topic, callback);
        }
        pubsub.subscribe = subscribe;
        function publish(topic, data) {
            PubSub.publish(topic, data);
        }
        pubsub.publish = publish;
    })(pubsub = exports.pubsub || (exports.pubsub = {}));
    var views;
    (function (views) {
        var viewcount = 1;
        var ReactView = (function (_super) {
            __extends(ReactView, _super);
            function ReactView(props) {
                _super.call(this, props);
                this.state = {};
            }
            Object.defineProperty(ReactView.prototype, "root", {
                get: function () {
                    return $(ReactDOM.findDOMNode(this));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ReactView.prototype, "app", {
                get: function () {
                    return __app;
                },
                enumerable: true,
                configurable: true
            });
            ReactView.prototype.componentDidMount = function () {
            };
            return ReactView;
        }(React.Component));
        views.ReactView = ReactView;
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
        var ReactiveView = (function (_super) {
            __extends(ReactiveView, _super);
            function ReactiveView(props) {
                var _this = this;
                _super.call(this, props);
                pubsub.subscribe(this.viewid, function (msg, data) {
                    _this.on_broadcast_received(data);
                });
            }
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
                this.broadcast({
                    action: constants.events.view_initialized,
                });
            };
            ReactiveView.prototype.broadcast = function (event) {
                this.publish(this.viewid, event);
            };
            ReactiveView.prototype.can_broadcast = function (new_event) {
                return Q.resolve(true);
            };
            ReactiveView.prototype.on_broadcast_received = function (new_event) {
                var _this = this;
                this.can_broadcast(new_event).then(function () {
                    _this.previous_event = _this.current_event;
                    _this.current_event = new_event;
                    _this.on_broadcast().then(function (args) {
                        if (_this.current_event.done) {
                            _this.current_event.done(args);
                        }
                    });
                });
            };
            ReactiveView.prototype.publish = function (target, event) {
                pubsub.publish(target, event);
            };
            ReactiveView.prototype.on_broadcast = function () {
                return Q.resolve(true);
            };
            return ReactiveView;
        }(ReactView));
        views.ReactiveView = ReactiveView;
    })(views = exports.views || (exports.views = {}));
    var storage;
    (function (storage) {
        var local = $['localStorage'];
        function set(name, obj) {
            local.set(name, obj);
        }
        storage.set = set;
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
        storage.get = get;
        function remove(name) {
            return local.remove(name);
        }
        storage.remove = remove;
    })(storage = exports.storage || (exports.storage = {}));
    var backend;
    (function (backend) {
        var srv_url = 'https://umarket-node.herokuapp.com/api';
        var less;
        (function (less) {
            function fetch() {
            }
            less.fetch = fetch;
        })(less = backend.less || (backend.less = {}));
    })(backend = exports.backend || (exports.backend = {}));
    var data;
    (function (data) {
        var DataSource = (function () {
            function DataSource(model) {
                this.model = model;
            }
            DataSource.prototype.fetch_data = function (query) {
                var _this = this;
                var d = Q.defer();
                var __qry = _.extend({
                    from: this.model
                }, query);
                var qry = breeze.EntityQuery.from('data').withParameters({
                    $method: 'POST',
                    $encoding: 'JSONP',
                    $data: __qry
                });
                this.dm.executeQuery(qry).then(function (rst) {
                    if (rst.results && rst.results.length > 0) {
                        var str_data = rst.results[0].payload;
                        _this.dm.importEntities(str_data, {
                            mergeStrategy: query.merge ? query.merge : breeze.MergeStrategy.OverwriteChanges
                        });
                    }
                    d.resolve(true);
                }).catch(function (err) {
                    toastr.error(JSON.stringify(err));
                    d.reject(false);
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
            return DataSource;
        }());
        data.DataSource = DataSource;
    })(data = exports.data || (exports.data = {}));
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
            }
            return BindableControl;
        }(views.ReactiveView));
        controls.BindableControl = BindableControl;
        var Textarea = (function (_super) {
            __extends(Textarea, _super);
            function Textarea() {
                _super.apply(this, arguments);
            }
            Textarea.prototype.render = function () {
                var html = React.createElement("textarea", __assign({}, this.props.attrs, {className: "form-control"}));
                return html;
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
                if (this.props.ctx && this.props.property) {
                    this.state.value = _.result(this.props.ctx, this.props.property);
                }
            };
            TextNumeric.prototype.render = function () {
                if (this.props.readonly) {
                    return React.createElement("span", {className: "ctrl-numeric", style: { fontSize: 24 }}, this.state.value);
                }
                return React.createElement("input", {type: "text", className: "form-control ctrl-numeric input-lg", defaultValue: this.state.value, style: { fontSize: 24 }});
            };
            TextNumeric.prototype.componentDidMount = function () {
                _super.prototype.componentDidMount.call(this);
                this.init_numeric();
            };
            TextNumeric.prototype.componentDidUpdate = function () {
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
                var html = React.createElement("input", __assign({type: "text"}, this.props.attrs, {className: "form-control", placeholder: this.props.placeholder, onChange: this.onchange.bind(this), defaultValue: default_value}));
                return html;
            };
            TextInput.prototype.onchange = function () {
                if (this.state.item && this.props.property) {
                    var val = this.root.val();
                    if ($.isFunction(this.state.item[this.props.property])) {
                        this.state.item[this.props.property](val);
                    }
                    else {
                        this.state.item[this.props.property] = val;
                    }
                }
            };
            return TextInput;
        }(BindableControl));
        controls.TextInput = TextInput;
        var SummerNote = (function (_super) {
            __extends(SummerNote, _super);
            function SummerNote(props) {
                _super.call(this, props);
                this.state.item = this.props.entity;
            }
            SummerNote.prototype.render = function () {
                var html = React.createElement("div", {className: "summernote"}, _.result(this.state.item, this.props.property));
                return html;
            };
            SummerNote.prototype.on_broadcast = function () {
                var that = this;
                switch (this.current_event.action) {
                    case constants.events.view_initialized:
                        {
                            this.root['summernote']({
                                toolbar: [
                                    ['fontsize', ['fontsize']],
                                    ['style', ['bold', 'italic', 'underline', 'clear']],
                                    ['color', ['color']]
                                ],
                                minHeight: 200,
                                oninit: function () {
                                    that.root.parent().find('.note-editable').css('min-height', '150px');
                                    that.root.parent().find('.note-editable').css('border', 'lightgray 1px solid');
                                    that.root.parent().find('.note-editor').css({ 'min-height': 'inherit', 'margin-bottom': '30px' });
                                    that.root.parent().find('.control-label').css('text-align', 'left');
                                },
                                onKeyup: function (e) {
                                    if (e) {
                                    }
                                    //$("#product_desc_l").html($(this).code());
                                }
                            });
                        }
                        break;
                }
                return Q.resolve(true);
            };
            return SummerNote;
        }(BindableControl));
        controls.SummerNote = SummerNote;
    })(controls = exports.controls || (exports.controls = {}));
});
//# sourceMappingURL=C:/Developper/reactive.admin/reactive.admin/js/core/jx.js.map