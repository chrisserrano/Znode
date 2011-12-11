function FunctionView(dataObj){
	
	this.reload = function() {
		loadLists();
	}
	
	function loadLists() {
		
		$("#classList").html("Classes in project:");
		$("#funcList").html("<h5>Choose class to see its function list.</h5>");
		$("#funcUseList").html("<h5>Choose a function to see where it is used.</h5>");
		$("#funcViewAdd").html("");
		
		// Add class names
		for (var i in dataObj.classes) {
			// Remove button
			$("#classList").append("<br><input type='button' value='X' style='cursor:pointer'></input>");
			// Class name
			$("#classList").append("<span style='cursor:pointer'>"+i+"</span>");
		}
		// Removing class
		$("#classList input").click(function(){
			var entry = $(this).next().html();
			// perform deletion
			delete dataObj.classes[entry];
			// reload
			loadLists();
		});
		
		// Add "add" box
		$("#classList").append("<br><input type='text' size='25' maxlength='32' id='classListAddTxt'>");
		$("#classList").append("<input type='button' id='classListAddBtn' value='+' style='cursor:pointer'></input>");
		$("#classListAddBtn").click(function(){
			var entry = $("#classListAddTxt").val();
			// Check for entry
			if (entry) {
				// Add entry
				dataObj.addClass(entry);
				// Reload
				loadLists();
			}
		});
		
		// Behovior when selecting a class
		$("#classList span").click(function(){
			$("#funcUseList").html("<h5>Choose a function to see where it is used.</h5>");
			$("#funcViewAdd").html("");
			
			var thisFunc = $(this);
			var name = $(this).html();
			$("#funcList").html("Functions of: "+name);
			for (var f in dataObj.classes[name]){
				// Remove button
				$("#funcList").append("<br><input type='button' value='X' style='cursor:pointer'></input>");
				// Add functions for that class
				$("#funcList").append("<span style='cursor:pointer'>"+f+"</span>");
			}
			// Removing function
			$("#funcList input").click(function(){
				var entry = $(this).next().html();
				delete dataObj.classes[name][entry];
				// reload
				thisFunc.click();
			});
			
			// Add "add" box
			$("#funcList").append("<br><input type='text' size='25' maxlength='32' id='funcListAddTxt'>");
			$("#funcList").append("<input type='button' id='funcListAddBtn' value='+' style='cursor:pointer'></input>");
			$("#funcListAddBtn").click(function(){
				var entry = $("#funcListAddTxt").val();
				// Check for entry
				if (entry) {
					// Add entry
					if (!dataObj.classes[name][entry]) {
						dataObj.classes[name][entry] = new Array();
					}
					// Reload
					thisFunc.click();
				}
			})
			
			// Behavior when clicking a function
			$("#funcList span").click(function(){
				var funcName = $(this).html();
				var funcArr = dataObj.classes[name][funcName];
				// List where this function is called
				listUses(funcName, funcArr);
				// Add "add" box
				$("#funcViewAdd").html("<br><input type='text' size='25' maxlength='32' id='funcViewAddTxt'>");
				$("#funcViewAdd").append("<input type='button' id='funcViewAddBtn' value='+' style='cursor:pointer'></input>");
				
				$("#funcViewAddBtn").click(function(){
					var entry = $("#funcViewAddTxt").val();
					// Check for entry
					if (entry) {
						if (!funcArr) {
							funcArr = new Array();
						}
						if(funcArr.indexOf(entry)==-1) {
							// Add entry
							funcArr.push(entry);
							// Reload uses
							listUses(funcName, funcArr);
						}
					}
				})
			})
		})
	}
	
	// Reload just the Uses (rightmost) pane
	function listUses(funcName,funcArr) {
		if (funcArr.length == 0) {
			$("#funcUseList").html("No entries for where "+funcName+" is used.");
		} else {
			$("#funcUseList").html(funcName+" is called in the following places:");
			for (var i in funcArr){
				// Remove button
				$("#funcUseList").append("<br><input type='button' value='X' style='cursor:pointer'></input>");
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