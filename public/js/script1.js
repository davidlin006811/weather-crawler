window.onload = function() {
  $.getJSON('../weather.json', function(data){

    console.log(currentWeather);
    var weather = data.weather;
    $('.location').find('h1').text(weather["city"]);
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
    if (winSpeed.length > 2)
    {
      var speed = winSpeed.slice(0,2);
      var gust = winSpeed.slice(2);
      gust = gust.slice(0, 4) + " " +gust.slice(4);
      $('.wind-speed').text(speed + ' km/h ' + gust);
    }
    else {
        $('.wind-speed').text(winSpeed + ' km/h ');
    }

    var availbleCol = 7;
    $.each(weather.weeklyWeather, function(){
      if (this["dayTemp"] == ""){
        availbleCol -= 1;

      }
      else {
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
        nightDiv.append('<div class= "night-condition">' + '<p>' + this["nightCondition"] +'</p>' + '</div>');



    })
  })
}
var dayList = $('<div class = "day-title"></div>');

var tableCreate = false;
$(document).ready(function() {
    $(".weather-navi").find('li').eq(0).on("click", function() {
        $('#hoursList').attr('class', 'hour-weather');
        $('#dayList').attr('class', 'hidden');
        $('#nightList').attr('class', 'hidden');
        $('#timeMenu').attr('class', 'hidden');
        if (!tableCreate) {
          $.getJSON('../24hours.json', function(data) {
              $.each(data.hourlyInfo, function() {
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
          })
        }

    });

    $(".weather-navi").find('li').eq(1).on("click", function() {
        $('#dayList').attr('class', 'day-list');
        $('#timeMenu').attr('class', 'time-menu');
        $('#nightList').attr('class', 'hidden');
        $('#hoursList').attr("class", 'hidden')
    });
    var leftOffset = 0;

    $('#nextArrow').on("click", function(event){
      event.preventDefault();
      if (leftOffset <= -1044) {
        return;
      }
      else{
        $('.list-inner').animate( {
          marginLeft: "-=87px"
        }, "fast");
        leftOffset -= 87;
      }

    });
    $('#preArrow').on("click", function(event){
      event.preventDefault();
      if (leftOffset == 0) {
        return;
      }
      else{
        $('.list-inner').animate( {
          marginLeft: "+=87px"
        }, "fast");
        leftOffset += 87;
      }

    });


    $('.time-menu').find('li').eq(0).on("click", function(){
        $('#dayList').attr("class", "day-list");
        $('#nightList').attr("class", "hidden");
    });

    $('.time-menu').find('li').eq(1).on("click", function(){
      $('#dayList').attr("class", "hidden");
      $('#nightList').attr("class", "night-list");
    })

})
