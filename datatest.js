// var mongoose = require('mongoose');
var user = require('./models/user').user;
// mongoose.connect('mongodb://127.0.0.1:12345/imooc');

var query_doc = {
    user: "aabb"
};

(function(){
    user.count(query_doc, function(err, doc){
        if(doc == 1){
            console.log(query_doc.user + ": login success in " + new Date());
        }else{
            console.log(query_doc.user + ": login failed in " + new Date());
        }
        console.log(err,doc)
    });
})(query_doc);
