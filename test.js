// var mongoose = require('mongoose');
// var user = require('./models/user').user;
// mongoose.connect('mongodb://localhost/MongoDB');

// var query_doc = {
//     xh: "a",
//     userid: "bbb",
//     data: "String"
// };

// (function(){
//     user.count(query_doc, function(err, doc){
//         if(doc == 1){
//             console.log(query_doc.userid + ": login success in " + new Date());
//         }else{
//             console.log(query_doc.userid + ": login failed in " + new Date());
//         }
//     });
// })(query_doc);


var fs=require('fs');
var jade=require('jade');
var http = require('http');
var JsonObj=JSON.parse(fs.readFileSync('./output.json'));



http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});

	var html= jade.renderFile('./views/index.jade',{data:JsonObj});


	res.end(html);
}).listen(80);

console.log(JsonObj);


