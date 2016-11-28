// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import jx = require('../../../core/lib');

export class Depts extends jx.data.DataSource {

    constructor() {
        super('compdept');
    }


    get_parent(id: string) {

        var target = this.findkey(id);

        if (!target) {
            return null;
        }

        return this.findkey(_.result(target, 'deptparentid'));
    }


    get_children(id: string) {
        return this.findall('deptparentid', id);
    }


}