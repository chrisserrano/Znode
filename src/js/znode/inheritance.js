function InheritanceView(dataObj){
	
	var tree = $("#tree");
	var source = $("#sourceBoxInh");
	var editor = $("#editor");	
	
	this.reload = function() {
		
		// Clear tree & source
		clear();
		tree.html("Choose a file to view its inheritance information.")
		
		// List class names
		$("#classListInh").html("Files in project:");
		for (var i in dataObj.classes) {
			$("#classListInh").append("<h4>"+i+"</h4>");
		}
		
		// Behovior when selecting a class
		$("#classListInh h4").click(function(){
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
				});
				// Add "add" box
				$(".mainClass").append("<input type='text' size='20' maxlength='32' id='superFuncAddTxt'>");
				$(".mainClass").append("<input type='button' id='superFuncAddBtn' value='+' style='cursor:pointer'></input>");
				$("#superFuncAddBtn").click(function(){
					var entry = $("#superFuncAddTxt").val();
					// Check for entry
					if (entry && superC.funcs.indexOf(entry)==-1) {
						// Add entry
						superC.funcs.push(entry);
						// Reload
						className.click();
						$(".mainClass").click();
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
				});
				// Add "add" box
				$(".mainClass").append("<input type='text' size='20' maxlength='32' id='superVarAddTxt'>");
				$(".mainClass").append("<input type='button' id='superVarAddBtn' value='+' style='cursor:pointer'></input>");
				$("#superVarAddBtn").click(function(){
					var entry = $("#superVarAddTxt").val();
					// Check for entry
					if (entry && superC.vars.indexOf(entry)==-1) {
						// Add entry
						superC.vars.push(entry);
						// Reload
						className.click();
						$(".mainClass").click();
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
				if (subName && subs.indexOf(subName)==-1) {
					subs.push(subName);
					// reload
					className.click();
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
				loadSource(selection,superC);
				
			})
			
		})
		
		function loadSource(sel,superC) {
			source.html("<h4>Source code for "+sel+":</h4>");
			var code = dataObj.source[sel];
			if (code) {
				if(superC) {
					code = highlight(superC,code);
				}
				source.append("<pre>"+code+"</pre>");
			}
			source.fadeIn();
		}
		
		// Highlight the places in the code where the class uses superclass funcs/vars
		function highlight(superC,code) {
			for (var f in superC.funcs) {
				code = code.replace(superC.funcs[f], "<span class='highlight'>"+superC.funcs[f]+"</span>");
			}
			for (var v in superC.vars) {
				code = code.replace(superC.vars[v], "<span class='highlight'>"+superC.vars[v]+"</span>");
			}
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
			source.hide();
			editor.hide();
		}
	}
}