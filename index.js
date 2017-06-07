
var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var querystring=require('querystring');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('week');
	
});

app.get('/history', function(req,res){
	new MongoHelper({
		db:'weekplans',
		collection:'planHistory',
		operation:'find',
		then:function(docs){res.render('history',{docs:docs})}
	});
});

app.put('/history', function(req,res){
	var body=[];
	req.on("data",function(chunk){
		body.push(chunk);
	}).on("end",function(){
		body=Buffer.concat(body).toString();
		var data=querystring.parse(body);
		new MongoHelper({
			db:'weekplans',
			collection:'planHistory',
			operation:'insert',
			data:data,
			then:function(success){res.send(success)}
		});
	});
});


app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});




//code from internet
function MongoHelper(params){
	var helper=this;
	init("admin1","admin");

	function init(username,password){
		var url=["mongodb://",username,":",password,"@ds111622.mlab.com:11622/",params.db].join("");
		MongoClient.connect(url,function(err,db){
			if(err) throw err;
			helper.db=db;// get db
			helper.collection=db.collection(params.collection);// get collection

			switch(params.operation){// call correct operation
				case "insert":helper.insert();break;
				case "find":helper.find();break;
				case "post":break;
			}
		});
	}
	this.find=function(){
		var docs=[];
		var cursor=helper.collection.find();
		cursor.each(function(err,doc){
			if(err) throw err;
			if(doc!=null){
				docs.push(doc);
			}else{
				helper.db.close();
				params.then(docs);
			}
		});
	}
	this.insert=function(){
		this.collection.insertOne({operation:params.data.operation},function(err,result){
			if(err) throw err;
			helper.db.close();
			params.then(result);
		});
	}
}