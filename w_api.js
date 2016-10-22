
//http://api.wunderground.com/api/0673ed02d8436590/conditions/q/37.776289,-122.395234.json
var mock= {
  "wu": {
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
    },
    "sun_phase": {
      "sunrise": {
      "hour":"6",
      "minute":"05"
      },
      "sunset": {
      "hour":"19",
      "minute":"14"
      }
  }
  },
  ow: {
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
  }
};


var w_api = {
  resp : {
    "wu": undefined,
    "ow": undefined
  },

  format_epoch_time: function(epoch) {
    var d=new Date(epoch*1000);
    return ("00"+d.getHours()).slice(-2)+":"+("00"+d.getMinutes()).slice(-2);
  },

  makeResp: function(r, dst_api="wu") {
    if (dst_api === "wu") {
      this.resp.wu = {
        "city" : r.current_observation.observation_location.city,
        "description": r.current_observation.weather,
        "temp_c": r.current_observation.temp_c,
        "temp_f": r.current_observation.temp_f,
        "pressure": r.current_observation.pressure_mb,
        "humidity": r.current_observation.relative_humidity.replace(/%| /, ''),
        "wind_speed": r.current_observation.wind_kph/3.6,
        "wind_direction": r.current_observation.wind_degrees,
        "sunrise": r.sun_phase.sunrise.hour+":"+r.sun_phase.sunrise.minute,
        "sunset": r.sun_phase.sunset.hour+":"+r.sun_phase.sunset.minute,
        "icon" : wu_icons_map[r.current_observation.icon]
      };
    }
    else if (dst_api === "ow") {
      this.resp.ow = {
        "city" : r.name,
        "description": r.weather[0].main,
        "temp_c": Math.round(r.main.temp-273.15),
        "temp_f": Math.round((r.main.temp*9)/5-459.67),
        "pressure": r.main.pressure,
        "humidity": r.main.humidity,
        "wind_speed": r.wind.speed,
        "wind_direction": r.wind.deg,
        "sunrise": this.format_epoch_time(r.sys.sunrise),
        "sunset": this.format_epoch_time(r.sys.sunset),
        "icon": ow_icons_map[r.weather[0].icon]
      };
    }
    else {
      alert("Not implemented"); 
    }
  },

  makeWUResp: function(r) {
    this.makeResp(r, "wu");
    return this.resp.wu;
  },

  makeOWResp: function(r) {
    this.makeResp(r, "ow");
    return this.resp.ow;
  },

  getPos: function() {
    var deffered=$.Deferred();
    var geo=navigator.geolocation;
    var pos={
        "lon":17.11,
        "lat":48.15
    };
    if (geo) {
        geo.getCurrentPosition(function(position) {
            pos.lon=Math.round(position.coords.longitude*1000)/1000;
            pos.lat=Math.round(position.coords.latitude*1000)/1000;
            pos.err="";
            deffered.resolve(pos);
            
        }, function(error) {
            pos.err=error.code+" "+error.message;
            deffered.resolve(pos);
      });
    }
    else {
        pos.err="Location not supported";
        deffered.resolve(pos); /* using default */
    }
    return deffered.promise();
  },

  getData: function(flag_mock, dst_api) {
    if (flag_mock) {
      this.makeResp(mock[dst_api], dst_api);
    }
    if (this.resp[dst_api] === undefined) {
      return this.getPos().then(function(pos) {
        if (dst_api === "wu") {
          return $.getJSON("https://api.wunderground.com/api/0673ed02d8436590/conditions/astronomy/q/"+pos.lat+","+pos.lon+".json")
            .then(function(r) {
              return w_api.makeWUResp(r);
            });
        }
        else if (dst_api === "ow") {
          return $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+pos.lat+"&lon="+pos.lon+"&APPID=08c264711f9ddd89e8aadccc26c148db")
            .then(function(r) {
              return w_api.makeOWResp(r);
            });
        }  
      });
    }
    else {
      var deffered=$.Deferred();
      deffered.resolve(this.resp[dst_api]);
      return deffered.promise();
    };
  }
};
