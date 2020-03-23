var express = require('express');
var request = require('request');
var path = require('path');
var cheerio = require('cheerio');
var promise = require('promise');
var fs = require('fs');
var app = express();

app.use(express.static(path.join(__dirname, "public")));

var canada = {
    "provinces": [
        { "Abbr": "AB", Name: "Alberta" }, { "Abbr": "BC", Name: "British Columbia" }, { "Abbr": "MB", Name: "Manitoba" }, { "Abbr": "NB", Name: "New Brunswick" },
        { "Abbr": "NL", Name: "Newfoundland and Labrador" }, { "Abbr": "NS", Name: "Nova Scotia" }, { "Abbr": "NT", Name: "Northwest Territories" },
        { "Abbr": "NU", Name: "Nunavut" }, { "Abbr": "ON", Name: "Ontario" }, { "Abbr": "PE", Name: "Prince Edward Island" }, { "Abbr": "QC", Name: "Quebec" },
        { "Abbr": "SK", Name: "Saskatchewan" }, { "Abbr": "YT", Name: "Yukon" }
    ]
};


function getProvince(url, provinceName) { //return body
    return new promise(function(resolve, reject) {
        request(url, function(err, res, body) {
            if (err) {
                reject(err);
            } else {


                var $ = cheerio.load(body);

                // var uls = $('div[class = "well"]').eq(1).find('ul');
                //console.log(lis.length);
                var province_city = [];
                for (var m = 0; m < 3; m++) {
                    var lis = $('ul[class="list-unstyled col-sm-4"]').eq(m).find('li');

                    for (var i = 0; i < lis.length; i++) {

                        var a = lis.eq(i).find('a');
                        var cityName = a.text();
                        var cityUrl = a.attr('href').slice(12);
                        var city = { name: cityName, url: cityUrl };
                        province_city.push(city);
                        //console.log(city);

                    }
                }



                resolve({ province: provinceName, province_city });
            }
        })
    })
};




exports.scrapeCountry = function() {

    var country = []
    var index = 0;
    for (var i = 0; i < canada.provinces.length; i++) {
        index++;
        var url = "https://weather.gc.ca/forecast/canada/index_e.html?id=" + canada.provinces[i]["Abbr"]
        console.log(url);
        getProvince(url, canada.provinces[i]["Name"]).then(function(data) {
            //console.log(data);
            country.push(data);
            if (index === 13) {
                var json = JSON.stringify(country);
                fs.writeFile('public/cities.json', json, 'utf8', (err) => {
                    if (err) { console.log(err); } else {
                        console.log("scrape day and night weather and save successfully");

                    }
                })
            }
        })
    }

}