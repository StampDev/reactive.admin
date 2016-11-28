/// <reference path="../qw.smrt/app/smrtapp.tsx" />
/// <reference path="../qw.ins/app/insapp.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import smrt = require('../qw.smrt/app/smrtapp');
import ins = require('../qw.ins/app/insapp');

if (window['app_name'] === 'smrt') {
    var app_smrt = new smrt.SmartApp();
    app_smrt.Start();
}

if (window['app_name'] === 'ins') {
    var app_ins = new ins.InsApp();
    app_ins.Start();
}

