var express = require('express')
var Handlebars = require('handlebars');
var fs = require('fs')
var app = express()

var index_source   = ""
var index_template

var test_post = {title : "Test title",
		 content : "Test content",
		 time_uploaded: new Date(),
		 time_done  : null,
		 id : 1 }


fs.open('./index.html', 'r', function(err, fileToRead){
    if (!err){
	fs.readFile(fileToRead, {encoding: 'utf-8'}, function(err,data){
	    if (!err){
		index_source = data;
		index_template = Handlebars.compile(index_source);
	    } else{
		console.log("Count't read index ");
	    }
	});
    } else{
	console.log(err);
    }
});


app.get('/', function(req, res) {
    res.send(index_template({posts : [test_post]}))
})

app.post('/add-post', function(req,res) {
    console.log(req)
})

app.post('/mark-as-done', function(req,res){
    console.log(req)
})

app.listen(5000)
