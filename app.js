var express = require('express')
var Handlebars = require('handlebars');
var bodyParser = require("body-parser");
var fs = require('fs')
var app = express()

const { Pool, Client } = require('pg')

var index_source   = ""
var index_template

var test_post = {title : "Test title",
		 content : "Test content",
		 time_created: new Date(),
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

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    var pool = new Pool();

    pool.query("SELECT (id, title, content, time_created, time_done) FROM bounties ORDER BY time_created DESC", [],
	       (err, res) => {
		   if(err) {
		       console.log("Error whilst creating bounty:" , err.stack)
		       return
		   }
		   objects = []
		   res.forEach( r => objects.push({ 'id': r[0],
						    'title': r[1],
						    'content': r[2],
						    'time_created': r[3],
						    'time_done' : r[4]
						  }));
		   res.send(index_template({posts : objects}))
	       })

app.post('/add-post', function(req,res) {
    var pool = new Pool();
    pool.query(
	'INSERT INTO bounties (title, content, time_created) VALUES ($1,$2,$3) RETURNING id'
	, [req.body.title, req.body.content, new Date()],
	(err, res) => {
	    console.log("Created a new bounty id = ", res)
	    pool.end()
	    console.log(req.body)
	})
})

app.post('/mark-as-done', function(req,res){
    var pool = new Pool();
    pool.query('UPDATE bounties SET time_done = $2 WHERE id = $2)', [req.body.id, new Date()],
	       (err,res) => {
		   pool.end()
	       })
    res.redirect('/')
})


{
    var pool;
    try  {
	pool = new Pool()
    } catch(err){
	console.log("Couln't connect to the database")
	throw err
    }
    pool.query(" CREATE TABLE IF NOT EXISTS bounties(

		       id INT PRIMARY KEY NOT NULL,
		       title TEXT NOT NULL,
		       content TEXT NOT NULL,
		       time_created  TEXT NOT NULL,
		       time_done TEXT

		 );", [] ,
	       (err,res) =>
	       console.log("Ran creation query"))
}

app.listen(5000)
