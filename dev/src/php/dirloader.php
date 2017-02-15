<?php

class dirloader
{
    static function load($dir, $type) {
        $dir_to_load = scandir($dir);
        $loadList = static::filterByPattern($dir, $dir_to_load);
        foreach($loadList['files'] as $file) {
            if((substr($file, -3) == ".js") && ($type == "js")) {
                echo "<script type='text/javascript' src='".$file."'></script>";
            } else if((substr($file, -4) == ".css") && ($type == "css")) {
                echo "<link rel='stylesheet' href='".$file."'></script>";
            } else if((substr($file, -4) == ".php") && ($type == "php")) {
                include_once $file;
            }
        }
        foreach($loadList['dirs'] as $dir) {
            static::load($dir, $type);
        }
    }

    static function filterByPattern($dir, $arr) {
        $config = array(
            "files" => array(),
            "dirs" => array()
        );
        foreach($arr as $item) {
            if(!in_array($item, array(".",".."))) {
                if(is_file($dir.$item)) {
                    array_push($config['files'], $dir.$item);
                } else {
                    array_push($config['dirs'], $dir.$item."/");
                }
            }
        }
        return $config;
    }

    static function init($config) {
        foreach($config as $type => $dir) {
            static::load($dir, $type);
        }
    }
}
