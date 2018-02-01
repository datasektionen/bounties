var express = require('express')
var Handlebars = require('handlebars');
var fs = require('fs')
var app = express()

var index_source   = ""
var index_template;
fs.open('./index.html', 'r', function(err, fileToRead){
    if (!err){
	fs.readFile(fileToRead, {encoding: 'utf-8'}, function(err,data){
	    if (!err){
		index_source = data;
		index_template = Handlebars.compile(index_source);
	    }else{
		console.log("Count't read index ");
	    }
	});
    }else{
	console.log(err);
    }
});


app.get('/', function (req, res) {
    res.send(index_template({body : "Potatis"}))

})

app.listen(5000)
