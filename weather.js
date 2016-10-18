//Open weather API key = "08c264711f9ddd89e8aadccc26c148db"
//http://api.openweathermap.org/data/2.5/weather?lat=48.148&lon=17.107&APPID=08c264711f9ddd89e8aadccc26c148db

/* TODO : 
    convert sunrise and sunset to hours + minutes 
    show temperatures in celzius or in Farnheit
*/


"use strict";

var mock={
    "coord":{
        "lon":17.11,
        "lat":48.15
    },
    "weather":[
        {"id":800,
        "main":"Clear",
        "description": "clear sky",
        "icon":"01d"
        }
    ], //http://openweathermap.org/weather-conditions
    "base":"stations",
    "main":{
        "temp":283.768,  // templota Kelvin
        "pressure":1015.45, //tlak
        "humidity":78, //vlhkost %
        "temp_min":283.768, 
        "temp_max":283.768,
        "sea_level":1030.6,
        "grnd_level":1015.45
    },
    "wind":{
        "speed":2.41, // rychost vetra
        "deg":346.001  // smer vetra
    },
    "clouds":{"all":0}, // percentualna hodnota mraky
    "dt":1475848834,
    "sys":{
        "message":0.0043,
        "country":"SK",
        "sunrise":1475816434,
        "sunset":1475857010
    },
    "id":3060972,
    "name":"Bratislava",
    
    "cod":200
};

var icons_map={
    //clear 
    "01d": "wi-day-sunny",
    "01n": "wi-night-clear",
    //few clouds
    "02d": "wi-day-cloudy",
    "02n": "wi-night-cloudy",
    //scattered clouds
    "03d": "wi-cloud",
    "03n": "wi-cloud",
    //broken clouds
    "04d": "wi-cloudy",
    "04n": "wi-cloudy",
    //shower rain
    "09d": "wi-day-rain",
    "09n": "wi-night-rain",
    //rain
    "10d": "wi-rain",
    "10n": "wi-rain",
    //thunder storm
    "11d": "wi-thunderstorm",
    "11n": "wi-thunderstorm",
    //snow
    "13d": "wi-snow",
    "13n": "wi-snow",
    //mist
    "50d": "day-haze",
    "50n": "wi-cloudy"
};

function get_pos() {
    var geo=navigator.geolocation;
    var pos={
        "lon":17.11,
        "lat":48.15
    };
    if (geo) {
        geo.getCurrentPosition(function(position) {
            pos.lon=Math.round(position.coords.longitude*100)/100;
            pos.lat=Math.round(position.coords.latitude*100)/100;
            pos_callback(pos);
            
        }, function(error) {
            pos.err=error.code+" "+error.message;
            pos_callback(pos);
      });
    }
    else {
        pos.err="Location not supported";
        pos_callback(pos);
    }
}

function fill_element(elem, content) {
    if (content !== undefined) {
        $(elem).html(content + $(elem).html());
    }
}

function k2c(k) {
    return Math.round(k-273.15);
}
function k2f(k) {
    return Math.round((k*9)/5-459.67);
}

function init_temperature(value) {
    $("#l_temp_value")
        .attr("data-kelvin", value)
        .attr("data-unit", "F");
    fill_temperature(); //Celsius is default
}

function fill_temperature() {
    var k=$("#l_temp_value").attr("data-kelvin");
    var u=$("#l_temp_value").attr("data-unit");
    if (u==="F") {
        //switch to C
        $("#l_temp_value")
            .html(k2c(k) + ' &deg;C')
            .attr("data-unit", "C");
        $("#l_temp_unit").html(' &deg;F');
    }
    else {
        //switch to F
        $("#l_temp_value")
            .html(k2f(k) + ' &deg;F')
            .attr("data-unit", "F");
        $("#l_temp_unit").html(' &deg;C');
    }
}
function format_time(epoch) {
    var d=new Date(epoch*1000);
    return ("00"+d.getHours()).slice(-2)+":"+("00"+d.getMinutes()).slice(-2);
}

function pos_callback(pos) {
    $("div#position_trace").html(pos.lon+";"+pos.lat);
    if (pos.hasOwnProperty("err")) {
        $("div#position_error").html(pos.err);
    }
    //$("#l_city").html(mock.name);
    var r=mock;
    fill_element("#l_city", r.name);
    fill_element("#l_description",r.weather[0].main);
    init_temperature(r.main.temp);
    $("#l_icon").attr("class", "wi "+icons_map[r.weather[0].icon]);
    fill_element("#l_clouds",r.clouds.all);
    fill_element("#l_pressure",Math.round(r.main.pressure));
    fill_element("#l_humidity",Math.round(r.main.humidity));
    fill_element("#l_wind_speed",Math.round(r.wind.speed));
    fill_element("#l_wind_direction",Math.round(r.wind.deg));
    fill_element("#l_sunrise",format_time(r.sys.sunrise));
    fill_element("#l_sunset",format_time(r.sys.sunset));
}

$(document).ready(function() {
    var pos=get_pos(pos_callback);
});
