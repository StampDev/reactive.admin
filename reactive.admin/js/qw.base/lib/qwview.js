/// <reference path="qwlib.tsx" />
/// <reference path="qwapp.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', 'react-bootstrap', './qwlib'], function (require, exports, React, ReactDOM, rb, lib) {
    "use strict";
    var b = rb;
    var viewcount = 1;
    var Constants;
    (function (Constants) {
        Constants.HasMounted = 'HasMounted';
        Constants.HasUpdated = 'HasUpdated';
    })(Constants = exports.Constants || (exports.Constants = {}));
    var QwView = (function (_super) {
        __extends(QwView, _super);
        function QwView(props) {
            var _this = this;
            _super.call(this, props);
            this.notify_handler = lib.pubsub.subscribe(this.viewid, function (msg, data) {
                _this.activeEvent = data;
                _this.on_notify().then(function (args) {
                    if (_this.activeEvent.done) {
                        _this.activeEvent.done(args);
                    }
                }).fail(function (err) {
                    toastr.error(JSON.stringify(err), 'Notify failed');
                });
            });
            this.get_view_handler = lib.pubsub.subscribe('get-' + this.viewid, function (msg, data) {
                var callback = data;
                callback(_this);
            });
            this.broadcast_handler = lib.pubsub.subscribe(lib.pubsub.BROADCAST, function (msg, data) {
                _this.activeEvent = data;
                _this.on_notify();
            });
        }
        Object.defineProperty(QwView.prototype, "app", {
            get: function () {
                return window['quickwave-app'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QwView.prototype, "root", {
            get: function () {
                return $(ReactDOM.findDOMNode(this));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QwView.prototype, "viewid", {
            get: function () {
                if (!this._viewid) {
                    this._viewid = 'view-' + viewcount++;
                }
                return this._viewid;
            },
            enumerable: true,
            configurable: true
        });
        QwView.prototype.componentWillReceiveProps = function (next) {
        };
        QwView.prototype.componentWillMount = function () {
        };
        QwView.prototype.componentDidMount = function () {
            this.notify({
                name: Constants.HasMounted
            });
        };
        QwView.prototype.componentDidUpdate = function () {
            this.notify({
                name: Constants.HasUpdated
            });
        };
        QwView.prototype.componentWillUnmount = function () {
            PubSub.unsubscribe(this.broadcast_handler);
            PubSub.unsubscribe(this.notify_handler);
            PubSub.unsubscribe(this.get_view_handler);
        };
        QwView.prototype.componentWillUpdate = function () {
        };
        QwView.prototype.get_uiSchema = function () {
            return {};
        };
        QwView.prototype.newState = function (state, done) {
            this.setState(_.extend(this.state, state), function () {
                if (done) {
                    done();
                }
            });
        };
        QwView.prototype.on_notify = function () {
            return Q.resolve(true);
        };
        QwView.prototype.notify = function (event) {
            lib.pubsub.publish(this.viewid, event);
        };
        QwView.prototype.accessView = function (viewid, callback) {
            return PubSub.publishSync('get-' + viewid, callback);
        };
        QwView.prototype.broadcast = function (event) {
            lib.pubsub.publish(lib.pubsub.BROADCAST, event);
        };
        return QwView;
    }(React.Component));
    exports.QwView = QwView;
    var TestView = (function (_super) {
        __extends(TestView, _super);
        function TestView() {
            _super.apply(this, arguments);
        }
        return TestView;
    }(QwView));
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/qw.base/lib/qwview.js.map