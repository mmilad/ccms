<?php
        $data = $_GET['data'];
        include_once "filemanager.php";
        $fm = new filemanager();
        $fm::load($data);