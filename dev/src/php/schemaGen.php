<?php
include_once './../../config/config.php'; // remove
include_once 'filemanager.php';

class schemaGen extends filemanager
{
    static function updateSchema($dir, $schema){
        filemanager::checkDir($dir);
        file_put_contents($dir."schema.json", json_encode($schema, JSON_PRETTY_PRINT));
    }

    static function makeEntryPattern($dir, $schema) {
        $pattern = "";
        
        foreach($schema as $label => $config){
            $pattern .= ",\"".$label."\":";

            if($config->type == "string") {
                if($config->default){
                    $pattern .= "\"".$config->default."\"";
                } else {
                    $pattern .= "\"\"";
                }
            }
            else if($config->type == "object") {
                $itemPattern = "";
                foreach($config->items as $itemKey => $itemValue) {
                    $childSchema = "{\"".$itemKey."\":".json_encode($itemValue)."}";
                    $childSchema = json_decode($childSchema);
                    $itemPattern .= ",".static::makeEntryPattern($dir, $childSchema);
                }
                    $itemPattern = substr($itemPattern, 1);
                    $pattern .= "{".$itemPattern."}";

            }
            else if($config->type == "array") {

                $dataKey = uniqid();
                $pattern .= "\"".$dataKey."\"";
                
                    $childSchema = "{\"".$label."\":".json_encode($config)."}";
                    $childSchema = json_decode($childSchema);
                    
                        static::updateSchema($dir.$dataKey."/", $childSchema);
                    
                
                $dataFile = "{\"".$itemKey."\":\"".$dataKey."\"}";
                $childSchema = "{\"".$itemKey."\":".json_encode($itemValue)."}";
            }
        }
                    
        $pattern = substr($pattern, 1);
        return $pattern;
    }
}
