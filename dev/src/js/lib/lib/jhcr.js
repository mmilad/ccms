var J = {};
var elem = document.createElement('script');
document.head.appendChild(elem);
J.path = elem.previousSibling.src.replace("jhcr.js", "");
// J.helper = new function () {
//     this.getPath = function (){
//         return PATH;
//     }
//     return this;
// }
// J.init = function(addConfig){
//     var elem = document.createElement('script');
//     document.head.appendChild(elem);
//     J.path = elem.previousSibling.src.replace("jhcr.js", "");
//     elem.remove();
//     config =  [
//         J.path+'assets/request/main.js',
//         J.path+'assets/style/main.js',
//         J.path+'assets/element/main.js'
//     ];
//     // if(typeof addConfig === "array"){
//     //     config.push(addConfig);
//     // }
//     if(addConfig){
//         config=addConfig;
//     }
//     config.forEach(function(instance){
//         elem = document.createElement('script');
//         document.head.appendChild(elem);
//         elem.src=instance;
//     });
// };
;var J_H_CONTROLLER = function (JMain) {
    "user strict";

    var SELF = this,
        MODEL_OBJECT;
    this.init = function (config) {
        SELF.setModel(config);
        document.body.appendChild(SELF.ce(MODEL_OBJECT));
    };

    this.ce = function (config) {
        // generates the config.element if not exist and config.tag not set
        if (!config.element) {
            config = configToElement(config);
        } else {
            if(config.element.H.tag !== config.tag){
                config = configToElement(config);
            }
        }
        config.element.H = config;
        config = setConfigFunctions(config);
        if (!config.attributes) { config.attributes = {}; }
        
        if (config.config) {
            if (config.config.widget) {
                if (config.config.widget_config) {
                    // config.element[config.config.widget](config.config.widget_config);
                } else {
                    // config.element[config.config.widget]();
                }
            }
        } else {
            config.config = {};
        }
        if (config.value) {
            config.element.value = config.value;
        }
        if (config.html) {
            config.element.innerHTML = config.html;
        }
        if (config.class) {
            if (config.attributes.class) {
                config.attributes.class += " " + config.class;
            } else {
                config.attributes.class = " " + config.class;
            }
            delete config.class;
        }
        if (config.attributes) {
            for (var attr in config.attributes) {
                config.element.setAttribute(attr, config.attributes[attr]);
            }
        }
        if (config.events) {
            for (var i in config.events) {
                config.element.addEventListener(config.events[i].event, config.events[i].callback);
            }
        }
        if (config.properties) {
            config.properties = config.properties;
        }
        if (config.id) {
            config.element.setAttribute('data-identifier', config.id);
        }
        if (config.children) {
            config.children.forEach(function (child) {
                config.element.appendChild(SELF.ce(child).element);
            });
        } else {
            config.children = [];
        }
        return config;
    };





    this.setModel = function (obj) {
        MODEL_OBJECT = obj;
    };

    this.getModel = function () {
        return MODEL_OBJECT;
    };
    //depricated.. need overwork
    // this.update = function (config) {
    //     if (!config.on) { config.on = MODEL_OBJECT; }
    //     var foundObj = SELF.find(config.on, config.id);
    //     var newObj = merge(foundObj, config.set);
    //     if (newObj.element) {
    //         newObj.element.replaceWith(SELF.ce(newObj));
    //     }
    // };

    this.find = function (identifier) {
        // var targ;
        // if (on.id === identifier) {
        //     targ = on;
        // } else {
        //     for (var i in on.children) {
        //         targ = SELF.find(on.children[i], identifier);
        //         if (targ !== undefined) {
        //             break;
        //         }
        //     }
        // }        
    };






    function addElemOneToElemTwo(elem1, elem2){
        elem1 = checkIfisJhsonObject(elem1);
        elem2 = checkIfisJhsonObject(elem2);
        // if(!elem1.append){elem1 = SELF.ce(elem1)};
        // if(!elem2.append){elem2 = SELF.ce(elem2)};
        elem2.element.appendChild(elem1.element);
        elem2.children.push(elem1);
        elem1.parent = elem2;
    }
    function merge(objA, objB) {
        for (var i in objB) {
            if (objB[i] !== undefined) {
                objA[i] = objB[i];
            }
        }
        return objA;
    }

    function configToElement(config) {
        if (!config.H) {
            if ((typeof config) === "string") {
                config.element = document.createElement(config);
            } else if (typeof config === 'object') {
                if (config.nodeName) {
                    var isElement = config;
                    config = {
                        tag: isElement.nodeName.toLowerCase(),
                        element: isElement
                    };
                    if (isElement.value !== "") {
                        config.value = isElement.value;
                    }
                    if (isElement.childNodes.length !== 0) {
                        config.children = [];
                        isElement.childNodes.forEach(function (child) {
                            config.children.push(SELF.ce(child));
                        });
                    }
                } else {
                    if (!config.tag) { config.tag = "div"; }
                    config.element = document.createElement(config.tag);
                }
            } else if (config === undefined) {
                config = {
                    tag: 'div',
                    element: document.createElement('div')
                }
            }
        } else {
            config = config.H;
        }
        return config;
    }


    function setConfigFunctions(config) {
        config.appendTo = function (addConfig) {
            addConfig = checkIfisJhsonObject(addConfig);
            addConfig = SELF.ce(addConfig);
            addElemOneToElemTwo(config, addConfig)
            return config;
        }
        config.append = function (addConfig) {
            var newElem;
            if (addConfig.constructor === Array) {
                addConfig.forEach(function (instance) {
                    // newElem = SELF.ce(instance);
                    // config.element.appendChild(newElem.element);
                    // config.children.push(newElem);
                    // newElem.parent = config;
                    addElemOneToElemTwo(instance, config);
                });
            } else {
                // newElem = SELF.ce(addConfig);
                // config.element.appendChild(newElem.element);
                // config.children.push(newElem);
                // config.children.push(addConfig);
                // newElem.parent = config;
                addElemOneToElemTwo(addConfig, config);
            }
            config.paren
            return config;
        };
        config.find = function (identifier) {
            identifier = myQuerySelector(identifier);
            if(!identifier.H){
                identifier = SELF.ce(identifier);
            }
            return identifier.H;
        };
        config.findInParent = function (identifier) {
            var parent = this.element.parentNode.H;
            var arg = SELF.find(parent, identifier);
            return arg;
        };
        config.get = function (identifier) {
            return this[identifier];
        };

        config.update = function (addConfig) {
            if(!addConfig){addConfig=this;}
            addConfig = addConfig.H ? addConfig.H : addConfig;
            var newConfig = merge(this, addConfig);
            SELF.ce(newConfig);
            return addConfig;
        };
        return config;
    }
    function myQuerySelector(identifier){
        return document.querySelector(identifier);
    }
    function checkIfisJhsonObject(obj){
        if(obj){
            if((!obj.ce) && (!obj.H)){
                obj = SELF.ce(obj);
            }
        } else {
            obj = SELF.ce(obj);
        }
        return obj;
    }
    return this;
};
J.H = new J_H_CONTROLLER(J);
;var J_C_CONTROLLER = function () {

    var SELF = this,
        RULES = [],
        MAIN,
        MAIN_SHEET;

    MAIN = document.createElement('style');
    MAIN.type = "text/css";
    document.head.appendChild(MAIN);;
    MAIN_SHEET = MAIN.sheet ? MAIN.sheet : MAIN.styleSheet;

    this.init = function () {
    };

    this.find = function (selector) {
        if(!RULES[selector]){RULES[selector] = "not set";}
        if(selector.constructor === Array){
            var a=[];
            selector.forEach(function(instance){
                a[instance] = RULES[instance];
            });
            return a;
        }
        return RULES[selector];
    }

    this.update = function (config) {
        var oldConfig,
            ruleFinder = findRule(config.selector);
        updateToRules(config);
        if (ruleFinder.found) {
            oldConfig = ruleFinder.rule;
            MAIN_SHEET.deleteRule(ruleFinder.index);
            config = mergeRules(getCssAsJson(oldConfig), config);
        }
        MAIN_SHEET.insertRule(configToStyle(RULES[config.selector]), 0);
    }

    function updateToRules(config) {
        RULES[config.selector] = config;
        RULES[config.selector].update = function (newRules) {
            var newRuleConfig = config;
            for(var i in newRules){
                newRuleConfig.rule[i] = newRules[i];
            };
            SELF.update(newRuleConfig);

        };
    }

    // css string to json
    function getCssAsJson(cssString) {
        var jsonCss = {},
            ruleSet = [],
            ruleSetFound = 0,
            searchAttr = false,
            searchIndex = false,
            searchFrom = 0,
            searchTo,
            newConfig = { rule: {} };
        cssString = cssString.replace(/ /g, '');
        for (var i = 0; i < cssString.length; i++) {
            if (searchAttr) {
                if (searchIndex) {
                    if (cssString[i] === ":") {
                        ruleSet[ruleSetFound] = {};
                        ruleSet[ruleSetFound].rule = cssString.substring(searchFrom, i);
                        searchFrom = i + 1;
                        searchIndex = false;
                    }
                } else {
                    if (cssString[i] === ";") {
                        ruleSet[ruleSetFound].val = cssString.substring(searchFrom, i);
                        searchFrom = i + 1;
                        searchIndex = true;
                        ruleSetFound++;
                    }
                }

            } else if (cssString[i] === "{") {
                newConfig.selector = cssString.substring(0, i);
                searchAttr = true;
                searchIndex = true;
                searchFrom = i + 1;
            }
        }
        ruleSet.forEach(function (instance) {
            newConfig.rule[instance.rule] = instance.val;
        });
        return newConfig;
    }
    function mergeRules(o1, o2) {
        for (var i in o2.rule) {
            o1.rule[i] = o2.rule[i];
        }
        return o1;
    }
    function findRule(selector) {
        var rule = { found: false };
        for (var i in MAIN_SHEET.cssRules) {
            if ((i !== "length") && (i !== "item")) {
                if (MAIN_SHEET.cssRules[i].selectorText === selector) {
                    rule.found = true;
                    rule.rule = MAIN_SHEET.cssRules[i].cssText;
                    rule.index = i;
                }
            }
        };
        return rule;
    };

    function isInt(val) {
        var isIntVal = parseInt(val);
        if (!isNaN(isIntVal)) {
            if (typeof isIntVal === "number") {
                isIntVal = true;
            } else {
                isIntVal = false;
            }
        } else {
            isIntVal = false;
        }
        return isIntVal;
    }

    function configToStyle(config) {
        var selector = config.selector,
            rule = config.selector + "{";

        for (var i in config.rule) {
            rule += i + ":" + config.rule[i] + ";";
        }
        rule += "}";
        return rule;
    }

    this.makeJObject = function (object, rule) {
        object.JConfig = RULE[rule];
    };
    this.getRules = function () {
        return RULES;
    };

    function configRule(rule) {
        rule.update = function () {
            console.log("ds");
        };
    }

    return this;
}
J.C = new J_C_CONTROLLER();;var J_R_CONTROLLER = function(){

    var SELF = this,
        ajax = {};

    function init(config){
        SELF.addDir(config);
    }

    this.addDir = function (config) {
        var requestObject = {
            callback: appendDirFiles,
            async: true,
            url: J.helper().getPath()+"assets/php/getdir.php",
            data : {path: JSON.stringify(config), myPath: J.helper().getPath()}
        };
        SELF.get(requestObject);
    };

    function appendDirFiles(config){
        console.log(config);
        config=JSON.parse(config);
        var elem;
        for(var i in config){
            elem = document.createElement('script');
            elem.type = "text/javascript";
            document.head.appendChild(elem);
            elem.src = config[i];
        }
    }

    function merge(obj1, obj2) {
        for(var i in obj2){
            obj1[i] = obj2[i];
        }
        return obj1;
    }
    this.get = function (config) {
        var baseConfig = {
            url: undefined,
            callback: undefined,
            method: undefined,
            data: {},
            async: undefined
        };
        config = merge(baseConfig, config)
        if(typeof config.url !== undefined){
            ajax.get(config.url, config.data, config.callback, config.async);
        }
    };

    ajax.x = function () {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();
        }
        var versions = [
            "MSXML2.XmlHttp.6.0",
            "MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
        ];

        var xhr;
        for (var i = 0; i < versions.length; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch (e) {
                console.error(e);
            }
        }
        return xhr;
    };

    ajax.send = function (url, callback, method, data, async) {
        if (async === undefined) {
            async = true;
        }
        var x = ajax.x();
        x.open(method, url, async);
        x.onreadystatechange = function () {
            if (x.readyState == 4) {
                callback(x.responseText)
            }
        };
        if (method == 'POST') {
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        x.send(data)
    };

    ajax.get = function (url, data, callback, async) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
    };

    ajax.post = function (url, data, callback, async) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        ajax.send(url, callback, 'POST', query.join('&'), async)
    };
    return this;
};

J.R = new J_R_CONTROLLER();