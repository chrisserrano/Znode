function CompView(dataObj){
	
	this.reload = function() {
		loadLists();
	}
	
	function loadLists() {
		// Add class names
		$("#compList").html("Composed classes in project:");
		$("#compUseList").html("<h5>Choose a composed class to see its where it is used.</h5>");
		$("#compDetailsList").html("<h5>Choose a class to see its detailed usage.</h5>");
		for (var i in dataObj.comps) {
			// Remove button
			$("#compList").append("<br><input type='button' value='X' style='cursor:pointer'></input>");
			// Class name
			$("#compList").append("<span>"+i+"</span>");
		}
		// Removing class
		$("#compList input").click(function(){
			var entry = $(this).next().html();
			// perform deletion
			delete dataObj.comps[entry];
			// reload
			loadLists();
		});
		
		// Add "add" box
		$("#compList").append("<br><input type='text' size='25' maxlength='32' id='compListAddTxt'>");
		$("#compList").append("<input type='button' id='compListAddBtn' value='+' style='cursor:pointer'></input>");
		$("#compListAddBtn").click(function(){
			var entry = $("#compListAddTxt").val();
			// Check for entry
			if (entry) {
				// Add entry
				if (!dataObj.comps[entry]) {
					dataObj.comps[entry] = new Object();
				}
				// Reload
				loadLists();
			}
		});
		
		// Behovior when selecting a class
		$("#compList span").click(function(){
			$("#compDetailsList").html("<h5>Choose a function to see where it is used.</h5>");
			$("#compDetailsAdd").html("");
			
			var thisFunc = $(this);
			var name = $(this).html();
			$("#compUseList").html("Functions of: "+i);
			for (var f in dataObj.comps[name]){
				// Remove button
				$("#compUseList").append("<br><input type='button' value='X' style='cursor:pointer'></input>");
				// Add functions for that class
				$("#compUseList").append("<span>"+f+"</span>");
			}
			// Removing function
			$("#compUseList input").click(function(){
				var entry = $(this).next().html();
				delete dataObj.comps[name][entry];
				// reload
				thisFunc.click();
			});
			
			// Add "add" box
			$("#compUseList").append("<br><input type='text' size='25' maxlength='32' id='compUseAddTxt'>");
			$("#compUseList").append("<input type='button' id='compUseAddBtn' value='+' style='cursor:pointer'></input>");
			$("#compUseAddBtn").click(function(){
				var entry = $("#compUseAddTxt").val();
				// Check for entry
				if (entry) {
					// Add entry
					if (!dataObj.comps[name][entry]) {
						dataObj.comps[name][entry] = new Object();
						//if (!dataObj.funcs[entry]) {
						//	dataObj.funcs[entry] = new Array();
						//}
					}
					// Reload
					thisFunc.click();
				}
			})
			
			// Behavior when clicking item in middle pane
			$("#compUseList span").click(function(){
				var className = $(this).html();
				$("#compDetailsList").html("");
				listFuncUses(dataObj.comps[name][className],name,$(this));
				$("#compDetailsList").append("<br>");
				listVarUses(dataObj.comps[name][className],name,$(this));
			})
		})
	}
	
	// Reload just the Uses (rightmost) pane
	function listFuncUses(className,classNameTxt,reclick) {
		
		$("#compDetailsList").append(classNameTxt+" blah blah functions:");
		for (var i in className.compFuncs){
			// Remove button
			$("#compDetailsList").append("<br><input type='button' value='X' class='compFuncsDelBtn' style='cursor:pointer'></input>");
			// Use entry
			$("#compDetailsList").append("<span>"+className.compFuncs[i]+"</span>");
		}
		
		$(".compFuncsDelBtn").click(function(){
			var entry = $(this).next().html();
			var index = className.compFuncs.indexOf(entry);
			// perform deletion
			className.compFuncs.splice(index,1);
			// reload uses
			reclick.click();
		});
		
		// Add "add" box
		$("#compDetailsList").append("<br><input type='text' size='25' maxlength='32' id='compFuncsAddTxt'>");
		$("#compDetailsList").append("<input type='button' class='compFuncsAddBtn' value='+' style='cursor:pointer'></input>");
		
		$(".compFuncsAddBtn").click(function(){
			var entry = $("#compFuncsAddTxt").val();
			// Check for entry
			if (entry && className.compFuncs.indexOf(entry)==-1) {
				// Add entry
				className.compFuncs.push(entry);
				// Reload uses
				reclick.click();
			}
		})
	};
	
	// Reload just the Uses (rightmost) pane
	function listVarUses(className,classNameTxt,reclick) {
		
		$("#compDetailsList").append(classNameTxt+" blah blah variables:");
		for (var i in className.compVars){
			// Remove button
			$("#compDetailsList").append("<br><input type='button' class='compVarsDelBtn' value='X' style='cursor:pointer'></input>");
			// Use entry
			$("#compDetailsList").append("<span>"+className.compVars[i]+"</span>");
		}
		
		$(".compVarsDelBtn").click(function(){
			var entry = $(this).next().html();
			var index = className.compVars.indexOf(entry);
			// perform deletion
			className.compVars.splice(index,1);
			// reload uses
			reclick.click();
		});
		
		// Add "add" box
		$("#compDetailsList").append("<br><input type='text' size='25' maxlength='32' id='compVarsAddTxt'>");
		$("#compDetailsList").append("<input type='button' class='compVarsAddBtn' value='+' style='cursor:pointer'></input>");
		
		$(".compVarsAddBtn").click(function(){
			var entry = $("#compVarsAddTxt").val();
			// Check for entry
			if (entry && className.compVars.indexOf(entry)==-1) {
				// Add entry
				className.compVars.push(entry);
				// Reload uses
				reclick.click();
			}
		})
	};
	
}