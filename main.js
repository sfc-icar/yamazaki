var ekilst=[];
var count=0;
var train_list=[];
var heading=0;
var send_log;
var tmp;
var poshitions;
var flag;
//
function nobori(){heading=1;}
//
$.getJSON('data.json',function(data){
    alert("成功");
    ekilst = data;
})
function test_delta(){
    $.getJSON('delta.json',function(data){
        alert("成功");
        ekilst = data;
    })
}
function readjson(data){
    ekilst = data;
}
function getloc(){
    navigator.geolocation.watchPosition(getloc_success, getloc_fail, {"enableHighAccuracy": true, "timeout": 20000, "maximumAge": 2000});
}
function getloc_success(position){
    poshitions = position;
    get_train();
    if(checkloc(position)!=0){
        //alert("測定範囲外です");
    }
    send_log = '{"latitude":'+position.coords.latitude+',"longitude":'+position.coords.longitude;

}
function getloc_fail(e){
    alert(e.message);
}

function checkloc(position){
    count++;
    var geo_text = "緯度:" + position.coords.latitude + "\n";
    geo_text += "経度:" + position.coords.longitude + "\n";
    geo_text += "位置精度:" + position.coords.accuracy + "m\n";
    geo_text += "移動方向:" + position.coords.heading + "\n";
    geo_text += "速度:" + position.coords.speed + "\n";

    var date = new Date(position.timestamp);

    geo_text += "取得時刻:" + date.toLocaleString() + "\n";
    geo_text += "取得回数:" + count + "\n\n";
    if (position.coords.heading != null){
        if (position.coords.heading > 0 && position.coords.heading < 90){
            geo_text += "上り\n"
            heading = true;
        }else{
            if(position.coords.heading > 180 && position.coords.heading < 270){
                geo_text += "下り\n"
                heading = false;
            }
        }
    }
    for (let i=0;i<ekilst.length;i++){
        if ((ekilst[i].endlat<=position.coords.latitude && ekilst[i].stlat>=position.coords.latitude) || (ekilst[i].endlong<=position.coords.longitude && ekilst[i].stlong>=position.coords.longitude)){
            eki(geo_text,i,position);
            return 0;
        }else{
            try{
                if (((ekilst[i].endlat<=position.coords.latitude && ekilst[i+1].stlat>=position.coords.latitude) || (ekilst[i].endlat>=position.coords.latitude && ekilst[i+1].stlat<=position.coords.latitude)) && ((ekilst[i].endlong<=position.coords.longitude && ekilst[i+1].stlong>=position.coords.longitude) || (ekilst[i].endlong>=position.coords.longitude && ekilst[i+1].stlong<=position.coords.longitude))){
                    ekikan(geo_text,i,i+1);
                    return 0;
                }
            }catch(e){
                disp(geo_text);
                return 1;
            }
        }        
    }
}
function ekikan(status,eki1_id,eki2_id){
    var res = status + "列車位置:"+ ekilst[eki1_id].name + "-" + ekilst[eki2_id].name + "\n";
    for (i = 0; i < train_list.trains.length; i++){
        if (heading == false && train_list.trains[i].up == false){
            if (eki1_id + 114 == train_list.trains[i].section_id){
                res +=  "列車番号:"+ train_list.trains[i].operation_number +"番列車\n"
                send_log = send_log + ',"number":'+train_list.trains[i].operation_number+',"section_id":'+train_list.trains[i].section_id;
                send_log = send_log + ',"up":false';
                break;
            }
        }else{
            if(heading == true && train_list.trains[i].up == true){
                if (eki1_id + 87 == train_list.trains[i].section_id){
                    res +=  "列車番号:"+ train_list.trains[i].operation_number +"番列車\n"
                    send_log = send_log + ',"number":'+train_list.trains[i].operation_number+',"section_id":'+train_list.trains[i].section_id;
                    send_log = send_log + ',"up":ture';
                    break;
                }
            }
        }
    }
    disp (res);
}
function eki(status,eki_id,position){
    var res = status + "列車位置:" + ekilst[eki_id].name +"駅\n";
    var stationlen = Math.sqrt((ekilst[eki_id].stlat - ekilst[eki_id].endlat)**2 + (ekilst[eki_id].stlong - ekilst[eki_id].endlong)**2);
    var car_number = Math.ceil(Math.sqrt((ekilst[eki_id].stlat - position.coords.latitude)**2 + (ekilst[eki_id].stlong - position.coords.longitude)**2)/stationlen*10);
    res +=  "乗車位置:"+ car_number +"両目\n";
    for (i = 0; i < train_list.trains.length; i++){
        if ((ekilst[eki_id].st_id == train_list.trains[i].station_id) && (heading == train_list.trains[i].up)){
            res +=  "列車番号:"+ train_list.trains[i].operation_number +"番列車\n"
            send_log = send_log + ',"number":'+train_list.trains[i].operation_number+',"station_id":'+train_list.trains[i].station_id+',"carnumber":'+car_number;
            if(heading == true){
                send_log = send_log + ',"up":true';
            }else{
                if(heading == false){
                    send_log = send_log + ',"up":false';
                }
            }
            break;
        }
    }
    disp (res); 
}
function get_train(){
    $.getJSON('https://web.sfc.keio.ac.jp/~t16901ky/abc/dento.php',function(data){
        train_list = data;
    })
}
function disp(res){
    tmp = send_log;
    document.getElementById("position_view").innerHTML = res;
}
var sendjson= function(){
    if (!(document.getElementById("comment").value)){
        
    }else{
        tmp = tmp + ',"comment":"' + document.getElementById("comment").value + '"';
    }

    $.ajax({
        type: "POST",
        url: "https://web.sfc.keio.ac.jp/~t16901ky/abc/getlog.php",
        data: {
            "comment": tmp
        },
     });
    if (flag==true){
        setTimeout(sendjson,15000);
    }
}
function sanju(){
    flag = true;
}
function teishi(){
    flag = false;
}   