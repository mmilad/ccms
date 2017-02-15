<?php
class filemanager {

    static function schema()
    {
        $schemas = file_get_contents(SCHEMA_PATH);
        $schemas = json_decode($schemas, true);
        foreach ($schemas['modules'] as $item){
            static::checkDir(theme_path."modules/" . $item);
            static::checkItem(theme_path."modules/" . $item . "/", $item);
        }
        static::checkData($schemas['data']);
    }

    static function checkDir($dir)
    {
        $dir = $dir;
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true); // true for recursive create
        }
    }
    static function checkItem($dir, $item)
    {
        $file = $dir . "schema.json";
        if(!file_exists($file)){
            $file = fopen($file, "w") or die("Unable to open file!");
            
            $txt = "{\n\t\"tag\":\"div\",\n\t\"id\":\"" . $item . "\"\n}";
            fwrite($file, $txt);
        }
        $file = $dir . "data.json";
        if(!file_exists($file)){
            $file = fopen($file, "w") or die("Unable to open file!");
            
            $txt = "{\n\t\"tag\":\"div\",\n\t\"id\":\"" . $item . "\"\n}";
            fwrite($file, $txt);
        }
    }
    static function checkData($data)
    {
        if(!file_exists(data_path.'dataBase.json')){
            $mainFile = fopen(data_path.'/dataBase.json', "w") or die("Unable to open file!");
            $mainTxt = "{\n\t";
            $lastU = sizeof($data);
            $u = 0;
            foreach($data as $table => $schema){
                $u++;
                $genGuid = uniqid();
                static::checkDir(data_path . $genGuid);
                $file = data_path . $genGuid . "/schema.json";
                    $txt="";
                    $last = sizeof($schema);
                    $i = 0;
                    foreach($schema as $key => $column){
                        $i++;
                        $txt .= "\"" . $key . "\" : {}";
                        if($i != $last){
                            $txt .= ",";
                        }
                    }
                    $file = fopen($file, "w") or die("Unable to open file!");
                    $txt = "{\"config\":{" . $txt . "},\"values\":[]}";
                    fwrite($file, $txt);

                    $mainTxt .= "\"" . $genGuid . "\":{";
                    $mainTxt .= "\"label\":\"" . $table . "\"}";
                if($u != $lastU){
                    $txt .= ",";
                }
            }

            $mainTxt .= "}";
            // $mainTxt = json_decode($mainTxt);
            print_r($mainTxt);
            // $mainTxt = json_encode($mainTxt);
            // fwrite($mainFile, $mainTxt['data']);
        }
    }

    static function load($data)
    {
        $data  = json_decode($data, true);
        $requestData = array();
        $file = file_get_contents(theme_path . $data['type'] . "/" . $data['item'] . "/schema.json");
        $requestData['schema'] = json_decode($file, true);
        $file = file_get_contents(theme_path . $data['type'] . "/" . $data['item'] . "/data.json");
        $requestData['data'] = json_decode($file, true);
    
        
        print_r($requestData);
    }
}