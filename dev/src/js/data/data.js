mngr.data.data = function() {



    this.loadDataDir = function(dir, cb) {
        if(!dir) {dir="";}
        if(!cb) {cb="make_object_call";}
        J.R.get({
            "url": "./src/php/showData.php",
            "data": {"data" : dir},
            "callback": function(res){
                var config = {dir: dir};

                res = JSON.parse(res);
                config.data = JSON.parse(res.data),
                config.schema = JSON.parse(res.schema);
                cb(config);
            },
            "method": "GET"
        });
    }

    this.entryManager = function(data, callback){
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

    this.saveMainObj = function(data, callback){
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
    this.deleteEntry = function(data, callback) {
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

    return this
}