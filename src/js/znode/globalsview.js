function GlobalsView(dataObj){
	
	this.reload = function() {
		loadLists();
	}
	
	function loadLists() {		
		$("#globalsUseList").hide();
		// Add class names
		$("#globalsViewList").html("Global variables in project:");
		for (var i in dataObj.globals) {
			// Remove button
			$("#globalsViewList").append("<br><input type='button' value='X' style='cursor:pointer'></input>");
			// Global name
			$("#globalsViewList").append("<span style='cursor:pointer'>"+i+"</span>");
		}
		
		// Removing global
		$("#globalsViewList input").click(function(){
			var entry = $(this).next().html();
			// perform deletion
			delete dataObj.globals[entry];
			// reload
			loadLists();
		});
		
		// Add "add" box
		$("#globalsViewList").append("<br><input type='text' size='25' maxlength='32' id='globalsListAddTxt'>");
		$("#globalsViewList").append("<input type='button' id='globalsListAddBtn' value='+' style='cursor:pointer'></input>");
		$("#globalsListAddBtn").click(function(){
			var entry = $("#globalsListAddTxt").val();
			// Check for entry
			if (entry) {
				// Add entry
				if (!dataObj.globals[entry]) {
					dataObj.globals[entry] = new Object();
					dataObj.globals[entry].changes = new Array();
					dataObj.globals[entry].used = new Array();
				}
				// Reload
				loadLists();
			}
		});
		
		
		// Behavior when clicking a global
		$("#globalsViewList span").click(function(){
			$("#globalsUseList").fadeIn();
			var name = $(this).html();
			var struct = dataObj.globals[name];
			listUses(name, struct);
		});
	};
	
	// Reload the Uses (rightmost) pane
	function listUses(name, struct) {
		listDeclared(name, struct);
		listInit(name, struct);
		listChanges(name, struct.changes);
		listUsed(name, struct.used);
	}
	
	function listDeclared(name, struct) {
		$("#declared").html(name+" declared in:<br>");
		if (struct.declared != undefined) {
			$("#declared").append("<span>"+struct.declared+"</span><br>");
		} else {
			$("#declared").append("<i>undefined</i><br>");
		}
		// Add/change box
		$("#declared").append("<input type='text' size='25' maxlength='32' id='declaredTxt'>");
		$("#declared").append("<input type='button' id='declaredBtn' value='edit' style='cursor:pointer'></input>");
		// Button behavior
		$("#declaredBtn").click(function(){
			if ($("#declaredTxt").val()) {
				struct.declared = $("#declaredTxt").val();
				listDeclared(name, struct);
			}
		});
	}
	
	function listInit(name, struct) {
		$("#init").html("<br>"+name+" initialized in:<br>");
		if (struct.init != undefined) {
			$("#init").append("<span>"+struct.init+"</span><br>");
		} else {
			$("#init").append("<i>undefined</i><br>");
		}
		// Add/change box
		$("#init").append("<input type='text' size='25' maxlength='32' id='initTxt'>");
		$("#init").append("<input type='button' id='initBtn' value='edit' style='cursor:pointer'></input>");
		// Button behavior
		$("#initBtn").click(function(){
			if ($("#initTxt").val()) {
				struct.init = $("#initTxt").val();
				listInit(name, struct);
			}
		});
	}
	
	function listChanges(name, changes) {
		$("#changes").html("<br>"+name+" changes value in:<br>");
		for (var i in changes) {
			// Remove button
			$("#changes").append("<input type='button' class='delChanges' value='X' style='cursor:pointer'></input>");
			// Entry
			$("#changes").append("<span>"+changes[i]+"</span><br>");
		}
		// Add "add" box
		$("#changes").append("<input type='text' size='25' maxlength='32' id='changesTxt'>");
		$("#changes").append("<input type='button' id='changesBtn' value='+' style='cursor:pointer'></input>");
		$("#changesBtn").click(function(){
			var entry = $("#changesTxt").val();
			// Check for entry in array
			if (entry && changes.indexOf(entry)==-1) {
				// Add entry
				changes.push(entry);
				// Reload uses
				listChanges(name, changes);
			}
		});
		// Remove button behavior
		$(".delChanges").click(function(){
			var entry = $(this).next().html();
			var index = changes.indexOf(entry);
			// perform deletion
			changes.splice(index,1);
			// reload uses
			listChanges(name,changes);
		});
	}
	
	function listUsed(name, used) {
		$("#used").html("<br>"+name+" used in:<br>");
		for (var i in used) {
			// Remove button
			$("#used").append("<input type='button' class='delUsed' value='X' style='cursor:pointer'></input>");
			// Entry
			$("#used").append("<span>"+used[i]+"</span><br>");
		}
		// Add "add" box
		$("#used").append("<input type='text' size='25' maxlength='32' id='usedTxt'>");
		$("#used").append("<input type='button' id='usedBtn' value='+' style='cursor:pointer'></input>");
		$("#usedBtn").click(function(){
			var entry = $("#usedTxt").val();
			// Check for entry in array
			if (entry && used.indexOf(entry)==-1) {
				// Add entry
				used.push(entry);
				// Reload uses
				listUsed(name, used);
			}
		});
		// Remove button behavior
		$(".delUsed").click(function(){
			var entry = $(this).next().html();
			var index = used.indexOf(entry);
			// perform deletion
			used.splice(index,1);
			// reload uses
			listUsed(name,used);
		});
	}
}