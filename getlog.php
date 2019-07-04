<?php
    if(isset($_POST['comment'])){
        $testlog = $_POST['comment'];
        $testlog =",\n" .$testlog . ',"date":'. time() . '}';
        $a = fopen("testlog.json", "a");
        fwrite($a, $testlog);
        fclose($a);
    }
?>