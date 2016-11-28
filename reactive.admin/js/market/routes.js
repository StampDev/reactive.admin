/// <reference path="../core/jx__.tsx" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.routes = {
        '/': {
            view: '/views/home/ins_home_page'
        },
        '/login': {
            view: '/views/home/ins_login'
        },
        '/admin': {
            view: '/views/admin/ins_admin'
        },
        '/inventory': {
            view: '/views/inventory/inventory_explorer'
        },
        '*': {
            view: '/views/404'
        }
    };
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/market/routes.js.map