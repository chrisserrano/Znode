function GlobalsView(dataObj){
	
	this.reload = function() {
		$("#globalsUseList").hide();
		// Add class names
		$("#globalsList").html("Click a global to see its uses:");
		for (var i in dataObj.globals) {
			$("#globalsList").append("<h4>"+i+"</h4>");
		}
		// Behavior when clicking a global
		$("#globalsList h4").click(function(){
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
		$("#declared").append(struct.declared+"<br>");
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
		$("#init").append(struct.init+"<br>");
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