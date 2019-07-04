<?php
	header('Access-Control-Allow-Origin:*');
	header("Content-Type: text/json");
    function get_json($url){
        $json = file_get_contents($url);
        $arr = json_decode($json,true);
        return $arr;
    } 
    $tmp_url = "tmp_dento.json";
    $dento_url = "dento";
    $tmp = get_json($tmp_url);
    if($tmp["date"] < (time()-20))
    {
        passthru("wget http://tokyu-tid.s3.amazonaws.com/dento.json -O /home/t16901ky/public_html/abc/dento.gz");
        passthru("gzip -d dento.gz -f");
        $tmp = get_json($dento_url);
        $tmp["date"] = time();
        $dento = fopen('tmp_dento.json', 'w+b');
        fwrite($dento, json_encode($tmp));
        fclose($dento);
    }
    echo json_encode($tmp);
?>