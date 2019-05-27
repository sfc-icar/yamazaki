var ekilst=[];
var count=0;
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
    if(checkloc(position)!=0){
        alert("測定範囲外です");
    }

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
    for (let i=0;i<ekilst.length;i++){
        if (ekilst[i].endlat<=position.coords.latitude && ekilst[i].stlat>=position.coords.latitude && ekilst[i].endlong<=position.coords.longitude && ekilst[i].stlong>=position.coords.longitude){
            eki(geo_text,i,position);
            return 0;
        }else{
            try{
                if (((ekilst[i].endlat<=position.coords.latitude && ekilst[i+1].stlat>=position.coords.latitude) || (ekilst[i].endlat>=position.coords.latitude && ekilst[i+1].stlat<=position.coords.latitude)) && ((ekilst[i].endlong<=position.coords.longitude && ekilst[i+1].stlong>=position.coords.longitude) || (ekilst[i].endlong>=position.coords.longitude && ekilst[i+1].stlong<=position.coords.longitude))){
                    ekikan(geo_text,i,i+1)
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
    disp (res);
}
function eki(status,eki_id,position){
    var res = status + "列車位置:" + ekilst[eki_id].name +"駅\n";
    var stationlen = Math.sqrt((ekilst[eki_id].stlat - ekilst[eki_id].endlat)**2 + (ekilst[eki_id].stlong - ekilst[eki_id].endlong)**2);
    var car_number = Math.ceil(Math.sqrt((ekilst[eki_id].stlat - position.coords.latitude)**2 + (ekilst[eki_id].stlong - position.coords.longitude)**2)/stationlen*10);
    res +=  "乗車位置:"+ car_number +"両目\n";
    disp (res); 
}

function disp(res){
    document.getElementById("position_view").innerHTML = res;
}