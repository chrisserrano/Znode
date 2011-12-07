function FunctionView(dataObj){
	
	this.reload = function() {
		// Add class names
		$("#classList").html("Files in project:");
		$("#funcList").html("<h5>Choose file to see its function list.</h5>");
		$("#funcUseList").html("<h5>Choose a function to see where it is used.</h5>");
		for (var i in dataObj.classes) {
			$("#classList").append("<h4>"+i+"</h4>");
		}
		// Behovior when selecting a class
		$("#classList h4").click(function(){
			var name = $(this).html();
			$("#funcList").html("Functions of: "+i);
			for (var f in dataObj.classes[name]){
				// Add functions for that class
				$("#funcList").append("<h4>"+f+"</h4>");
			}
			// Behavior when clicking a function
			$("#funcList h4").click(function(){
				var funcName = $(this).html();
				var funcArr = dataObj.funcs[funcName];
				// List where this function is called
				listUses(funcName, funcArr);
				// Add "add" box
				$("#funcViewAdd").html("<br><input type='text' size='25' maxlength='32' id='funcViewAddTxt'>");
				$("#funcViewAdd").append("<input type='button' id='funcViewAddBtn' value='+' style='cursor:pointer'></input>");
				
				$("#funcViewAddBtn").click(function(){
					var entry = $("#funcViewAddTxt").val();
					// Check for entry
					if (entry && funcArr.indexOf(entry)==-1) {
						// Add entry
						funcArr.push(entry);
						// Reload uses
						listUses(funcName, funcArr);
					}
				});
			});
		});
	};
	
	// Reload just the Uses (rightmost) pane
	function listUses(funcName,funcArr) {
		if (funcArr.length == 0) {
			$("#funcUseList").html("No entries for where "+funcName+" is used.");
		} else {
			$("#funcUseList").html(funcName+" is called in the following places:");
			for (var i in funcArr){
				$("#funcUseList").append("<p>");
				// Remove button
				$("#funcUseList").append("<input type='button' value='X' style='cursor:pointer'></input>");
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