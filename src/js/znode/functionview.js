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
			var funcArr = dataObj.funcs[funcName];
			// List where this function is called
			listUses(funcName, funcArr);
			// Add "add" box
			$("#funcViewAdd").html("<p>Add a new entry for where this function is used: ");
			$("#funcViewAdd").append("<input type='text' size='16' maxlength='32' id='funcViewAddTxt'>");
			$("#funcViewAdd").append("<input type='button' id='funcViewAddBtn' value='+' style='cursor:pointer'></input>");
			
			$("#funcViewAddBtn").click(function(){
				var entry = $("#funcViewAddTxt").val();
				// Check for entry in array
				if (funcArr.indexOf(entry) == -1) {
					// Add entry
					funcArr.push(entry);
					// Reload uses
					listUses(funcName, funcArr);
				}
			});
		});
	};
	
	function listUses(funcName,funcArr) {
		if (funcArr.length == 0) {
			$("#funcUseList").html("No entries for where "+funcName+" is used.");
		} else {
			$("#funcUseList").html(funcName+" is called in the following classes:");
			for (var i in funcArr){
				$("#funcUseList").append("<p>");
				// Remove button
				$("#funcUseList").append("<input type='button' id='funcViewDelBtn' value='X' style='cursor:pointer'></input>");
				// Use entry
				$("#funcUseList").append("<span>"+funcArr[i]+"</span>");
			}
		}
		$("#funcUseList input").click(function(){
			var entry = $(this).next().html();
			var index = funcArr.indexOf(entry);
			// perform deletion
			funcArr.splice(index,1);
			// reload uses
			listUses(funcName,funcArr);
		});
	};
	
}