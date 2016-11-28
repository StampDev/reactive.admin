

import jx = require('../core/lib')



export var routes: jx.core_types.route_list = {

    '/': {        
        view:'/views/home/ins_home_page'
    },

    '/login': {
        view :'/views/home/ins_login'
    },

    '/register': {
        view :'/views/home/ins_register'
    },

    '/admin': {
        view: '/views/admin/ins_admin'
    },

    '/test/explorer': {
        view: '/views/admin/ins_admin'
    },

    '/profiles': {
        view: '/views/profiles/profiles_explorer'
    },


    '/profiles/new': {
        view: '/views/profiles/profiles_new'
    },


    '/employees': {
        view: '/views/emps/emps_explorer'
    },

    '/mycompany': {
        view: '/views/comp/comp_explorer'
    },
    
}