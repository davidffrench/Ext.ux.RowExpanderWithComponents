/**
 * RowExpanderWithComponents plugin
 */
Ext.define('Ext.ux.RowExpanderWithComponents', {
    extend : 'Ext.grid.plugin.RowExpander',
    alias: 'plugin.rowexpanderwithcomponents',

    /**
     * @cfg {XTemplate} rowBodyTpl
     * This needs to default to the below for ExtJS components to render to the correct row
     * (defaults to <tt><div id="display-row-{id}"> </div></tt>).
     */
    rowBodyTpl : new Ext.XTemplate(
        '<div id="display-row-{id}"> </div>'
    ),

    /**
     * @cfg {Object} rowBodyCompTemplate
     * Template ExtJS components for each row. {{modelFieldName}} is the dynamic value which will be taken from the model
     * Methods do not work. please use the getRowComponent or addToRowComponent helper functions to achieve this
     * Sample below
     * rowBodyCompTemplate: {
            xtype: 'container',
            html: '{{company}}',
            items: [{
                xtype: 'button',
                text: '{{price}}'
            }, {
                xtype: 'container',
                html: '{{change}}',
                items: [{
                    xtype: 'button',
                    text: '{{industry}}'
                }]
            }]
        }
     * (defaults to <tt>null</tt>).
     */
    rowBodyCompTemplate: null,

    /**
     * @cfg {Boolean} expandOnClick
     * <tt>true</tt> to toggle a row between expanded/collapsed when single clicked
     * (defaults to <tt>true</tt>).
     */
    expandOnClick: true,

    /**
     * @cfg {Boolean} hideExpandColumn
     * <tt>true</tt> to hide the column that contains the expand/collapse icons
     * (defaults to <tt>true</tt>).
     */
    hideExpandColumn: true,

    /**
     * @cfg {Boolean} enableTextSelection
     * <tt>true</tt> to enable text selection within the grid
     * (defaults to <tt>true</tt>).
     */
    enableTextSelection: true,

    init : function(grid){
        var me = this,
            view;

        me.callParent(arguments);

        //get the grids view
        view = me.view = grid.getView();

        //this css does not highlight the row expander body
        grid.addCls('rowexpanderwithcomponents');

        //set the rowexpander column to hidden if hideExpandColumn config is true
        if(me.hideExpandColumn){
            grid.headerCt.query('gridcolumn')[0].hidden = true;
        }            
        //enable text selection if the config is true 
        if(me.enableTextSelection){
            view.enableTextSelection = true;
        }

        view.on('expandbody', function(rowNode, record, expandRow, eOpts){
            var recId = record.getId();
            if(!recId){
                Ext.Error.raise('Error: Records must have an id to use the rowExpanderWithComponents plugin. Use http://docs.sencha.com/extjs/4.2.2/#!/api/Ext.data.Model-cfg-idProperty or http://docs.sencha.com/extjs/4.2.2/#!/api/Ext.data.Model-cfg-idgen');
            }

            //if the parent comp is rendered already, return
            var cont = this.getRowComponent(recId);
            if(cont){
                return;
            }

            var row = 'display-row-' + recId,
                clonedRowTemplate = JSON.parse(JSON.stringify(me.rowBodyCompTemplate));
            //parent comp that is rendered to the row. All subsequent components that wil be in the row expander will be children of this
            var parentCont = Ext.create(Ext.container.Container,{
                height: '100%',
                width: '100%',
                itemId: grid.getId() + '-parentRowExpCont-' + recId,
                items:[
                    me.replaceObjValues(clonedRowTemplate, record)
                ]
            });
            //render the ExtJS component to the div
            parentCont.render(row);

            //Stop all events in the row body from bubbling up
            var rowEl = parentCont.getEl().parent('.x-grid-rowbody');
            rowEl.swallowEvent(['mouseenter', 'click', 'mouseover', 'mousedown', 'dblclick', 'cellclick', 'itemmouseenter', 'itemmouseleave', 'onRowFocus', 'mouseleave']);
        });
        //assign the helper functions to the gridview and grid
        view.getRowComponent = me.getRowComponent;
        grid.getRowComponent = me.getRowComponent;

        grid.addToRowComponent = me.addToRowComponent;
        grid.addToRowComponent = me.addToRowComponent;
    },
    
    /**
     * Gets the parent ExtJS container in the rowexpander body from the rows record id 
     * @param {integer} recId The row record id  
     * @return {Ext.container.Container} the parent ExtJS container in the rowexpander body
     */
    getRowComponent: function(recId){
        return Ext.ComponentQuery.query('#' + this.up('grid').getId() + '-parentRowExpCont-' + recId)[0];
    },

    /**
     * Removes all ExtJS items from the parent row component
     * @param {integer} recId The row record id  
     */
    removeAllFromRowComponent: function(recId){
        var rowCont = this.getRowComponent(recId);

        rowCont.removeAll();
    },

    /**
     * Adds items to the parent ExtJS container in the rowexpander body
     * @param {integer} recId The row record id  
     * @param {Array} items ExtJS components
     */
    addToRowComponent: function(recId, items){
        var rowCont = this.getRowComponent(recId);

        rowCont.add(items);
    },

    /**
     * @private
     * allow single click to expand grid
     */
    bindView: function(view) {
        if (this.expandOnClick) {
            view.on('itemclick', this.onItemClick, this);
        }
        this.callParent(arguments);
    },
    /**
     * @private
     * allow single click to expand grid
     */
    onItemClick: function(view, record, row, rowIdx, e) {
        this.toggleRow(rowIdx, record);
    },

    /**
     * @private
     * Converts all string values with {{}} to record.get()
     * Example: '{{test}}' converts to record.get('test')
     */
    replaceObjValues: function( obj, record ){
        for( var all in obj )
        {
            if( typeof obj[all] === "string" && obj[all].match(/{{(.*)}}/) ){
                obj[all] = record.get(obj[all].match(/{{(.*)}}/)[1]);
            }
            if( typeof obj[all] === "object" && obj[all]!== null ){
                this.replaceObjValues( obj[all], record );
            }
        }
        return obj;
    }
});
