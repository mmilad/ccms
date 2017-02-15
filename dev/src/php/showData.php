<?php
include_once './../../config/config.php';
include_once './filemanager.php';
class showData extends filemanager {

    static function getData($dir){
        $data = file_get_contents($dir."data.json");
        $schema = file_get_contents($dir."schema.json");
        $schema = json_decode($schema);
        $data = json_decode($data);
        $dataShow = "";
        foreach($schema as $key => $value){
            $dataShow .= static::form_data($dir, $value, $data);
        }
        // var_dump($data);
        // var_dump($schema);

        return $dataShow;
    }

    static function form_data($dir, $schema, $data){
        $str = "";
        $dataKey = $schema->label;
        $returnObject = "{";
        if($schema->type == "array"){
            $str .= "<div class='show_data_array'>";

            $str .= "<span>".$schema->label."</span>";
        $returnObject .= "\"key\":".json_encode($dir.$data->$dataKey).",";

            $str .= "</div>";
        }
        if($schema->type == "object"){
            $str .= "<div class='show_data_array'>";

            $str .= "<span>".$schema->label."</span>";

            $str .= "</div>";
        }
        if($schema->type == "string"){
            $str .= "<div class='show_data_array'>";

            $str .= "<span>".$schema->label."</span>";

            $str .= "</div>";
        }
        $returnObject .= "\"html\":".json_encode($str)."";
        $returnObject .= "}";
        // $returnObject['key'] = $dir.$data->$dataKey;
        return $returnObject;
    }
    public function show_data_form($requestData){
        $data_base = file_get_contents(data_path.$requestData."data.json");
        $data_schema = file_get_contents(data_path.$requestData."schema.json");
        $str = "{";
        $str .= "\"data\":".json_encode($data_base).",";
        $str .= "\"schema\":".json_encode($data_schema);
        $str .= "}";
        
        echo $str;
    }
}
$requestData = $_GET['data'];

// if(!$requestData){
    showData::show_data_form($requestData);
// } else {
//     showData::show_request_data($requestData);
// }