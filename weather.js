/*
Weather underground :
0673ed02d8436590
    https://www.wunderground.com/weather/api/d/docs?d=resources/apigee-console
*/
var mock_wu=
{
  "response":  {
    "version": "0.1",
    "termsofService": "http://www.wunderground.com/weather/api/d/terms.html",
    "features":  {
      "conditions": 1
    }
  },
  "current_observation":  {
    "image":  {
      "url": "http://icons.wxug.com/graphics/wu2/logo_130x80.png",
      "title": "Weather Underground",
      "link": "http://www.wunderground.com"
    },
    "display_location":  {
      "full": "San Francisco, CA",
      "city": "San Francisco",
      "state": "CA",
      "state_name": "California",
      "country": "US",
      "country_iso3166": "US",
      "zip": "94105",
      "magic": "1",
      "wmo": "99999",
      "latitude": "37.770000",
      "longitude": "-122.390000",
      "elevation": "8.00000000"
    },
    "observation_location":  {
      "full": "Capgemini AIE, San Francisco, California",
      "city": "Capgemini AIE, San Francisco",
      "state": "California",
      "country": "US",
      "country_iso3166": "US",
      "latitude": "37.779354",
      "longitude": "-122.394745",
      "elevation": "26 ft"
    },
    "estimated":  {},
    "station_id": "KCASANFR1002",
    "observation_time": "Last Updated on October 19, 7:42 AM PDT",
    "observation_time_rfc822": "Wed, 19 Oct 2016 07:42:23 -0700",
    "observation_epoch": "1476888143",
    "local_time_rfc822": "Wed, 19 Oct 2016 07:42:27 -0700",
    "local_epoch": "1476888147",
    "local_tz_short": "PDT",
    "local_tz_long": "America/Los_Angeles",
    "local_tz_offset": "-0700",
    "weather": "Partly Cloudy",
    "temperature_string": "55.6 F (13.1 C)",
    "temp_f": 55.6,
    "temp_c": 13.1,
    "relative_humidity": "82%",
    "wind_string": "From the WNW at 2.1 MPH Gusting to 3.0 MPH",
    "wind_dir": "WNW",
    "wind_degrees": 292,
    "wind_mph": 2.1,
    "wind_gust_mph": "3.0",
    "wind_kph": 3.4,
    "wind_gust_kph": "4.8",
    "pressure_mb": "1022",
    "pressure_in": "30.19",
    "pressure_trend": "+",
    "dewpoint_string": "50 F (10 C)",
    "dewpoint_f": 50,
    "dewpoint_c": 10,
    "heat_index_string": "NA",
    "heat_index_f": "NA",
    "heat_index_c": "NA",
    "windchill_string": "NA",
    "windchill_f": "NA",
    "windchill_c": "NA",
    "feelslike_string": "55.6 F (13.1 C)",
    "feelslike_f": "55.6",
    "feelslike_c": "13.1",
    "visibility_mi": "10.0",
    "visibility_km": "16.1",
    "solarradiation": "--",
    "UV": "0",
    "precip_1hr_string": "0.00 in ( 0 mm)",
    "precip_1hr_in": "0.00",
    "precip_1hr_metric": " 0",
    "precip_today_string": "0.00 in (0 mm)",
    "precip_today_in": "0.00",
    "precip_today_metric": "0",
    "icon": "partlycloudy",
    "icon_url": "http://icons.wxug.com/i/c/k/partlycloudy.gif",
    "forecast_url": "http://www.wunderground.com/US/CA/San_Francisco.html",
    "history_url": "http://www.wunderground.com/weatherstation/WXDailyHistory.asp?ID=KCASANFR1002",
    "ob_url": "http://www.wunderground.com/cgi-bin/findweather/getForecast?query=37.779354,-122.394745",
    "nowcast": ""
  }
};

//Open weather API key = "08c264711f9ddd89e8aadccc26c148db"
//http://api.openweathermap.org/data/2.5/weather?lat=48.148&lon=17.107&APPID=08c264711f9ddd89e8aadccc26c148db

/* TODO : 
    convert sunrise and sunset to hours + minutes 
    show temperatures in celzius or in Farnheit
*/


"use strict";


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
        //$(elem).html(content + $(elem).html());
        $(elem).html(content);
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
    /*
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+pos.lat+"&lon="+pos.lon+"&APPID=08c264711f9ddd89e8aadccc26c148db")
        .done(function(r){
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
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $("div#position_error").html(textStatus+":"+errorThrown);
        });
    */
    /*var r=mock.wo;
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
    fill_element("#l_sunset",format_time(r.sys.sunset));*/
    w_api.getData(true, "ow")
        .done(function(r1) {
            console.log(r1);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus+errorThrown);
        });
}

$(document).ready(function() {
    //var pos=get_pos(pos_callback);
    fill_data("wu");
});

function fill_data(dst_api="wu", flag_mock="false") {
    w_api.getData(flag_mock, dst_api)
        .done(function(r) {
            fill_element("#l_city", r.city);
            fill_element("#l_description",r.description);
            init_temperature(r.temp_c+273.15);
            $("#l_icon").attr("class", "important wi "+r.icon);
            //$("#l_icon").attr("class", "wi "+icons_map[r.weather[0].icon]);
            //fill_element("#l_clouds",r.clouds.all);
            fill_element("#l_pressure",Math.round(r.pressure));
            fill_element("#l_humidity",Math.round(r.humidity));
            fill_element("#l_wind_speed",Math.round(r.wind_speed));
            fill_element("#l_wind_direction",Math.round(r.wind_direction));
            fill_element("#l_sunrise",r.sunrise);
            fill_element("#l_sunset",r. sunset);
            if (dst_api === "wu") {
                $("a#a-wu-api").css("font-size", "1em");
                $("a#a-ow-api").css("font-size", "0.8em");
            }
            else {
                $("a#a-ow-api").css("font-size", "1em");
                $("a#a-wu-api").css("font-size", "0.8em");
            }
            
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            var error = "<p>Error retrieving data from ";
            if (dst_api === "wu") 
                error += "Weather underground ";
            else
                error += "Open Weather Map ";
            error+="API</p>";
            error+="<p>"+textStatus+errorThrown+"</p>";
            //$("div#position_error").html(error).css("display":"block");
            console.log(textStatus+errorThrown);
        });
}
