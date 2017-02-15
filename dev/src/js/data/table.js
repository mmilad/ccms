mngr.data.table = function(config) {

    var SELF = this,
        dm = new mngr.data.data();

    function newTable(c) {
        var table,
            schemaName;
        table = prepareArrayTable(c.dir, c.schema, c.data);
        table.properties = {
            newRow: function() {
                var newRow;
                for(schemaName in c.schema) {
                    newRow = returnTableRow(c.dir, c.schema[schemaName].items, c.data, "new");
                    newRow.mode("new");
                    table.element.appendChild(J.H.ce(newRow).element);
                }
            }
        };
        return table;
    }


    
    function popUpTable(config) {
        var tableConfig = {
                schema: config.schema,
                dir: config.dir,
                data: config.data
            },
            newRowButton,
            tpl = {tag: "div", attributes:{class: "display_array"}, children: []};

        table = newTable(tableConfig);
        newRowButton = {
            tag: "button",
            html: "new row",
            events: [{event:"click", callback: function() {table.properties.newRow();}}]
        };
        
        tpl.children.push({tag: "span", html: "titel table"});
        tpl.children.push(table);
        tpl.children.push(newRowButton);
        return tpl;
    }

    function prepareArrayTableRowButtons(dir, key, data, schema, tableRow) {
        var buttonContainer={properties:{}},
            deleteButton,
            editButton,
            saveButton;
            

            deleteButton = {
                tag: "button",
                html: "X",
                events: [{
                    event: "click",
                    callback: function() {
                        var data, callback;
                        data = {
                            task: "tableDeleteEntry",
                            dir: dir,
                            key: tableRow.properties.key
                        };
                        dm.deleteEntry(data, function(res){console.log(res);});
                        
                        tableRow.element.remove();
                    }
                }],
                properties:{key: key}
            };
            removeButton = {
                tag: "button",
                html: "X",
                events: [{
                    event: "click",
                    callback: function() {
                        tableRow.element.remove();
                    }
                }],
                properties:{key: key}
            };
            editButton = {
                tag: "button",
                html: "edit",
                events: [{
                    event: "click",
                    callback: function() {
                        tableRow.mode("edit");
                    }
                }],
                properties:{key: key}
            };

            saveButton = {
                tag: "button",
                html: "Save",
                events: [
                    {
                        event: "click",
                        callback: function () {
                            var newRow, data = tableRow.properties.returnField();    
                            obj = {
                                task: "tableInsert",
                                data: data,
                                dir: dir
                            };
                            var saveDataCallback = function (res) {
                                var key,
                                    data;
                                res = JSON.parse(res)
                                for(key in res) {
                                    data = res[key];
                                }
                                
                                newRow = returnTableRow(dir, schema, data, key)
                                newRow.mode("view");
                                tableRow.element.replaceWith(J.H.ce(newRow).element);
                            }
                            dm.entryManager(obj, saveDataCallback);
                        }
                    }
                ]
            };


            updateButton = {
                tag: "button",
                html: "update",
                events: [
                    {
                        event: "click",
                        callback: function () {
                            var data = tableRow.properties.returnField();    
                            obj = {
                                task: "tableUpdate",
                                data: data,
                                dir: dir,
                                key: tableRow.properties.key
                            };
                            var saveDataCallback = function (res) {
                                res = JSON.parse(res);
                                console.log("row updated")
                                newRow = returnTableRow(dir, schema, res, key, "view")
                                newRow.mode("view");
                                tableRow.element.replaceWith(J.H.ce(newRow).element);
                            }
                            dm.entryManager(obj, saveDataCallback);
                        }
                    }
                ]
            }

        buttonContainer.properties = {
            returnField: function(){
                return {};
            }
        };
        buttonContainer.mode = function(mode) {
            var i, myButtons = [];
            if(mode === "view") {
                myButtons.push(deleteButton);
                myButtons.push(editButton);
            } else if (mode === "edit") {
                myButtons.push(deleteButton);
                myButtons.push(updateButton);
            } else if(mode === "new") {
                myButtons.push(removeButton);
                myButtons.push(saveButton);
            }
            buttonContainer.children = myButtons;
            if(buttonContainer.element) {
                while (buttonContainer.element.firstChild) {
                    buttonContainer.element.removeChild(buttonContainer.element.firstChild);
                }
                for(i=0;i<buttonContainer.children.length;i++) {
                    buttonContainer.element.appendChild(J.H.ce(buttonContainer.children[i]).element);
                }
            }
        }
        return buttonContainer;
    }

    function prepareArrayTable(dir, schema, data) {
        var i, key, x, tableTpl, schemaName, schemaKey, schemaItem, entryRow, rowButtonSet, deleteButton;
        
        for(schemaName in schema) {
            schemaKey = schemaName;
        }
        schema = schema[schemaKey].items;
        tableTpl = {tag: "table",children: []};
            tableTpl.children.push({tag: "tr",children: [{tag: "td"}], properties:{}});
        
        // table titles
        for(schemaItem in schema){
            tableTpl.children[0].children.push({tag: "td",children: [{
                tag: "span",
                attributes: {
                    title: schema[schemaItem].type
                },
                html: schemaItem
            }]});
        }
        // table entry rows
        for(key in data) {
            entryRow = returnTableRow(dir, schema, data[key], key);
            entryRow.mode("view");  
            tableTpl.children.push(entryRow);
        }
        return tableTpl;
    }

    function returnTableRow(dir, schema, data, key) {
        var tableRow, schemaKey, schemaItem;
        tableRow = {tag: "tr", children:[], properties: {key: key}};
        tableRow.children.push({tag: "td", children: [prepareArrayTableRowButtons(dir, key, data, schema, tableRow)]});

        for(schemaKey in schema){
            // for(schemaItem in schema[schemaKey].items){
                tableRow.children.push({tag:"td", children: [returnFieldSet(dir, schemaKey, schema[schemaKey], data)]});
            // }
        }
        tableRow.mode = function(mode){
            var i, cols;
            if(tableRow.element) {
                cols = tableRow.element.children;
                for(i=0;i<cols.length;i++){
                    cols[i].H.children[0].mode(mode);
                };
            } else {
                cols = tableRow.children;
                for(i=0;i<cols.length;i++){
                    cols[i].children[0].mode(mode);
                };
            }
        };
        tableRow.properties.returnField = function() {
            var i, name, children = tableRow.element.children, my = {}, r;
            for(i=0;i<children.length;i++) {
                r = children[i].children[0].H.properties.returnField();
                for(name in r) {
                    my[name] = r[name];
                }
            }
            return my;
        }
        return tableRow;
    }

    function returnFieldSet(dir, schemaName, schema, data, mode) {
        var field;
        if(!data){data="";} else {data=data[schemaName]};
        // if(!mode){mode="view";}
        if(schema.type === "string") {
            field = returnString(schemaName, schema, data, mode);
        }
        else if(schema.type === "object") {
            field = returnObject(dir, schemaName, schema, data, mode);
        }
        else if(schema.type === "array") {
            field = returnArray(dir, schemaName, data, mode);
        }
        return field;
    }
    function returnString(schemaName, schema, data, mode){
        var field,
            object = {attributes:{class:"field_type_string"}, children:[], properties: {}};
            object.mode = function(mode) {
                var field;
                if(mode === "view") {
                    field = {tag: "span"};
                    field.html = data;
                    object.children = [field];
                    object.properties.returnField = function () {
                        var my = {};
                        my[schemaName] = data;
                        return my;
                    }
                } else if ((mode === "edit") || (mode === "new")) {
                    field = {tag: "input"};
                    field.value = data;
                    object.children = [field];
                    object.properties.returnField = function () {
                        var my = {};
                        my[schemaName] = field.element.value;
                        return my;
                    }
                }
                if(object.element) {
                    object.element.children[0].replaceWith(J.H.ce(field).element);
                }
            };
        return object;
    }
    
    function returnArray(dir, schemaName, dataKey, mode){
        var field,
            object = {attributes:{class:"field_type_string"}, children:[]};
            object.mode = function(mode) {
                if((mode === "new")) {
                    field = {tag: "span"};
                    field.html = "auto generated";
                    object.children.push(field);
                    object.properties = {
                        returnField : function () {
                            var my = {};
                            my[schemaName] = "newArray";
                            return my;
                        }
                    };    
                } else if (mode === "edit") {
                    field = {tag: "span"};
                    field.html = "not editeble";
                    object.children.push(field);
                    object.properties = {
                        returnField : function () {
                            var my = {};
                            my[schemaName] = dataKey;
                            return my;
                        }
                    };
                } else if (mode === "view") {
                    field = {tag: "span"};
                    field.html = dataKey;
                    field.events = [{
                        event: "click",
                        callback: function() {
                            dm.loadDataDir(dir+dataKey+"/", function(config){
                                var newTpl, schemaName, schemaItems, config;

                                newTpl = popUpTable(config);

                                newTpl = J.H.ce(newTpl);
                                
                                $(newTpl.element).dialog({
                                    width: "100%",
                                    position: ['center',"20"],
                                    dialogClass: "data-structure",
                                    open: function(event) {
                                        $(event.target).parent().css('position', 'absolute');
                                        $(event.target).parent().css('height', '100%');
                                    }
                                });
                            });
                        }
                    }];
                    
                    object.children.push(field);
                    object.properties = {
                        returnField : function () {
                            var my = {};
                            my[schemaName] = data;
                            return my;
                        }
                    };
                }

                if(object.element) {
                    object.element.children[0].replaceWith(J.H.ce(field).element);
                }
            };
        return object;
    }

    function returnObject(dir, schemaName, schema, data, mode){
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

            lastInsert = itemSetObjItem.push(returnFieldSet(dir, schemaItem, schema.items[schemaItem], data, mode));
            itemSetObj.children.push({tag: "td", children: [itemSetObjItem[lastInsert-1]]});
            itemSet.push(itemSetObj);
        }
        // for(i=0;i<itemSetObjItem.length;i++) {
        //     itemSet.children.push(itemSetObjItem[i]);
        // }

        object.children = itemSet;
        object.mode = function(mode) {
            var row, childs = object.children;
            for(row=0;row<childs.length;row++){
                childs[row].children[1].children[0].mode(mode);
            }
        }
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

    return newTable(config);
}