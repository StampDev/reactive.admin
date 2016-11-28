/// <reference path="../core/jx__.tsx" />

// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');

import jx = require('../core/lib');


export class InsApp extends jx.app.Application {

    constructor() {
        super();        
    }


    start_routing() {        
        super.start_routing();
    }


    get_menus(): jx.core_types.AppMenu[] {

        return [

            {
                name: 'home',
                url: '/',
                icon: 'fa fa-home',
                header: 'Welcome to Stamp',
                title: 'Home',
                path: '/views/home/ins_home_page'
            },

            {
                name: 'login',
                url: '/login',
                hidden: true,
                path: '/views/home/ins_login'
            },
            {
                name: 'signup',
                url: '/register',
                hidden: true,
                path: '/views/home/ins_register'
            },

            {
                name: 'comp',
                icon: 'fa fa-th-large',
                url: '/company', title: 'Company',
                header: 'My company',
                path: '/views/comp/comp_explorer',

                submenus: [
                
                    {
                        name: 'comp-chart',
                        url: '/chart',
                        header: <span><i className="fa fa-cubes"></i> Company chart</span>,
                        title: 'Chart', path: '/views/comp/comp_chart'
                    },

                    {
                        name: 'comp-account',
                        url: '/account',
                        header: <span><i className="fa fa-edit"></i> Account</span>,
                        title: 'Account', path: '/views/comp/comp_chart'
                    },

                    {
                        name: 'comp-dept',
                        url: '/employees/depts/:deptid',
                        hidden: true,                        
                        header: <span><i className="fa fa-cubes"></i> Company department</span>,
                        title: 'Department',
                        path: '/views/comp/emp_explorer'
                    },

                    {
                        name: 'comp-employees',
                        url: '/employees',
                        header: <span><i className="fa fa-user"></i> Employees</span>,
                        title: 'Employees', path: '/views/comp/emp_explorer',
                        alters: ['comp-dept','comp-employee']
                    },

                    {
                        name: 'comp-employee',
                        url: '/employees/employee/:empid',
                        hidden: true,
                        header: <span><i className="fa fa-user"></i> Employee</span>,
                        title: 'Employees', path: '/views/comp/emp_view'                        
                    },
                ]
            },

            {
                name: 'profiles',
                icon: 'fa fa-edit',
                url: '/profiles',
                title: 'Profiles',
                path: '/views/profiles/profiles_explorer'
            },
            
        ]
    }    
}


interface AppMenu {
    name: string,
    url: string,
    title: string,
    path: string,
    hidden: boolean,
    submenus: AppMenu[]
}