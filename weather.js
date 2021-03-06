
"use strict";

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

$(document).ready(function() {
    $("#err_close").click( function() {
        $("div#error_box").css("display", "none");
    });

    fill_data("wu", false);

});

function close_window() {
    $("div#error_box").hide(500);
}

function fill_data(dst_api, flag_mock) {
    w_api.getData(flag_mock, dst_api)
        .done(function(r) {
            fill_element("#l_city", r.city + ", " + r.time);
            fill_element("#l_description",r.description);
            init_temperature(r.temp_c+273.15);
            $("#l_icon").attr("class", "important wi "+r.icon);
            fill_element("#l_pressure",Math.round(r.pressure));
            fill_element("#l_humidity",Math.round(r.humidity));
            fill_element("#l_wind_speed",Math.round(r.wind_speed));
            fill_element("#l_wind_direction",Math.round(r.wind_direction));
            fill_element("#l_sunrise",r.sunrise);
            fill_element("#l_sunset",r. sunset);
            if (dst_api === "wu") {
                /*$("a#a-wu-api").css("font-size", "1em");
                $("a#a-ow-api").css("font-size", "0.8em");*/
                $("a#a-wu-api").attr("class", "active");
                $("a#a-ow-api").attr("class", "inactive");
            }
            else {
                $("a#a-ow-api").attr("class", "active");
                $("a#a-wu-api").attr("class", "inactive");
                /*
                $("a#a-ow-api").css("font-size", "1em");
                $("a#a-wu-api").css("font-size", "0.8em");
                */
            }
            
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus+"&nbsp;"+errorThrown);
            var error="";
            if (textStatus === "Position unresolved") {
                error+="<p>Unable to resolve position. Please check, if location tracking is enabled in Your browser.</p>";
                error+="<p>Error: " + errorThrown+ "</p>";
                $("div#error_header").html("Error resolving position");
            }
            else {
                error += "<p>Error retrieving data from ";
                if (dst_api === "wu") 
                    error += "Weather underground API.</p>";
                else {
                    error += "Open Weather Map API.</p>";
                    error += "<p>Open Weather API is currently used over http. Cross-domain http requests are denied in most browsers, if page is served over https. Currently (10.2016), it is possible to disable this error in Chrome browser.</p>"
                }
                error+="<p>Error: "+textStatus+"&nbsp;"+errorThrown+"</p>";
                $("div#error_header").html("Error getting data from weather API");
            }
            $("div#error_msg").html(error);
            $("div#error_box").show(500);
        });
}
