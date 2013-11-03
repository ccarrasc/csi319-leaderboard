/**
 * New node file
 */
var https = require('https');
var rest = require('restler');
var cheerio = require('cheerio');
var async = require('async');
var apps = require('../data/apps.json');

var getAppListing = function(app, callback) {
	var request = rest.get(app.url);
	request.once('complete', function(result) {
		$ = cheerio.load(result);		
		app.title = $(".document-title[itemprop='name']").text().trim();
		app.developerName = $(".document-subtitle.primary[itemprop='name']").text().trim();
		app.numberOfInstalls = $(".content[itemprop='numDownloads']").text().trim().split(" ")[0];
		callback();
	});    
};


exports.list = function(req, res) {
	
	async.eachSeries(apps, getAppListing, function(err){
		if(err) {
			console.log(err);
		}
		res.json(apps);
	});
};