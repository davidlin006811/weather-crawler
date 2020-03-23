var express = require('express');
var request = require('request');
var path = require('path');
var cheerio = require('cheerio');
var promise = require('promise');
var fs = require('fs');
var app = express();
var jsonFile = require('../public/cities.json');
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, "public")));



var url = 'mongodb://localhost:27017/scraping-weather';

function access(dayUrl, hourlyInfo, provinceName, cityName) {
    return new promise(function(resolve, reject) {

        request('https://weather.gc.ca/city/pages/' + dayUrl, function(err, res, body) {
            if (err) {
                reject(err);
            } else {
                var $ = cheerio.load(body);
                var currentCondition = $('dd[class="mrgn-bttm-0"]').eq(2); //scrape current condition
                var cdn = currentCondition.text();
                var currentImgUrl = $('img[class="center-block mrgn-tp-md"]').eq(0).attr("src"); //scrape condition image
                var saveImg = currentImgUrl;
                try {
                    currentImgUrl = currentImgUrl.slice(14, 16);
                } catch (ex) {
                    currentImgUrl = saveImg;
                }
                //scrape city weathwer

                var city = cityName;
                var wDirect = $('dd[class = "longContent mrgn-bttm-0 wxo-metric-hide"]').eq(0).find('abbr').eq(0); //scrape wind direction
                var windDir = wDirect.text();
                var wSpeed = $('dd[class = "longContent mrgn-bttm-0 wxo-metric-hide"]').eq(0).contents().filter(function() { //scrape wind speed
                    return this.type === 'text';
                });
                var windSpeed = wSpeed.text().replace(/\s+/g, "");
                var tempScape = $('span[class="wxo-metric-hide"]').eq(0); //scrape current temperature
                var currentTemp = tempScape.text().replace(/\s+/g, "");
                var humScape = $('dl[class="dl-horizontal wxo-conds-col2"]').find('dd').eq(4);
                var currentHum = humScape.text().replace(/\s+/g, "");
                if (currentHum.length > 3) {
                    currentHum = "No Data";
                }

                //scrape day weather

                var date = new Date();
                var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var currentDay = date.getDate();
                var currentWeekday = weekdays[date.getDay()];
                var currentMonth = months[date.getMonth()];
                var moreweather;
                var weeklyWeather = [];
                var weekDay, month, date, dayCondUrl, dayTemp, dayCondition, nightCondUrl, nightTemp, nightCondition, nightChance;
                var increment = 0;
                var isFirstCellBlank = ($('th[scope="col"]').eq(0).attr('class') === 'blankcell');
                if (isFirstCellBlank) {
                    weekDay = currentWeekday;
                    month = currentMonth;
                    date = currentDay;
                    dayCondUrl = "";
                    dayTemp = "";
                    dayCondition = "";
                    nightCondUrl = $('img[class="center-block"]').eq(6).attr('src');
                    var nightTempScrape = $('span[class="low wxo-metric-hide"]').eq(0);
                    nightTemp = nightTempScrape.text().replace(/\s+/g, "");
                    nightChance = nightTempScrape.parent().next().text().replace(/\s+/g, "");
                    nightCondition = nightTempScrape.parent().next().next().text();
                    var dayInfo = {
                        "weekDay": weekDay,
                        "day": date,
                        "month": month,
                        "dayTemp": dayTemp,
                        "dayCondition": dayCondition,
                        "dayCondUrl": dayCondUrl,
                        "nightTemp": nightTemp,
                        "nightChance": nightChance,
                        "nightCondition": nightCondition,
                        "nightCondUrl": nightCondUrl.slice(14, 16)

                    };
                    weeklyWeather.push(dayInfo);
                    increment = 1
                }

                for (var i = 0; i < (7 - increment); i++) {

                    var dateScrape = $('.div-table').find('.div-column').eq(i + increment); //change from i + 1 to i
					dateScrape = dateScrape.find('.div-row1');
                    var dayScrape = $(dateScrape).find('strong'); //scrape day
                    weekDay = dayScrape.text().replace(/\s+/g, "");
                    month = $(dateScrape).find('abbr').text().replace(/\s+/g, "").substring(0,3);
					
					
                    if (!isFirstCellBlank && i === 0) {
                        dateType = $(dateScrape).find('a').contents().filter(function() {
                            return this.type == 'text';
                        });
                        date = dateType.text().replace(/\s+/g, "");
                    } else {
                        dateType = $(dateScrape).contents().filter(function() {
                            return this.type === 'text';
                        });
                        date = dateType.text().replace(/\s+/g, "");
                    }

                    dayCondUrl = $('img[class="center-block"]').eq(i).attr('src');
                    var buff = dayCondUrl;
                    try {
                        dayCondUrl = dayCondUrl.slice(14, 16);
                    } catch (ex) {
                        dayCondUrl = buff;
                    }
                    dayTemp = $('span[class="high wxo-metric-hide"]').eq(i).text().replace(/\s+/g, "");
                    dayCondition = $('p[class="mrgn-bttm-0"]').eq(2 * i + 1).text(); //2*i + 1 scrape condition
                    var per = $('p[class="mrgn-bttm-0 pop text-center"]').eq(i).text().replace(/\s+/g, "");
                    if (i === (6 - increment)) {
                        nightCondUrl = "";
                        nightTemp = "";
                        nightCondition = "";
                        nightChance = "";
                    } else {
                        nightCondUrl = $('img[class="center-block"]').eq(i + 7).attr('src');
                        var buff = nightCondUrl;
                        try {
                            nightCondUrl = nightCondUrl.slice(14, 16);
                        } catch (ex) {
                            nightCondUrl = buff;
                        }
                        var nightTempScrape = $('span[class="low wxo-metric-hide"]').eq(i + increment);
                        nightTemp = nightTempScrape.text().replace(/\s+/g, "");
                        nightChance = nightTempScrape.parent().next().text().replace(/\s+/g, "");
                        nightCondition = nightTempScrape.parent().next().next().text(); //2*i + 1 scrape condition
                    }

                    var dayInfo = {
                        "weekDay": weekDay,
                        "day": date,
                        "month": month,
                        "dayTemp": dayTemp,
                        "dayCondition": dayCondition,
                        "chance": per,
                        "dayCondUrl": dayCondUrl,
                        "nightTemp": nightTemp,
                        "nightChance": nightChance,
                        "nightCondition": nightCondition,
                        "nightCondUrl": nightCondUrl
                    };
                    weeklyWeather.push(dayInfo);
                }

                var highTemp = $('th[scope="row"]').eq(0).next().find('span[class="wxo-metric-hide"]').eq(0).text().replace(/\s+/g, "").replace(/\./g, "");
                var lowTemp = $('th[scope="row"]').eq(0).next().find('span[class="wxo-metric-hide"]').eq(1).text().replace(/\s+/g, "").replace(/\./g, "");
                var sunRise = $('th[scope="row"]').eq(1).next().text();
                var sunSet = $('th[scope="row"]').eq(2).next().text();
                var temp = {
                    "province": provinceName,
                    "city": city,
                    "condition": cdn,
                    "image": currentImgUrl,
                    "windDirect": windDir,
                    "windSpeed": windSpeed,
                    "currentTemp": currentTemp,
                    "highTemp": highTemp,
                    "lowTemp": lowTemp,
                    "currentHum": currentHum,
                    "sunRise": sunRise,
                    "sunSet": sunSet,
                    weeklyWeather,
                    hourlyInfo
                };
                return resolve(temp);
            }
        })
    })
};
var scrape = function(dayUrl, provinceName, cityName) {
    return new promise(function(resolve, reject) {
        var newPromise = scrapeHour(dayUrl);
        newPromise.then(function(data) {
            access(dayUrl, data, provinceName, cityName).then(function(data) {
                var result = data;
                var newUrl = 'mongodb://localhost:27017/scraping-weather';
                MongoClient.connect(newUrl, function(err, db) {

                    db.collection('cityWeather').insertOne(result, function(err, result) {

                        if (err) {
                            reject(err);
                        } else {
                            console.log("Inserted a document into the city weather collection.");
                            db.close();
                            return resolve("success");
                        }
                    });
                });
            });
        });
    })
}


var scrapeHour = function(url) {

    return new promise(function(resolve, reject) {

        request('https://weather.gc.ca/forecast/hourly/' + url, function(err, res, body) {
            if (err) {
                reject(err);

            } else {
                var $ = cheerio.load(body);
                var table = $('table[class="table table-striped table-hover table-condensed wxo-media"]');
                var rows = table.find('tbody').find('tr');
                var firstDay = rows.find('th').eq(0);
                var nextDay = rows.find('th').eq(1);
                var weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                var firstWeekDay = weekDay[new Date().getDay()];
                var secondWeekDay;
                if ((new Date().getDay() + 1) >= 6) {
                    secondWeekDay = "Sun";
                } else {
                    secondWeekDay = weekDay[new Date().getDay() + 1];
                }
                var hourlyInfo = [];
                for (var i = 1; i < rows.length; i++) {
                    var cells = rows.eq(i).find('td');
                    var time = cells.eq(0).text();
                    if (time == "") {
                        continue;
                    }
                    var temp = cells.eq(1).text();
                    var condImg = cells.eq(2).find('img').attr('src');
                    var cond = cells.eq(2).find('p').text();
                    var lop = cells.eq(3).text();
                    var windDirect = cells.eq(4).find('abbr').text().replace(/\s+/g, "");
                    var speedScape = cells.eq(4).contents().filter(function() {
                        return this.type === 'text';
                    });
                    var windSpeed = speedScape.text().replace(/^\s*|\s*$/g, "");
                    var humdiex = cells.eq(5).text().replace(/\s+/g, "");
                    var hourDay;
                    if (rows.eq(i).index() < nextDay.parent().index()) {
                        hourDay = firstWeekDay;
                    } else {
                        hourDay = secondWeekDay;
                    }
                    var info = {
                        date: hourDay,
                        time: time,
                        temp: temp,
                        condImg: condImg.slice(20, 22),
                        cond: cond,
                        lop: lop,
                        windDirect: windDirect,
                        windSpeed: windSpeed,
                        humdiex: humdiex
                    };
                    hourlyInfo.push(info);
                }
                var hoursWeather = { hourlyInfo };
                resolve(hourlyInfo);

            }
        });
    })
}

var removeCityWeather = function(db, callback) {
    db.collection('cityWeather').deleteMany({}, function(err, results) {
        callback();
    });
};

exports.removeAllData = function() {
    return new promise(function(resolve, reject) {
        var newUrl = 'mongodb://localhost:27017/scraping-weather';
        MongoClient.connect(newUrl, function(err, db) {
            if (err) {
                reject(err);
            } else {
                removeCityWeather(db, function() {
                    db.close();
                    resolve("success");
                });
            }
        });
    })
}

exports.addData = function() {
    var jsonFile = require('../public/cities.json');
    console.log("Update starts...");
    var promises = [];
    for (var i = 0; i < 13; i++) {
        for (var j = 0; j < jsonFile[i].province_city.length; j++) {
            var url = jsonFile[i].province_city[j].url;
            promises.push(scrape(url, jsonFile[i].province, jsonFile[i].province_city[j].name));

        }
    }
    Promise.all(promises).then(function() {
        console.log("Update finished on " + Date());
    }).catch(function() {
        console.log("Update failed");
    })
}


exports.getCity = function(req, res) {
    var name = req.query.search;
    var response = new Array();
    name = name.toUpperCase();
    for (var i = 0; i < 13; i++) {
        for (var j = 0; j < jsonFile[i].province_city.length; j++) {
            if (name == jsonFile[i].province_city[j].name.substring(0, name.length).toUpperCase()) {
                var obj = {
                    city: jsonFile[i].province_city[j].name,
                    province: jsonFile[i].province,
                    country: "CA"
                };
                response.push(obj);
            }
        }

    }
    res.send(response);
}

exports.repSubmit = function(req, res) {

    var receivedData = req.query.city;
    var destinationCity = receivedData.slice(0, receivedData.indexOf(","));
    var destinationProvince = receivedData.slice(receivedData.indexOf(",") + 2, receivedData.lastIndexOf(","));
    var url = 'mongodb://localhost:27017/scraping-weather';

    MongoClient.connect(url, function(err, db) {
        var currentWeather;
        db.collection('cityWeather').findOne({ 'province': destinationProvince, 'city': destinationCity }, function(err, doc) {
            if (err) res.json(err);
            else {
                db.close();
                var currentWeather = JSON.stringify(doc);
                res.render("home1.ejs", { currentWeather: currentWeather });
            }
        });
    })
}