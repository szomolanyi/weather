
var w_api = {
  resp : {
    "wu": undefined,
    "ow": undefined
  },

  format_epoch_time: function(epoch) {
    var d=new Date(epoch*1000);
    return ("00"+d.getHours()).slice(-2)+":"+("00"+d.getMinutes()).slice(-2);
  },

  makeResp: function(r, dst_api) {
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
