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

console.log(stringNumToArr("201340965125"))