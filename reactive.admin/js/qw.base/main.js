/// <reference path="../qw.smrt/app/smrtapp.tsx" />
/// <reference path="../qw.ins/app/insapp.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
define(["require", "exports", '../qw.smrt/app/smrtapp', '../qw.ins/app/insapp'], function (require, exports, smrt, ins) {
    "use strict";
    if (window['app_name'] === 'smrt') {
        var app_smrt = new smrt.SmartApp();
        app_smrt.Start();
    }
    if (window['app_name'] === 'ins') {
        var app_ins = new ins.InsApp();
        app_ins.Start();
    }
});
//# sourceMappingURL=C:/afriknet/reactive.admin.bkl/reactive.admin/js/qw.base/main.js.map