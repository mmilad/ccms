var dataview = function (config, mode) {

    var SELF = this,
        MODE;
    if(!mode){MODE = "edit";}
    this.init = function(dir, cb) {
        if(!dir) {dir="";}
        if(!cb) {cb="make_object_call";}
        J.R.get({
            "url": "./src/php/showData.php",
            "data": {"data" : dir},
            "callback": function(res){
                res = JSON.parse(res);
                var data = JSON.parse(res.data),
                    schema = JSON.parse(res.schema),
                    tpl = {"tag":"div",attributes:{class:"request"},children:[]};
                    tpl.children.push(SELF[cb](schema, data, dir));
                tpl = J.H.ce(tpl);
                
                $(tpl.element).dialog({
                    width: "100%",
                    position: ['center',"20"],
                    dialogClass: "data-structure",
                    open: function(event) {
                        $(event.target).parent().css('position', 'absolute');
                        $(event.target).parent().css('height', '100%');
                    }
                });
            },
            "method": "GET"
        });
    }
    
    this.make_table_call = function(schema, data, dir) {
        var tableConfig = {
                schema: schema,
                dir: dir,
                data: data
            },
            newRowButton,
            tpl = {tag: "div", attributes:{class: "display_array"}, children: []};
debugger;
        table = mngr.data.table(tableConfig);
        newRowButton = {
            tag: "button",
            html: "new row",
            events: [{event:"click", callback: function() {table.properties.newRow();}}]
        };
        
        tpl.children.push(newRowButton);
        tpl.children.push(table);
        return tpl;
    }

    this.make_object_call = function(schema, data, dir){
        var editButton,
            saveButton,
            schemaName,
            tplObj,
            tpl = {
                children:[],
                attributes: {
                    class: "display_object"
                }
            };
        editButton = {
            tag: "button",
            html: "edit",
            events: [{
                event: "click",
                callback: function () {
                    var newTplObj;
                    m = tplObj.properties.returnField();
                    for(schemaName in schema){
                        newTplObj = returnFieldSet(dir, schemaName, schema[schemaName], data, true);
                        newTplObj = J.H.ce(newTplObj);
                        tplObj.element.replaceWith(newTplObj.element);
                        tplObj = newTplObj;
                    }
                    this.H.element.replaceWith(J.H.ce(saveButton).element);
                    // debugger;
                }
            }]
        };
        saveButton = {
            tag: "button",
            html: "save",
            events: [{
                event: "click",
                callback: function () {
                    var callback,
                        data = {
                            task: "saveMainObj",
                            data: tplObj.properties.returnField(),
                            dir: dir
                        };
                    callback = function(res) {
                        res = JSON.parse(res);
                        data = res;
                        var newTplObj;
                        newTplObj = SELF.make_object_call(schema, res, dir);
                        newTplObj = J.H.ce(newTplObj);
                        tpl.element.replaceWith(newTplObj.element);
                        tpl = newTplObj;
                    }
                    saveMainObj(data, callback);
                }
            }]
        };
        tpl.children.push(editButton);
        for(schemaName in schema){
            // tpl.children.push(make_object(schema[t], data, t));
            tpl.children.push({tag: "span", html: schemaName});
            tplObj = returnFieldSet(dir, schemaName, schema[schemaName], data);
            tpl.children.push(tplObj);
        }

        return tpl;
    }

    function saveData(data, callback){
        data = JSON.stringify(data);
        J.R.get({
            "url": "./src/php/entryManager.php",
            "data": {"data" : data},
            "callback": function(res){
                callback(res);
            },
            "method": "GET"
        });
    }

    function saveMainObj(data, callback){
        data = JSON.stringify(data);
        J.R.get({
            "url": "./src/php/entryManager.php",
            "data": {"data" : data},
            "callback": function(res){
                callback(res);
            },
            "method": "GET"
        });
    }
    function deleteEntry(data, callback) {
        data = JSON.stringify(data);
        J.R.get({
            "url": "./src/php/entryManager.php",
            "data": {"data" : data},
            "callback": function(res){
                callback(res);
            },
            "method": "GET"
        });
    }
    function returnFieldSet(dir, schemaName, schema, data, asEdit) {
        var field;
        if(!data){data="";} else {data=data[schemaName]};

        if(schema.type === "string") {
            field = returnString(schemaName, schema, data, asEdit);
        }
        else if(schema.type === "object") {
            field = returnObject(dir, schemaName, schema, data, asEdit);
        }
        else if(schema.type === "array") {
            field = returnArray(dir, schemaName, data, asEdit);
        }

        return field;
    }
    function returnString(schemaName, schema, data, asEdit){
        var input,
            object = {attributes:{class:"field_type_string"}, children:[]};
            if(!data) {data = "";}
            if(!asEdit) {
                input = {tag: "span"};
                input.html = data;
                object.children.push(input);
                object.properties = {
                    returnField : function () {
                        var my = {};
                        my[schemaName] = data;
                        return my;
                    }
                };
            } else {
                input = {tag: "input"};
                input.value = data;
                object.children.push(input);
                object.properties = {
                    returnField : function () {
                        var my = {};
                        my[schemaName] = input.element.value;
                        return my;
                    }
                };
            }
        return object;
    }
    
    function returnArray(dir, schemaName, data, asEdit){
        var object = {attributes:{class:"field_type_array"}, children:[], events: []},
            arrayField;

        if(asEdit) {
            if(!data) {data="auto generated";}
            arrayField = {
                tag: "span",
                html: data
            };
            object.properties = {
                returnField: function() {
                    var my={};
                    my[schemaName]=arrayField.element.value;
                    return my;
                }
            };
        } else {
            arrayField = {
                tag: "span",
                html: "Table"
            };
            object.properties = {
                returnField: function() {
                    var my={};
                    my[schemaName]=data;
                    return my;
                }
            };
            object.events.push(
                {
                    event: "click",
                    callback: function(){
                        if(data){
                            SELF.init(dir+data+"/", "make_table_call");
                        }
                    }
                }
            );
        }
        
        object.children.push(arrayField);
        return object;
    }


    function returnObject(dir, schemaName, schema, data, asEdit){
        var object = {tag: "table",  attributes:{class:"field_type_object"}},
            itemSet = [],
            itemSetObjItem =[],
            i,
            schemaItem;
        
        for(schemaItem in schema.items) {
            var itemSetObj = {
                    tag: "tr",
                    properties: {},
                    attributes:{class:"field_type_object_item"},
                    children: [
                        {
                            tag: "td",
                            html: schemaItem
                        }
                    ]
                },
                lastInsert;

            lastInsert = itemSetObjItem.push(returnFieldSet(dir, schemaItem, schema.items[schemaItem], data, asEdit));
            itemSetObj.children.push({tag: "td", children: [itemSetObjItem[lastInsert-1]]});
            itemSet.push(itemSetObj);
        }
        // for(i=0;i<itemSetObjItem.length;i++) {
        //     itemSet.children.push(itemSetObjItem[i]);
        // }

        object.children = itemSet;
        object.properties = {
            returnField : function () {
                var my={}, childObj, childObjKey;
                my[schemaName] ={};
                for(i=0;i<itemSetObjItem.length;i++) {
                    childObj = itemSetObjItem[i].properties.returnField();
                    for(childObjKey in childObj){
                        my[schemaName][childObjKey] = childObj[childObjKey];
                    }
                }
                return my;
            }
        }
        return object;
    }

    return init(config);

}