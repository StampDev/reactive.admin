// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

export interface ApiModule {
    ApiTitle: string,
    ApiID: string,
    ApiEntry: string // main view path
}

enum Datatype { string, bool, int, date, datetime}



interface DataProperty {
    name: string,
    type: Datatype,
    display?: string,        
    visible?: boolean,
    unique?: boolean,
    ui?: {
        row: number
    }
}



var prop: DataProperty = {
    name: 'code',
    type: Datatype.string,    
}



var ProductModule = {
    title: 'Products',
    table: 'item',
    properties: {
        'id': { primary: true },
        'code': {
            type:'string',
            display: 'code',
            visible: true,
            required: true,
            unique: true,
            row: 1,
            ui: {

            }
        },
        active: {
            type:''
        }
    }
}