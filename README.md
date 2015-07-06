# Ext.ux.RowExpanderWithComponents
Allows the use of ExtJS components inside a row expander

##How to use it: 
Include it as a normal grid plugin. Define a row body template or use the getRowComponent or addToRowComponent functions to add components.
```javascript
plugins: [{
    ptype: 'rowexpanderwithcomponents',
    rowBodyCompTemplate: {
        xtype: 'container',
        html: '{{company}}',
        items: [{
            xtype: 'label',
            text: '{{price}}'
        }, {
            xtype: 'container',
            html: '{{change}}',
            items: [{
                xtype: 'button',
                text: '{{industry}}',
                itemId: 'davidTest'
            }]
        }]
    }
}]
```

###Records must have an id to use the rowExpanderWithComponents plugin. 
Use   
http://docs.sencha.com/extjs/4.2.2/#!/api/Ext.data.Model-cfg-idProperty  
or  
http://docs.sencha.com/extjs/4.2.2/#!/api/Ext.data.Model-cfg-idgen'

###Includes a rowBodyCompTemplate property
Template ExtJS components for each row. {{modelFieldName}} is the dynamic value which will be taken from the model.  
Methods do not work. please use the getRowComponent or addToRowComponent helper functions to achieve this
