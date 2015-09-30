	var http = require("http")
	var querystring = require('querystring')
	var cheerio = require('cheerio')
	var BufferHelper = require('bufferhelper')
	var iconv = require('iconv-lite')
	var zlib = require('zlib')
	var url = require('url')
	var fs=require('fs')
	var crypto = require('crypto')
	var exitt=false
	var _data=[];
	var passs={
		"201240922109":"050089",
		"201340922126":"950107",
		"201340922129":"093196",
		"201340922132":"huihui930817",
		"201340922123":"520520",
		"201340922124":"520520"
	}

	var xhfw="201340922101-201340922132,201240922109"


	var _url = "http://app.hnis.org/MUIInterface.asmx/ResultsQuery"


	
    //var $ = cheerio.load(html)
    function md5 (text) {
	  return crypto.createHash('md5').update(text).digest('hex');
	}

	function stringNumToArr(s) {
		var Arr=[]
		s.split(',').forEach(function (item) {
			if(item.indexOf('-')!=-1){
				var be=item.split('-')
				var sn=+be[0]
				var en=+be[1]
				for (var i = sn; i<=en; i++) {
					Arr.push(i+"")
				}

			}else{
				Arr.push(item)
			}
		})

		return Arr
	}

	function getdid(xhfw,callback,retdata) {
		
		var rangeArr=stringNumToArr(xhfw)
		var rangeLen=rangeArr.length
		var count=rangeLen

		console.log("开始抓取数据。。。")
		if(!retdata){
			retdata=[]
		}


		rangeArr.forEach(function (xh,index,xhfw) {
			// body...
		
		

			var ak = "agsvURNWGfPqrxLKF2ZW7b7f"
			var userId=xh

			var postData = querystring.stringify({
				'name' : userId+"",
				'password' : passs[userId]||"123456"
			})

			var options= {
				host:"www.dongman8.cn",
				port: 80,
				path:"/service/menu.php",
				method:"POST",
				headers:{
					'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
					'Accept-Encoding':'gzip, deflate',
					'Accept-Language':'zh-CN,zh;q=0.8',
					'Cache-Control':'max-age=0',
					'Connection':'keep-alive',
					'Content-Length':postData.length,
					'Content-Type':'application/x-www-form-urlencoded',
					'Cookie':'name=' + postData.name +'; password=' + postData.password,
					'Host':'www.dongman8.cn',
					'Origin':'http://www.dongman8.cn',
					'Referer':'http://www.dongman8.cn/service/',
					'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
				}
			};
			
			var bufferHelper = new BufferHelper();




			var req = http.request(options,function(res) {
				// console.log('Status: ' + res.statusCode)
				// console.log('headers: ' + JSON.stringify(res.headers))
				var chunks =[], data, encoding = res.headers['content-encoding'];

				res.on('data', function(chunk) {
					//console.log(Buffer.isBuffer(chunk))
					


					//console.log('chunk: ' + JSON.stringify(chunk))
					bufferHelper.concat(chunk)
				})

				res.on("end", function() {
					var buffer=bufferHelper.toBuffer();
					if(res.headers['content-encoding'].indexOf('gzip') != -1) {

						zlib.gunzip(buffer, function (err, decoded) {
		                     var html = decoded.toString()
		                     // console.log(html)
		                     var $= cheerio.load(html)
		                     var _url=$('div.other_background>h1+a').attr('href')
		                     var Id=url.parse(_url,true).query['id']



		                     console.log("正在抓取的 学号为 ["+ userId +"] 的数据\n还剩: ["+(count)+"] 条数据抓取。。。")
		                     if(Id==""){
		                     	 
		                     	 console.log("学号为 ["+ userId +"]的密码错误！请在配置文件中设置密码。。。")

		                     	 

		                     }else{

		                     	 retdata.push({
			                     	'userId':userId+"",
			                     	'Id':Id
			                     });

			                    
		                     }
		                     

		                     --count

		                     if(!count){
		                     	 callback(retdata)
		                     }
		                     
		                    
		                 });

					}
					// html = iconv.decode(body, 'UTF-8')
					// console.log(html)
					// console.log("请求完毕")
				})

				res.on("error", function(e) {
					--count
					console.log("Error: " + e.message)
				})


			} )

			req.write(postData)

			req.end()


		})

	}

    function loadCJ_JsonpCallback(userId,id,data) {
		console.log(userId,id,data['rList'].length)
		_data.push({
			"xh":userId,
			"id":id,
			"data":data
		})
		if(exitt){
			fs.writeFileSync('./output.json',JSON.stringify(_data));
			console.log("数据以成功抓取并保存到output.json中。")
			//var JsonObj=JSON.parse(fs.readFileSync('./output.json'));
			//console.log(JsonObj);
		}
	}

    getdid(xhfw,function(data) {
    	//console.log(data);

    	console.log("正在分析数据。。。")
// http://app.hnis.org/MUIInterface.asmx/ResultsQuery?callback=loadCJ_JsonpCallback&userId=20141114092017524&CardCode=20141114092017524&XN=&XQ=&ak=agsvURNWGfPqrxLKF2ZW7b7f&sign=a9632765cb4a4b771b78e8ef267618b8&_=1442408579353
// 356863bda6c4edb92990e67d7bb0a0d3
// a9632765cb4a4b771b78e8ef267618b8


		var nn=data.length;
    	data.forEach(function (item,index,arr) {

    		var userId=item.Id
    		var CardCode=userId
    		var XN=''
    		var XQ=''
    		var ak='agsvURNWGfPqrxLKF2ZW7b7f'
    		var sign=md5("userId=" + userId + "CardCode=" + CardCode + "XN=" + "XQ=" + ak)

    		var _url="http://app.hnis.org/MUIInterface.asmx/ResultsQuery?"+querystring.stringify({
    			"callback" : "loadCJ_JsonpCallback",
    			"userId" : userId,
	    		"CardCode" : CardCode,
	    		"XN" : XN,
	    		"XQ" : XQ,
	    		"sign" : sign,
	    		"ak" : ak,
	    		"t" : +new Date()
    		})

    		http.get(_url, function(res) {
    			var html = ""

    			res.on('data', function(data){
    				html+=data
    			})
//aa.substring(aa.indexOf("loadCJ_JsonpCallback(")+"loadCJ_JsonpCallback(".length,aa.length-1)
    			res.on('end', function(){

    				nn--

    				console.log(arr.length+":"+(index+1))
    				if(nn==0){
    					exitt=true
    				}


    				loadCJ_JsonpCallback(item.userId, userId, JSON.parse(html.substring(html.indexOf("loadCJ_JsonpCallback(")+"loadCJ_JsonpCallback(".length, html.length-1) ) )

    			})
    		}).on('error', function(e) {
    			console.log("Error: " + e.message)
    			nn--
    		})


    		//console.log(_url)
    	})
    	

    })
/*
var urll='http://app.hnis.org/MUIInterface.asmx/ResultsQuery
?callback=loadCJ_JsonpCallback
&userId=20141114092017146
&CardCode=20141114092017146
&XN=
&XQ=
&ak=agsvURNWGfPqrxLKF2ZW7b7f
&sign=716acf3512f07f10d8cbe27c7e91127d
&_=1442399464279"



var url2='http://app.hnis.org/MUIInterface.asmx/ResultsQuery
?callback=loadCJ_JsonpCallback
&userId=20141114092017524
&CardCode=20141114092017524
&XN=
&XQ=
&ak=agsvURNWGfPqrxLKF2ZW7b7f
&sign=a9632765cb4a4b771b78e8ef267618b8'
*/