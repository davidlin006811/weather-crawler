window.onload = function() {
    var canada = {
        "provinces": [
            { "Abbr": "AB", "Name": "Alberta" }, { "Abbr": "BC", "Name": "British Columbia" }, { "Abbr": "MB", "Name": "Manitoba" }, { "Abbr": "NB", "Name": "New Brunswick" },
            { "Abbr": "NL", "Name": "Newfoundland and Labrador" }, { "Abbr": "NS", "Name": "Nova Scotia" }, { "Abbr": "NT", "Name": "Northwest Territories" },
            { "Abbr": "NU", "Name": "Nunavut" }, { "Abbr": "ON", "Name": "Ontario" }, { "Abbr": "PE", "Name": "Prince Edward Island" }, { "Abbr": "QC", Name: "Quebec" },
            { "Abbr": "SK", "Name": "Saskatchewan" }, { "Abbr": "YT", "Name": "Yukon" }
        ]
    };
    var provinceAbbr;
    for (var i = 0; i < canada.provinces.length; i++) {
        if (canada.provinces[i]["Name"] == weather["province"]) {
            provinceAbbr = canada.provinces[i]["Abbr"];
            break;
        }
    }
    $('.location').find('h1').text(weather["city"] + ", " + provinceAbbr);
    $('.condition').find('h3').text(weather["condition"]);
    $('.high-temp-span').text(weather["highTemp"]);
    $('.low-temp-span').text(weather["lowTemp"]);
    $('.condition-bar').find('img').attr('src', ("../weather_icons/" + weather["image"] + ".svg"));
    $('.temp-wrap').find('p').text(weather["currentTemp"]);
    $('.hum-span').text(weather["currentHum"]);
    $('.col-sun-rise').find('span').text(weather["sunRise"]);
    $('.col-sun-set').find('span').text(weather["sunSet"]);
    $('.col-wind-direct').find('span').text(weather["windDirect"]);
    var winSpeed = weather["windSpeed"];
    if (winSpeed.length > 2) {
        var speed = winSpeed.slice(0, 2);
        var gust = winSpeed.slice(2);
        gust = gust.slice(0, 4) + " " + gust.slice(4);
        $('.wind-speed').text(speed + ' km/h ' + gust);
    } else {
        $('.wind-speed').text(winSpeed + ' km/h ');
    }

    var availbleCol = 7;
    $.each(weeklyWeather, function() {
        if (this["dayTemp"] == "") {
            availbleCol -= 1;

        } else {
            var weatherList = $('<div class = "weather-list"></div>');
            if (availbleCol < 7) {
                weatherList.css('width', '175px');
            }
            var day = $('<div class = "day"></div>');
            var dayTitle = $('<div class = "day-title"></div>');
            dayTitle.append('<p class = "weekday">' + this["weekDay"] + '</p>');
            dayTitle.append('<p>' + this["day"] + " " + this["month"] + '</p>');
            day.append(dayTitle);
            weatherList.append(day);

            var imgDiv = $('<div class = "col7"></div>');
            var img = $('<img>');
            imgDiv.append(img);

            if (availbleCol < 7) {
                imgDiv.attr('class', 'col6');
            }
            img.attr("src", ("../weather_icons/" + this["dayCondUrl"] + ".svg"));
            day.append(imgDiv);

            var dayTempDiv = $('<div class = "day-temp"></div>');
            dayTempDiv.append('<h3>' + this["dayTemp"] + '</h3>');
            day.append(dayTempDiv);

            day.append('<div class = "chance">' + '<p>' + "chance " + '<br>' + this["chance"] + '</p' + '</dvi>');
            day.append('<div class = "day-condition">' + '<p>' + this["dayCondition"] + '</p>' + '</div>');
            $('.day-list').append(weatherList);
        }
        if (this["nightTemp"] == "") {
            return;
        }
        var weatherList2 = $('<div class = "weather-list-night"></div>');
        $('#nightList').append(weatherList2);
        var nightDiv = $('<div class = "night"></div>');
        weatherList2.append(nightDiv);
        var nightTitle = $('<div class = "night-title"></div>');
        nightTitle.append('<p class = "weekday">' + this["weekDay"] + '</p>');
        nightTitle.append('<p>' + this["day"] + " " + this["month"] + '</p>');
        nightDiv.append(nightTitle);
        var nightImg = $('<img>');
        nightImg.attr("src", ("../weather_icons/" + this["nightCondUrl"] + ".svg"));
        nightDiv.append(nightImg);
        nightDiv.append('<div class = "night-temp">' + '<h3>' + this["nightTemp"] + '</h3>' + '</div>');
        nightDiv.append('<div class = "chance">' + '<p>' + "chance " + '<br>' + this["nightChance"] + '</p>' + '</div>');
        nightDiv.append('<div class= "night-condition">' + '<p>' + this["nightCondition"] + '</p>' + '</div>');
    })
}
var dayList = $('<div class = "day-title"></div>');

var tableCreate = false;
$(document).ready(function() {

    $(".nav-list").eq(0).find('a').on("click", function() {
        $('#hoursList').attr('class', 'hour-weather clearfix');
        $('#dayList').attr('class', 'hidden');
        $('#nightList').attr('class', 'hidden');
        $('#timeMenu').attr('class', 'hidden');
        if (!tableCreate) {

            $.each(hourlyWeather, function() {
                var dateDiv = $('<div class= "col-hour"></div>');
                var titleDiv = $('<div class = "hour-title"></div>');
                titleDiv.append('<p>' + this["date"] + '</p>');
                titleDiv.append('<p>' + this["time"] + '</p>');
                dateDiv.append(titleDiv);

                var tempDiv = $('<div class = "hour-temp"></div>');
                tempDiv.append('<h4>' + this["temp"] + " °C" + '</h4>');
                dateDiv.append(tempDiv);

                var imgDiv = $('<div class = "hour-img"></div>');
                var img = $('<img />');
                img.attr("src", ("../weather_icons/" + this["condImg"] + ".svg"));
                imgDiv.append(img);
                dateDiv.append(imgDiv);

                var condDiv = $('<div class = "hour-cond"></div>');

                condDiv.append('<p>' + this["cond"] + '</p>');
                dateDiv.append(condDiv);

                var windDiv = $('<div class = "hour-wind"></div>');
                windDiv.append('<p>' + "Wind" + '</p>')
                windDiv.append('<p>' + this["windDirect"] + '</p>');
                windDiv.append('<p>' + this["windSpeed"] + '</p>');
                windDiv.append('<p>' + "km/h" + '</p>');
                dateDiv.append(windDiv);

                if (this["lop"] != "Nil") {
                    var lopDiv = $('<div class = "lop"></div>');
                    lopDiv.append('<p>' + "L.O.P" + '</p>')
                    lopDiv.append('<p>' + this["lop"] + '</p>');
                    dateDiv.append(lopDiv);
                }

                if (this["humdiex"] != "") {
                    var humDiv = $('<div class = "humidex"></p>');
                    humDiv.append('<p>' + "Humidex" + '</p>')
                    humDiv.append('<p>' + this["humdiex"] + '</p>');
                    dateDiv.append(humDiv);
                }
                $('.list-inner').append(dateDiv);
                tableCreate = true;
            })
        }
    });

    $(".weather-navi-bar").eq(1).find('a').on("click", function() {
        $('#dayList').attr('class', 'day-list clearfix');
        $('#timeMenu').attr('class', 'time-menu clearfix');
        $('#nightList').attr('class', 'hidden');
        $('#hoursList').attr("class", 'hidden')
    });
    var leftOffset = 0;

    $('#nextArrow').on("click", function(event) {
        event.preventDefault();
        if (leftOffset <= -1044) {
            return;
        } else {
            $('.list-inner').animate({
                marginLeft: "-=87px"
            }, "fast");
            leftOffset -= 87;
        }
    });
    $('#preArrow').on("click", function(event) {
        event.preventDefault();
        if (leftOffset == 0) {
            return;
        } else {
            $('.list-inner').animate({
                marginLeft: "+=87px"
            }, "fast");
            leftOffset += 87;
        }
    });

    $('.time-list').eq(0).on("click", function() {
        $('#dayList').attr("class", "day-list clearfix");
        $('#nightList').attr("class", "hidden");
    });

    $('.time-list').eq(1).on("click", function() {
        $('#dayList').attr("class", "hidden");
        $('#nightList').attr("class", "night-list clearfix");
    });

    $("#txtInput").on("keyup", function() {
        var input = $(this).val().toUpperCase();
        if (!input.length) {
            $("#list").empty();
            return;
        }
        $("#list").empty();
        var para = { search: input };

        $.get('/searching', para, function(data) {
            try {
                for (var i = 0; i < 10; i++) {
                    $("#list").append('<li>' + data[i].city + ', ' + data[i].province + ', ' + data[i].country + '</li>');
                    $("li").addClass("list-group-item");
                }
            } catch (ex) {
                console.log('nothing')
            }

        })
    });

    $("body").on('click', '#list li', function() {
        $("#txtInput").val($(this).text());
    });

    setInterval(refresh, 30000);

})

var refresh = function() {
    var now = new Date();
    if (now.getMinutes() === 11) {
        location.reload();
    }
}
