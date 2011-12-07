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
			var name = $(this).html();
			
			// Clear tree & source
			clear();
			
			// Superclass
			var superC = dataObj.supers[name];
			if (superC) {
				tree.append('<div class="super"><span>'+superC.name+'</span></div>');
    			tree.append('<div class="subSuper"></div>');
			}
			
			// Main class
			tree.append('<div class="mainClass"><span>'+name+'</span></div>');
			if (superC) {
				$(".mainClass").last().append('<hr>Uses superclass functions:');
				for (var f in superC.funcs) {
					$(".mainClass").last().append('<p>'+superC.funcs[f]+'</p>');
				}
				$(".mainClass").last().append('<hr>Uses superclass variables:');
				for (var v in superC.vars) {
					$(".mainClass").last().append('<p>'+superC.vars[v]+'</p>');
				}
			}
			
			// Subclasses
			var subs = dataObj.subs[name];
			for (var sub in subs) {
				tree.append('<div class="subL"></div>');
		    	tree.append('<div class="subStraight"></div>');
			    tree.append('<div class="sub"><span>'+subs[sub]+'</span></div>')
			}
			
			$(document).ready(function() {
				// Remove extra straight line
				$(".subStraight").last().remove();
				// A couple tweaks to show the last subclass properly
			    $("span").last().css("top", "5px");
			    $("span").last().css("left", "-35px");
			    tree.fadeIn();
			})
			
			// Behavior when selecting a superclass or subclass node
			$(".super, .sub").click(function() {
				editor.hide();
				var selection = $(this).children("span").html();
				loadSource(selection);
			})
			// Behavior when selecting the main class node
			$(".mainClass").click(function() {
				var selection = $(this).children("span").html();
				loadSource(selection);
				loadEditor(selection);
			})
			
		})
		
		function loadSource(sel) {
			source.hide();
			source.html("<h4>Source code for "+sel+":</h4>");
			var code = dataObj.source[sel];
			if (code) {
				source.append(dataObj.source[sel]);
			}
			source.fadeIn();
		}
		
		function loadEditor(sel) {
			editor.hide();
			editor.html(sel+ " EDITOR");
			editor.fadeIn();
		}
		
		function clear() {
			tree.html("");
			tree.hide();
			source.hide();
			editor.hide();
		}
	}
}