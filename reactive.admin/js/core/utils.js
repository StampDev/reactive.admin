/// <reference path="../../typings/tsd.d.ts" />
String.prototype.format = function () {
    var d = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        d[_i - 0] = arguments[_i];
    }
    var args = (arguments.length === 1 && $.isArray(arguments[0])) ? arguments[0] : arguments;
    var formattedString = this;
    for (var i = 0; i < args.length; i++) {
        var pattern = new RegExp("\\{" + i + "\\}", "gm");
        formattedString = formattedString.replace(pattern, args[i]);
    }
    return formattedString;
};
_.mixin({
    guid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
});
var _srv_url = 'https://admin-web-srv.herokuapp.com/api';
//var _srv_url = 'http://localhost:1337/api';
var _img_url = 'http://localhost';
var utils;
(function (utils) {
    utils.key = 'objectId';
    utils.srv_url = _srv_url;
    utils.DBNULL = '___NULL___';
    function is_null_or_empty(val) {
        return val === null || val === undefined
            || !val || (0 === val.length);
    }
    utils.is_null_or_empty = is_null_or_empty;
    function exec(spin, call) {
        var d = Q.defer();
        spin.removeClass('hidden');
        d.promise.finally(function () {
            spin.addClass('hidden');
        });
        call(d);
        return d.promise;
    }
    utils.exec = exec;
    function resolve_rst(rst) {
        if ($.isArray(rst.results)) {
            var r = rst.results;
            if (r.length > 0) {
                return r[0];
            }
        }
    }
    utils.resolve_rst = resolve_rst;
    function guid() {
        return _.guid();
    }
    utils.guid = guid;
    function scrollToObj(target, offset, time) {
        $('html, body').animate({ scrollTop: $(target).offset().top - offset }, time);
    }
    utils.scrollToObj = scrollToObj;
    function jump_up() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }
    utils.jump_up = jump_up;
    utils.Path = {
        join: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var parts = [];
            for (var i = 0, l = arguments.length; i < l; i++) {
                parts = parts.concat(arguments[i].split("/"));
            }
            // Interpret the path commands to get the new resolved path.
            var newParts = [];
            for (i = 0, l = parts.length; i < l; i++) {
                var part = parts[i];
                // Remove leading and trailing slashes
                // Also remove "." segments
                if (!part || part === ".")
                    continue;
                // Interpret ".." to pop the last segment
                if (part === "..")
                    newParts.pop();
                else
                    newParts.push(part);
            }
            // Preserve the initial slash if there was one.
            if (parts[0] === "")
                newParts.unshift("");
            // Turn back into a single string path.
            return newParts.join("/") || (newParts.length ? "/" : ".");
        }
    };
    function ask_question(question, extra) {
        var d = Q.defer();
        swal({
            title: question,
            text: extra,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ok",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true,
            animation: false,
        }, function (confirmed) {
            if (confirmed) {
                d.resolve(true);
            }
            else {
                d.reject(false);
            }
        });
        return d.promise;
    }
    utils.ask_question = ask_question;
    function can_delete() {
        var d = Q.defer();
        swal({
            title: "Do you really want to delete this item?",
            text: "This change cannot be reverted",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ok",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true,
            animation: false,
        }, function (confirmed) {
            if (confirmed) {
                d.resolve(true);
            }
            else {
                d.reject(false);
            }
        });
        return d.promise;
    }
    utils.can_delete = can_delete;
    function can_looseChanges(opts) {
        var d = Q.defer();
        var __data = _.extend({
            title: 'Do you really want to leave this page?',
            text: "Changes made will be lost"
        }, opts);
        swal({
            title: __data.title,
            text: __data.text,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            closeOnConfirm: true,
            closeOnCancel: true,
            animation: false,
        }, function (confirmed) {
            if (confirmed) {
                d.resolve(true);
            }
            else {
                d.reject(false);
            }
        });
        return d.promise;
    }
    utils.can_looseChanges = can_looseChanges;
    function spin(el) {
        $(el).waitMe({
            effect: 'rotation'
        });
    }
    utils.spin = spin;
    function unspin(el) {
        $(el).waitMe('hide');
    }
    utils.unspin = unspin;
    function query(model, where) {
        var d = Q.defer();
        var model_obj = Backendless.Persistence.of(model);
        if (where) {
            var qry = new Backendless.DataQuery();
            qry.condition = where;
            model_obj.find(qry, new Backendless.Async(function (res) {
                d.resolve(res.data);
            }, function (err) {
                d.reject(err);
            }));
        }
        return d.promise;
    }
    utils.query = query;
    function flatten(ob) {
        var toReturn = {};
        for (var i in ob) {
            if (!ob.hasOwnProperty(i))
                continue;
            if ((typeof ob[i]) == 'object') {
                var flatObject = flatten(ob[i]);
                for (var x in flatObject) {
                    if (!flatObject.hasOwnProperty(x))
                        continue;
                    toReturn[i + '.' + x] = flatObject[x];
                }
            }
            else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    }
    function find_key(prop, obj) {
        var _flatten = flatten(obj);
        var key = _.find(Object.keys(_flatten), function (k) {
            return k.indexOf(prop) >= 0;
        });
        return _flatten[key];
    }
    utils.find_key = find_key;
    function deepCopy(arr) {
        return deepcopy(arr);
    }
    utils.deepCopy = deepCopy;
})(utils || (utils = {}));
var node;
(function (node) {
    function call(params) {
        var d = Q.defer();
        params.domain = 'file-upload';
        $.ajax(utils.srv_url, {
            type: 'POST',
            data: params,
            crossDomain: true,
            "dataType": "json",
            "cache": false,
            success: function (res) {
                d.resolve(res);
            },
            error: function (err) {
                d.reject(err);
            }
        });
        return d.promise;
    }
    node.call = call;
})(node || (node = {}));
var schema;
(function (schema) {
    function call(params) {
        var d = Q.defer();
        params['domain'] = 'schema';
        $.ajax(utils.srv_url, {
            type: 'POST',
            data: params,
            crossDomain: true,
            "dataType": "json",
            "cache": false,
            success: function (res) {
                if (res && res.response) {
                    if (typeof res.response === 'string') {
                        res.response = JSON.parse(res.response);
                    }
                }
                d.resolve(res);
            },
            error: function (err) {
                d.reject(err);
            }
        });
        return d.promise;
    }
    schema.call = call;
    function get(model, params) {
        return call({
            fn: 'get',
            params: ['/{0}'.format(model)].concat(params ? [params] : [])
        }).then(function (res) {
            if (res.response.results) {
                return res.response.results;
            }
            return res.response;
        });
    }
    schema.get = get;
})(schema || (schema = {}));
var aws;
(function (aws) {
    function call(params) {
        var d = Q.defer();
        params.domain = 'aws';
        $.ajax(utils.srv_url, {
            type: 'POST',
            data: params,
            crossDomain: true,
            "dataType": "json",
            "cache": false,
            success: function (res) {
                d.resolve(res);
            },
            error: function (err) {
                d.reject(err);
            }
        });
        return d.promise;
    }
    aws.call = call;
    function retrieve_pict(item) {
        var img_tags = ['LargeImage', 'MediumImage', 'SmallImage', 'SwatchImage', 'TinyImage'];
        var target_obj = item;
        if (item.ImageSets) {
            target_obj = item.ImageSets[0].ImageSet[0];
        }
        var index = 0;
        var loop = true;
        var img_url = '';
        while (loop) {
            var img_tag = img_tags[index];
            if (target_obj[img_tag]) {
                img_url = target_obj[img_tag][0].URL[0];
                loop = false;
            }
            index++;
            if (loop) {
                loop = index < img_tags.length;
            }
        }
        return img_url;
    }
    aws.retrieve_pict = retrieve_pict;
    function retrieve_price(item) {
        var value = undefined;
        if ($.isArray(item['Offers'])) {
            _.each(item['Offers'], function (off) {
                var val = utils.find_key('FormattedPrice', off);
                if (val && !value) {
                    value = val;
                }
            });
        }
        if (!value) {
            value = utils.find_key('FormattedPrice', item);
        }
        if (value) {
            var values = value.split(" ");
            if ($.isArray(values)) {
                if (values.length > 1) {
                    return values[1];
                }
                return values[0];
            }
            else {
                return value;
            }
        }
    }
    aws.retrieve_price = retrieve_price;
})(aws || (aws = {}));
var lang;
(function (lang) {
    function localize(root) {
        var el = root ? $(root) : $('[data-localize]');
        el['localize']('lang', {
            language: 'fr',
            pathPrefix: "/lang",
            callback: function (data, defaultCallback) {
                defaultCallback(data);
                //app.data_lang = data;
                //if (outer_callback) {
                //    outer_callback();
                //}
            }
        });
    }
    lang.localize = localize;
})(lang || (lang = {}));
var carts;
(function (carts) {
    function add_li(cart_id, prod, cart_item) {
        var url_img = null;
        if (prod.images && prod.images.length > 0) {
            url_img = prod.images[0].file.url;
        }
        var price = cart_item.price; // numeral(cart_item.price).format('€0,0.00');        
        var qty = cart_item.quantity;
        var html = "\n             <li>\n                <a href=\"/account/product/0-1\">\n                    <div class=\"media\">\n                        <img class=\"media-left media-object\" src=\"{0}\" alt=\"cart-Image\" style=\"width:20%\" />\n                        <div class=\"media-body\">\n                            <h5 class=\"media-heading\">{1}<br><span>{2} X \u20AC{3}</span></h5>\n                        </div>\n                    </div>\n                </a>\n            </li>\n            ".format(url_img, prod.name, qty, price); //; , cart_item['id'], cart_id
        return html.trim();
    }
    function add_actions() {
        //account/carts
        //account/checkout
        var html = "<li>\n                <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n                    <button type=\"button\" class=\"btn btn-default btn-cart\">Shopping Cart</button>\n                    <button type=\"button\" class=\"btn btn-default btn-checkout\">Checkout</button>\n                </div>\n             </li>\n            ";
        return html.trim();
    }
    function fetch_account(__email) {
        return schema.call({
            fn: 'get',
            params: ['/accounts', { email: __email }]
        }).then(function (res) {
            return res.response.results[0];
        });
    }
    function fetch_items_of_carts(__carts) {
        var d = Q.defer();
        var item_ids = [];
        var items = [];
        _.each(__carts, function (cart) {
            _.each(cart.items, function (item) {
                items.push(item);
                item_ids.push(item.product_id);
            });
        });
        if (item_ids.length === 0) {
            item_ids.push(utils.guid());
        }
        schema.call({
            fn: 'get',
            params: ['/products', { 'id': { $in: item_ids } }]
        }).then(function (res) {
            var products = [];
            if (res.response && res.response.results) {
                products = res.response.results;
            }
            d.resolve({
                prods: products,
                items: items
            });
        }).fail(function (err) {
            d.reject(false);
        });
        return d.promise;
    }
    function init_actions(ul) {
        ul.find('.btn-checkout').click(function (e) {
            page('/account/checkout');
        });
        ul.find('.btn-cart').click(function (e) {
            page('/account/cart');
        });
    }
    function update_cart(email) {
        var d = Q.defer();
        fetch_account(email).then(function (acc) {
            schema.call({
                fn: 'get',
                params: ['/carts', {
                        where: {
                            account_id: acc['id'],
                            status: 'active'
                        }
                    }]
            }).then(function (res) {
                var cart_id = utils.guid();
                var cart = res.response.results[0];
                if (res.response.results.length > 0) {
                    cart_id = res.response.results[0]['id'];
                }
                fetch_items_of_carts(res.response.results).then(function (data) {
                    var ul = $('.products-cart ul');
                    var must_empty = ul.find('.media').length > 0;
                    if (must_empty) {
                        ul.empty();
                        ul.append($('<li>Item(s) in your cart</li>'));
                    }
                    _.each(data.prods, function (prod) {
                        var cart_item = _.find(data.items, function (itm) {
                            return itm.product_id === prod.id;
                        });
                        ul.append(add_li(cart_id, prod, cart_item));
                    });
                    if (cart) {
                        $('.products-cart .cart-total').html('€{0}'.format(cart['grand_total']));
                    }
                    if (data.prods.length > 0) {
                        ul.append(add_actions());
                        init_actions(ul);
                    }
                    $('.products-cart').removeClass('hidden');
                    d.resolve(data.items);
                });
            });
        });
        return d.promise;
    }
    carts.update_cart = update_cart;
    function display_cart() {
        var account = cookies.get('account');
        if (!account) {
        }
        else {
            update_cart(account['email']).then(function (list) {
                if (list && list.length > 0) {
                    $('.products-cart').removeClass('hidden');
                }
            });
        }
    }
    carts.display_cart = display_cart;
    function flyToElement(flyer, flyingTo, callback) {
        var $func = $(this);
        var divider = 3;
        var flyerClone = $(flyer).clone();
        $(flyerClone).css({ position: 'absolute', top: $(flyer).offset().top + "px", left: $(flyer).offset().left + "px", opacity: 1, 'z-index': 1000 });
        $('body').append($(flyerClone));
        var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width() / divider) / 2;
        var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - ($(flyer).height() / divider) / 2;
        $(flyerClone).animate({
            opacity: 0.4,
            left: gotoX,
            top: gotoY,
            width: $(flyer).width() / divider,
            height: $(flyer).height() / divider
        }, 700, function () {
            $(flyingTo).fadeOut('fast', function () {
                $(flyingTo).fadeIn('fast', function () {
                    $(flyerClone).fadeOut('fast', function () {
                        $(flyerClone).remove();
                        if (callback) {
                            callback();
                        }
                    });
                });
            });
        });
    }
    carts.flyToElement = flyToElement;
})(carts || (carts = {}));
var cookies;
(function (cookies) {
    function set(name, obj) {
        Cookies.set(name, obj, { expires: 30 });
    }
    cookies.set = set;
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
        var obj = Cookies.get(name);
        if (obj) {
            if (isJson(obj)) {
                obj = JSON.parse(obj);
            }
        }
        return obj;
    }
    cookies.get = get;
    function remove(name) {
        return Cookies.remove(name);
    }
    cookies.remove = remove;
})(cookies || (cookies = {}));
var iCheck;
(function (iCheck) {
    function icheck(params) {
        params.$el['iCheck']({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio'
        });
        params.$el.off('ifChecked');
        params.$el.on('ifChecked', function (e) {
            if (params.onChecked) {
                params.onChecked(e);
            }
        });
        params.$el.off('ifUnchecked');
        params.$el.on('ifUnchecked', function (e) {
            if (params.onUnchecked) {
                params.onUnchecked(e);
            }
        });
    }
    iCheck.icheck = icheck;
})(iCheck || (iCheck = {}));
var Test = (function () {
    function Test() {
    }
    Test.prototype.testMethod = function () {
    };
    Test.prototype.method2 = function () {
    };
    return Test;
}());
var bx;
(function (bx) {
    function fetch(model, qry) {
        var d = Q.defer();
        Backendless.Persistence.of(model).find(qry, new Backendless.Async(function (rst) {
            d.resolve(rst['data']);
        }, function (err) {
            d.reject(err);
        }));
        return d.promise;
    }
    bx.fetch = fetch;
    function fetchKey(model, key) {
        return fetch(model, {
            condition: "objectId='{0}'".format(key)
        }).then(function (data) {
            return data.length > 0 ? data[0] : null;
        }).fail(function (err) {
            return err;
        });
    }
    bx.fetchKey = fetchKey;
    function save(model, obj) {
        var d = Q.defer();
        obj['___class'] = model;
        Backendless.Persistence.of(model).save(obj, new Backendless.Async(function (rst) {
            d.resolve(obj);
        }, function (err) {
            d.reject(err);
        }));
        return d.promise;
    }
    bx.save = save;
})(bx || (bx = {}));
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/core/utils.js.map