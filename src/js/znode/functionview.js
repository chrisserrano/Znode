function FunctionView(){
	var win = $(window);
	var view = $("#functionView");

	// Set up function view layout
	view.css({"height": win.height(), "width": win.width()});
	view.append("<div id=funcList></div>");
	var funcList = $("#funcList");
	funcList.css({"float": "left", "height": "100%", "width": "500px", "background-color": "gray"});
	
	view.append("<div id=funcDisplay></div>");
	var funcDisplay = $("#funcDisplay");
	funcDisplay.css({"float": "left", "height": "100%", "width": "500px", "background-color": "white"});
	
	this.reload = function() {
		
		if (window.XMLHttpRequest) {
		  // code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
		}
		else {
		  // code for IE6, IE5
		  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function() {
		  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		  	funcList.html(xmlhttp.responseText);
		  }
		}
		var sql = "mySQL/getFuncList.php";
		xmlhttp.open("GET",sql,true);
		xmlhttp.send();
	}
}