function FunctionView(dataObj){
	
	this.reload = function() {
		// Add class names
		$("#classList").html("List of classes in project:");
		$("#funcList").html("<h5>Choose class to see its function list.</h5>");
		$("#funcUseList").html("<h5>Choose a function to see where it is used.</h5>");
		for (var c in dataObj.classes) {
			$("#classList").append("<h4>"+c+"</h4>");
		}
		$("#classList h4").click(function(){
			var className = $(this).html();
			$("#funcList").html("Functions of: "+c);
			for (var f in dataObj.classes[className]){
				// Add functions for that class
				$("#funcList").append("<h4>"+f+"</h4>");
			}
			readyFuncList();
		});
	};
	
	function readyFuncList(){
		$("#funcList h4").click(function(){
			var funcName = $(this).html();
			$("#funcUseList").html(funcName+" is called in the following classes:");
			for (var i in dataObj.funcs[funcName]){
				// Add where functions are called
				$("#funcUseList").append("<h4>"+dataObj.funcs[funcName][i]+"</h4>");
			}
		});
	};
	
}