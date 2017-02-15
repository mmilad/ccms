function init(){
    types = ['sites','modules','styles'];
    types.forEach(function(type) {
        naviGen(type)
    });


    var extra = J.H.ce({
        "tag" : "div",
        "html" : "data",
        "events":[
            {
                "event":"click",
                "callback": function(){
                    dataview();
                }
            }
        ]
    });
    $('#navBar').append(extra.element);
}
function naviGen(type){
    var items = data[type],
        naviConfig = {
            "tag":"div",
            "html": type,
            "children":[
                {
                    "tag":"ul",
                    "children":[]
                }
            ]
        };

    items.forEach(function(item){
    naviConfig.children[0].children.push({
            "tag" : "li",
            "html" : item,
            "events":[
                {
                    "event":"click",
                    "callback":function () {load({"type": type,"item": item});}
                }
            ]
        });
    });
J.H.ce(naviConfig);
naviConfig.appendTo(document.getElementById('navBar'));
}

function get(){

    var config = {

    };
}