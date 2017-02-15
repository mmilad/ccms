<html>
    <head>
        <?php


        include_once "config/config.php";
        include_once "src/php/dirloader.php";
        
        
        $schema = file_get_contents("./schema.json");        
        $txt = "<script>\n";
        $txt .= "var J = {};";
        $txt .= "var data = " . $schema . ";";
        $txt .= "</script>";
        // var_dump($txt);
        echo $txt;

        // loads all files by type in dir
        $load_config = array(
            "js" => "./src/js/",
            "css" => "./src/css/"
        );
        dirloader::init($load_config);
        ?>
        
        <script>        
            window.onload = function() {
                init();
                // load({"type":"modules","item":"head"});
                dataview();
            }
        </script>
    </head>
    <body>
    <a href="./schema.php">run schema</a>
        <div id="navBar"></div>
        <div id="showBar"></div>
    </body>
</html>