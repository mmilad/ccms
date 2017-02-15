<?php
    
    include_once 'config/config.php';
    include_once "src/php/filemanager.php";
    include_once "src/php/schemaGen.php";

    $filemanager = new filemanager();

    $filemanager::checkDir(dev_path);
    $filemanager::checkDir(data_path);
    $filemanager::checkDir(theme_path);
    // $filemanager::schema(); // generates mods

$config = file_get_contents(SCHEMA_PATH);
$config = json_decode($config);
schemaGen::updateSchema(data_path, $config->data);

echo "schema saved!";

if(!file_exists(data_path."data.json")) {
    $pattern = "{".schemaGen::makeEntryPattern(data_path, $config->data)."}";

var_dump($pattern);
    $pattern = json_decode($pattern);
    $pattern = json_encode($pattern, JSON_PRETTY_PRINT);
    file_put_contents(data_path."data.json", $pattern);
}
header('Location: index.php');