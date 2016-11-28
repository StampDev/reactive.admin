/// <reference path="../core/jx__.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../core/lib'], function (require, exports, React, jx) {
    "use strict";
    var InsApp = (function (_super) {
        __extends(InsApp, _super);
        function InsApp() {
            _super.call(this);
        }
        InsApp.prototype.start_routing = function () {
            _super.prototype.start_routing.call(this);
        };
        InsApp.prototype.get_menus = function () {
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
                            header: React.createElement("span", null, React.createElement("i", {className: "fa fa-cubes"}), " Company chart"),
                            title: 'Chart', path: '/views/comp/comp_chart'
                        },
                        {
                            name: 'comp-account',
                            url: '/account',
                            header: React.createElement("span", null, React.createElement("i", {className: "fa fa-edit"}), " Account"),
                            title: 'Account', path: '/views/comp/comp_chart'
                        },
                        {
                            name: 'comp-dept',
                            url: '/employees/depts/:deptid',
                            hidden: true,
                            header: React.createElement("span", null, React.createElement("i", {className: "fa fa-cubes"}), " Company department"),
                            title: 'Department',
                            path: '/views/comp/emp_explorer'
                        },
                        {
                            name: 'comp-employees',
                            url: '/employees',
                            header: React.createElement("span", null, React.createElement("i", {className: "fa fa-user"}), " Employees"),
                            title: 'Employees', path: '/views/comp/emp_explorer',
                            alters: ['comp-dept', 'comp-employee']
                        },
                        {
                            name: 'comp-employee',
                            url: '/employees/employee/:empid',
                            hidden: true,
                            header: React.createElement("span", null, React.createElement("i", {className: "fa fa-user"}), " Employee"),
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
            ];
        };
        return InsApp;
    }(jx.app.Application));
    exports.InsApp = InsApp;
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/ins/ins_app.js.map