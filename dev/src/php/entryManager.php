<?php

$req = json_decode($_GET['data']);

include_once './datamanager/main.php';
if($req->task == "tableDeleteEntry") {
    datamanager_main::tableDeleteEntry($req);
} else if($req->task == "tableUpdate") {
    datamanager_main::tableUpdate($req);
} else if($req->task == "tableInsert") {
    datamanager_main::tableInsert($req);
} else if($req->task == "saveMainObj") {
    datamanager_main::saveMainObj($req);
}
