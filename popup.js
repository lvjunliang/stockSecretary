var symbolList = ["sz002296" , "sz000651" , "sh601006" , "sh600125"];
var stockNameList = {};
$("#hqBtn").click(function(){
	options = {};
	$( "#minlineUL" ).hide();
	$( "#hqTable" ).show( "drop", options, 500 );
	//$( "#minlineUL" ).toggle( "drop", options, 500 );
});
$("#minlineBtn").click(function(){
	options = {};
	$( "#hqTable" ).hide();
	$( "#minlineUL" ).show( "drop", options, 500 );
	//$( "#hqTable" ).toggle( "drop", options, 500 );
});
function showHQ(){
	var hqPrefix = "http://hq.sinajs.cn/rn=@&format=text&list=";
	var hqURL = hqPrefix + symbolList.join(",");
	var hqStr = getHQ(hqURL , renderList);
	function renderList(hqStr){
		var allStock = formatAllStock(hqStr);
		$("#stockList").html("");
		for(var i = 0 ; i < allStock.length ; i++){
			stockInfo = allStock[i];
			stockNameList[stockInfo.symbol] = stockInfo.name;
			var className = stockInfo.chg >= 0 ? "priceup" : "pricedown";
			tr = "<tr class='"+ className +"'>";
			tr += "<td>"+ stockInfo.name+"</td><td>" + stockInfo.price + "</td><td>"+stockInfo.chg+"</td><td>"+stockInfo.chgRate+"%</td>";
			tr += "<td>";
			tr += "<button type='button' data='" + stockInfo.symbol + "' class='chartBtn btn btn-mini label-danger'>走势图</button>&nbsp;";
			tr += "<button type='button' data='"+stockInfo.symbol+"' class='newsBtn btn btn-mini label-info'>新闻</button>";
			tr += "</td>";
			tr += "</tr>";
			$("#stockList").append(tr);
		}
		showMinline();
	}
}
function showMinline(){
	console.log(stockNameList);
	var minlineURL = "http://image.sinajs.cn/newchart/small/b@@@@@@.gif";
	var symbol;
	$("#minlineUL").html("");
	for(var i=0 ; i < symbolList.length ; i++){
		symbol = symbolList[i];
		console.log(symbol);
		console.log(stockNameList[symbol]);
		li = "<li><img src='"+ minlineURL.replace(/@@@@@@/ , symbol) +"' /><div>"+ stockNameList[symbol]+"</div></li>";
		$("#minlineUL").append(li);
	}
}
showHQ();
//window.setInterval( showHQ , 4000);
function getHQ(url , callback){
	try {
		var xhr = new window.XMLHttpRequest();
		xhr.open("GET", url , true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				callback(xhr.responseText);
			}
		}
		xhr.send();
	} catch(e) { console.error(e); }
};
function formatOneStock(hqStr){
	var elements = hqStr.split("=");
	if(elements.length != 2) return false;
	var stockInfo = {};
	stockInfo.symbol = elements[0];
	elements = elements[1].split(",");
	stockInfo.name = elements[0];
	stockInfo.open= parseFloat(elements[1]).toFixed(2);
	stockInfo.close= parseFloat(elements[2]).toFixed(2);
	stockInfo.price= parseFloat(elements[3]).toFixed(2);
	stockInfo.high = parseFloat(elements[4]).toFixed(2);
	stockInfo.low = parseFloat(elements[5]).toFixed(2);
	stockInfo.volume = (parseInt(elements[8]) / 100).toFixed();
	stockInfo.turnover = (parseInt(elements[9]) / 10000).toFixed();
	stockInfo.hqdate = elements[30];
	stockInfo.hqtime = elements[31];
	if (stockInfo.open != 0) {
		stockInfo.chg = parseFloat(stockInfo.price - stockInfo.close).toFixed(2);
		stockInfo.chgRate = (parseFloat(stockInfo.chg / stockInfo.close)*100).toFixed(2);
	}

	return stockInfo;
}
function formatAllStock(hqStr){
	var rows = hqStr.split("\n");
	var rtn = new Array();
	for(var i=0 ; i < rows.length ; i++){
		stock = formatOneStock(rows[i]);
		if(false === stock) continue;
		else rtn.push(stock);
	}
	return rtn;
}
