<?php
include_once './../../config/config.php'; // remove
include_once root_path.'src/php/schemaGen.php';
include_once root_path.'src/php/filemanager.php';
class datamanager_main extends schemaGen
{
    static function saveData($config)
    {

        $dir = $config->dir;
        $dir = data_path.$dir;
        $schema_file = file_get_contents($dir."schema.json");
        $schema_file = json_decode($schema_file);

        foreach($schema_file as $key => $schema) {
            if($schema->type == "array") {
                $row = static::addArrays($dir, $config->data, $schema->items);
                static::tableInsert($dir, $row);
            }
        }
            $data = json_encode($config->data, JSON_PRETTY_PRINT);
    }

    static function addArrays($dir, $data, $schema) {
        foreach($data as $key => $value) {
            if($schema->$key->type == "object") {
                $data->$key = static::addArrays($dir, $value, $schema->$key->items);
            }
            else if($schema->$key->type == "array") {
                $data->$key = uniqid();
                $arraySchema = "{\"".$key."\":".json_encode($schema->$key)."}";
                $arraySchema = json_decode($arraySchema);
                static::newArray($dir, $data->$key, $arraySchema);
            }
        }
        return $data;
    }

    static function newArray($dir, $key, $schema) {
        schemaGen::updateSchema($dir.$key."/", $schema);
        
    }

    static function tableInsert($config) {
        $dir = data_path.$config->dir;
        $value = $config->data;
        $file = $dir."data.json";
        $key = uniqid();
        $schema_file = file_get_contents($dir."schema.json");

        $schema_file = json_decode($schema_file);

        foreach($schema_file as $objKey => $schema) {
            $value = static::addArrays($dir, $value, $schema->items);
        }
        $returnRow = "{\"".$key."\":".json_encode($value)."}";
        if(!file_exists($file)) {
            $data = json_decode($returnRow);
            $data = json_encode($data, JSON_PRETTY_PRINT);
            file_put_contents($file, $data);
        } else {
            $data_file = file_get_contents($file);
            $data = json_decode($data_file);
            $data->$key = $value;
            $data = json_encode($data, JSON_PRETTY_PRINT);
            file_put_contents($file, $data);
        }
        echo $returnRow;
    }


    static function tableUpdate($config) {
        $dir = data_path.$config->dir;
        $key = $config->key;
        $value = $config->data;
        $file = $dir."data.json";
        $data_file = file_get_contents($file);
        $data = json_decode($data_file);
        $data->$key = $value;
        $dataStr = json_encode($data, JSON_PRETTY_PRINT);
        $returnVal = json_encode($data->$key, JSON_PRETTY_PRINT);
        file_put_contents($file, $dataStr);
        echo $returnVal;
    }

    static function tableDeleteEntry($config) {
        $dir = data_path.$config->dir;
        $key = $config->key;
        print_r($key);
        $file = $dir."data.json";
        $data = file_get_contents($file);
        $data = json_decode($data);
        unset($data->$key);
        $data = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents($file, $data);

        echo "removed entry";
    }

    static function saveMainObj($config) {
        $file = data_path.$config->dir."data.json";
        $data = json_encode($config->data, JSON_PRETTY_PRINT);
        file_put_contents($file, $data);
        
        $data = file_get_contents($file);

        echo $data;
    }
}
