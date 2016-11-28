/// <reference path="../../../core/lib.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX


import React = require('react');
import ReactDOM = require('react-dom');
import rb = require('react-bootstrap');
var b: any = rb;
import jx = require("../../../core/lib");
declare var chance;



interface EmpsDatalistState extends jx.forms.ui.DataListState {
}
export interface EmpsDatalistProps extends jx.forms.ui.DataListProps {
}
export class EmpsDatalist extends jx.forms.ui.DataList {

    props: EmpsDatalistProps;
    state: EmpsDatalistState;


    constructor(props: EmpsDatalistProps) {
        super(props);
        this.props.owner['__datalist'] = this;
    }


    render() {

        if (this.state.loading) {
            return super.render();
        }

        var content = null;

        if (this.state.data.length > 0) {

            content = super.render();
            
        } else {

            content =
                <div className="alert alert-info">
                    <h3 className="m-l-xs">No employee has been added yet</h3>
                    <p>Press "add employees" and invite your employees to join Stamp</p>
                </div>;             
        }

        var html = 
            <div style={{ minHeight: 650 }}>
                {content}
            </div>; 

        return html;
        
    }


    get tbl_settings(): DataTables.Settings {
        return this.get_table_settings();
    }


    private get_table_settings(): DataTables.Settings {

        var setts: DataTables.Settings = {
            columns: [
                {
                    title: '', data: null
                },
                { title: '', data: 'USRRNAME' },
                { title: '', data: 'USRRSURNAME' }
            ]
        }

        return setts;

    }

    createdCell(cell: Node, cellData: any, rowData: any, row: number, col: number) {

        if (col === 1) { // image column
            
            var src = '/ins/img/a{0}.jpg'.format(chance.integer({ min: 1, max: 8 }));
            ReactDOM.render(<img src={src} className="img-md img-circle"  />, $(cell)[0]);            
        }

        if (col >= 2 && col <= 3) {

            $(cell).empty();

            $(cell).append($('<p>{0}</p>'.format(cellData)));

            $(cell).addClass('tr-fontsize');
        }        
    }
    
    
    load_data(): Q.Promise<any> {

        var d = Q.defer();

        this.ds.fetch_data({
            where: {
                'COMPID': { eq: this.app.currentUser['compid'] }
            }
        }).then(() => {

            d.resolve(this.ds.dm.getEntities(this.props.model));
            
        });

        return d.promise;
    }




}