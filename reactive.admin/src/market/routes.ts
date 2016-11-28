/// <reference path="../core/jx__.tsx" />

import jx = require('../core/lib')



export var routes: jx.core_types.route_list = {

    '/': {        
        view:'/views/home/ins_home_page'
    },

    '/login': {
        view :'/views/home/ins_login'
    },

    '/admin': {
        view: '/views/admin/ins_admin'
    },


    '/inventory': {
        view: '/views/inventory/inventory_explorer'
    },

    '*': {
        view:'/views/404'
    }
}