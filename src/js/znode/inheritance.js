function InheritanceView(dataObj){
	
	var tree = $("#tree");
	var source = $("#sourceBoxInh");
	var editor = $("#editor");	
	
	this.reload = function() {
		
		// Clear tree & source
		clear();
		tree.html("Choose a file to view its inheritance information.")
		
		
		// Add class names
		$("#classListInh").html("Classes in project:");
		for (var i in dataObj.classes) {
			// Remove button
			$("#classListInh").append("<br><input type='button' value='X' style='cursor:pointer'></input>");
			// Class name
			$("#classListInh").append("<span>"+i+"</span>");
		}
		// Removing class
		$("#classListInh input").click(function(){
			var entry = $(this).next().html();
			// perform deletion
			delete dataObj.classes[entry];
			// reload
			loadLists();
		});
		// Add "add" box
		$("#classListInh").append("<br><input type='text' size='25' maxlength='32' id='classListInhAddTxt'>");
		$("#classListInh").append("<input type='button' id='classListInhAddBtn' value='+' style='cursor:pointer'></input>");
		$("#classListInhAddBtn").click(function(){
			var entry = $("#classListInhAddTxt").val();
			// Check for entry
			if (entry) {
				// Add entry
				if (!dataObj.classes[entry]) {
					dataObj.classes[entry] = new Object();
				}
				// Reload
				loadLists();
			}
		});
		
		// Behovior when selecting a class
		$("#classListInh span").click(function(){
			var className = $(this);
			var name = $(this).html();
			
			// Clear tree & source
			clear();
			
			// Superclass
			var superC = dataObj.supers[name];
			if (superC){
				tree.append('<div class="super"><input type="button" value="X" style="cursor:pointer"></input><span>'+superC.name+'</span></div>');
    			tree.append('<div class="subSuper"></div>');
    			
    			$(".super input").click(function(){
					// perform deletion
					delete dataObj.supers[name];
					// reload
					className.click();
				});
			}
			
			// Main class
			tree.append('<div class="mainClass"><span>'+name+'</span></div>');
			if (superC) {
				
				// Superclass function use
				$(".mainClass").last().append('<hr>Uses superclass functions:');
				for (var f in superC.funcs) {
					$(".mainClass").last().append('<p class="funcX"><input type="button" value="X" style="cursor:pointer"></input><span>'+superC.funcs[f]+'</span></p>');
				}
				// Deletion
				$(".funcX input").click(function(){
					var entry = $(this).next().html();
					var index = superC.funcs.indexOf(entry);
					// perform deletion
					superC.funcs.splice(index,1);
					// reload
					className.click();
					loadSource(name);
				});
				// Add "add" box
				$(".mainClass").append("<input type='text' size='20' maxlength='32' id='superFuncAddTxt'>");
				$(".mainClass").append("<input type='button' id='superFuncAddBtn' value='+' style='cursor:pointer'></input>");
				$("#superFuncAddBtn").click(function(){
					var entry = $("#superFuncAddTxt").val();
					// Check for entry
					if (entry) {
						if(!superC.funcs) {
							superC.funcs = new Array();
						}
						if (superC.funcs.indexOf(entry)==-1) {
							// Add entry
							superC.funcs.push(entry);
							// Reload
							className.click();
							$(".mainClass").click();
						}
					}
				});
				
				// Subclass var use
				$(".mainClass").last().append('<hr>Uses superclass variables:');
				for (var v in superC.vars) {
					$(".mainClass").last().append('<p class="varX"><input type="button" value="X" style="cursor:pointer"></input><span>'+superC.vars[v]+'</span></p>');
				}
				// Deletion
				$(".varX input").click(function(){
					var entry = $(this).next().html();
					var index = superC.vars.indexOf(entry);
					// perform deletion
					superC.vars.splice(index,1);
					// reload
					className.click();
					loadSource(name);
				});
				// Add "add" box
				$(".mainClass").append("<input type='text' size='20' maxlength='32' id='superVarAddTxt'>");
				$(".mainClass").append("<input type='button' id='superVarAddBtn' value='+' style='cursor:pointer'></input>");
				$("#superVarAddBtn").click(function(){
					var entry = $("#superVarAddTxt").val();
					// Check for entry
					if (entry) {
						if(!superC.vars) {
							superC.vars = new Array();
						}
						if (superC.vars.indexOf(entry)==-1) {
							// Add entry
							superC.vars.push(entry);
							// Reload
							className.click();
							$(".mainClass").click();
						}
					}
				});
			}
			
			// Subclasses
			var subs = dataObj.subs[name];
			for (var sub in subs) {
				tree.append('<div class="subL"></div>');
		    	tree.append('<div class="subStraight"></div>');
			    tree.append('<div class="sub"><input type="button" value="X" style="cursor:pointer"></input><span>'+subs[sub]+'</span></div>')
			}
			// Deletion
			$(".sub input").click(function(){
				var entry = $(this).next().text();
				var index = subs.indexOf(entry);
				// perform deletion
				subs.splice(index,1);
				// reload
				className.click();
			});
			// Add subclass button
			tree.append("<input type='button' class='subAddBtn' value='+' style='cursor:pointer; position:relative; left:100px; top:15px'></input>");
			$(".subAddBtn").click(function(){
				var subName = prompt("Enter a name for the subclass:");
				
				if(dataObj.subs[name] == undefined) {
					dataObj.subs[name] = new Array(subName);
					alert(dataObj.subs[name]);
					className.click();
				} else{	
					if (subName && subs.indexOf(subName)==-1) {
						subs.push(subName);
						// reload
						className.click();
						alert(subs);
					}
				}
			})
			
			// Show the tree
			$(document).ready(function() {
			    tree.show();
			    loadEditor(name,className);
			})
			
			// Behavior when selecting a subclass node
			$(".sub").click(function() {
				var selection = $(this).children("span").text();
				loadSource(selection);
			})
			// Behavior when selecting the superclass or main class node
			$(".super, .mainClass").click(function() {
				var selection = $(this).children("span").text();
				loadSource(selection);
			})
			
		})
		
		function loadSource(sel) {
			// If source not already loaded, load it
			if ($("#sourceBoxInh h4").text() != "Source code for "+sel+":") {
				source.html("<h4>Source code for "+sel+":</h4>");
				var code = dataObj.source[sel];
				if (code) {
					source.append("<pre>"+code+"</pre>");
				}
			}
			source.show();
			// Highlight func/var on click
			$(".mainClass span").click(function() {
				var highlighted = highlight( $("pre").text(),$(this).text());
				$("pre").html( highlighted );
			})
		}
		
		// Highlight selected funcs/vars
		function highlight(code, sel) {
			code = code.replace(sel, "<span class='highlight'>"+sel+"</span>");
			return code;
		}
		
		function loadEditor(sel,element) {
			editor.html("Set superclass for "+sel+": ");
			editor.append("<input type='text' size='20' maxlength='32' id='superEditTxt'>");
			editor.append("<input type='button' id='superEditBtn' value='change' style='cursor:pointer'></input>");
			// Superclass editor behavior
			$("#superEditBtn").click(function(){
					var entry = $("#superEditTxt").val();
					// Check for entry
					if (entry) {
						// Change
						if (!dataObj.supers[sel]) {
							dataObj.supers[sel] = new Object();
						}
						dataObj.supers[sel].name = entry;
						// Reload
						element.click();
					}
			});
			editor.show();
		}
		
		function clear() {
			tree.html("");
			tree.hide();
			source.html("");
			source.hide();
			editor.hide();
		}
	}
}