// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
define(["require", "exports"], function (require, exports) {
    "use strict";
    var pubsub;
    (function (pubsub) {
        pubsub.BROADCAST = 'BROADCAST';
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
});
//# sourceMappingURL=C:/Developper/reactive.admin.bkl/reactive.admin/js/qw.base/lib/qwlib.js.map