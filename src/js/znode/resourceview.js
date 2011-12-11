function ResourceView(dataObj){
	
	this.reload = function() {
		loadLists();
	}
	
	function loadLists() {		
		$("#resourceInfo").hide();
		$("#preview").hide();
		
		// Add class names
		$("#resourceList").html("Resources in project:");
		for (var i in dataObj.resources) {
			// Remove button
			$("#resourceList").append("<br><input type='button' value='X' style='cursor:pointer'></input>");
			// Name
			$("#resourceList").append("<span style='cursor:pointer'>"+i+"</span>");
		}
		
		// Removing resource
		$("#resourceList input").click(function(){
			var entry = $(this).next().html();
			// perform deletion
			delete dataObj.resources[entry];
			// reload
			loadLists();
		});
		
		// Add "add" box
		$("#resourceList").append("<br><input type='text' size='25' maxlength='32' id='resourcesListAddTxt'>");
		$("#resourceList").append("<input type='button' id='resourcesListAddBtn' value='+' style='cursor:pointer'></input>");
		$("#resourcesListAddBtn").click(function(){
			var entry = $("#resourcesListAddTxt").val();
			// Check for entry
			if (entry) {
				// Add entry
				if (!dataObj.resources[entry]) {
					dataObj.resources[entry] = new Object();
					dataObj.resources[entry].used = new Array();
				}
				// Reload
				loadLists();
			}
		});
		
		// Behavior when clicking an item
		$("#resourceList span").click(function(){
			$("#preview").hide();
			$("#resourceInfo").fadeIn();
			var name = $(this).html();
			var struct = dataObj.resources[name];
			listUses(name, struct);
		});
	};
	
	// Reload the Uses (rightmost) pane
	function listUses(name, struct) {
		listUrl(name, struct);
		showPreview(struct);
	}
	
	function listUrl(name, struct) {
		$("#url").html(name+" URL:<br>");
		if (struct.url != undefined) {
			$("#url").append("<span>"+struct.url+"</span><br>");
		} else {
			$("#url").append("<i>undefined</i><br>");
		}
		// Add/change box
		$("#url").append("<input type='text' size='25' maxlength='32' id='urlTxt'>");
		$("#url").append("<input type='button' id='urlBtn' value='edit' style='cursor:pointer'></input>");
		// Button behavior
		$("#urlBtn").click(function(){
			if ($("#urlTxt").val()) {
				struct.url = $("#urlTxt").val();
				listUrl(name, struct);
			}
		});
	}
	
	function showPreview(struct) {
		var ext = struct.url.substr(-3);
		// Check if resource is image, JavaScript, or HTML
		if (ext == "png" || "jpg" || "gif") {
			$("#preview").html("<img style='max-width: 400px; max-height: 400px' src='"+struct.url+"'/>");
			$("#preview").fadeIn();
		} else if (ext == ".js") {
			$("#preview").html("<i>JavaScript file</i>");
			$("#preview").fadeIn();
		} else if (struct.url.substr(-5) == ".html") {
			$("#preview").html("<i>HTML file</i>");
			$("#preview").fadeIn();
		}
	}
}